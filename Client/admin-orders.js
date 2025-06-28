const API_BASE = "https://northparker.onrender.com";
function getCurrentAdminEmail() {
  let email = null;
  try {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session && session.email) email = session.email;
  } catch (e) {}
  if (!email) {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user && user.email) email = user.email;
    } catch (e) {}
  }
  return email;
}

function isAdmin() {
  try {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session && session.role === 'admin') return true;
  } catch (e) {}
  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.role === 'admin') return true;
  } catch (e) {}
  return false;
}


function filterOrders(orders, search, payment) {
  search = search.trim().toLowerCase();
  return orders.filter(order => {
    /* ----- SEARCH ----- */
    let matchesSearch = true;
    if (search) {
      const user  = (order.userEmail || '').toLowerCase();
      const table = (order.table + '').toLowerCase();          // <── table, not tableNumber
      const items = (order.items || []).map(i => i.name.toLowerCase()).join(' ');
      matchesSearch = user.includes(search) || table.includes(search) || items.includes(search);
    }
    /* ----- PAYMENT FILTER ----- */
    let matchesPayment = true;
    if (payment) matchesPayment = order.paymentMethod === payment;
    return matchesSearch && matchesPayment;
  });
}

async function renderAllOrders() {
  if (!localStorage.getItem('session')) {
      alert('You must be logged in to access this page.');
      window.location.href = 'login.html';
  } else if (!isAdmin()) {
    alert('You must be an admin to view this page.');
    window.location.href = 'login.html';
    return;
  }
  const container = document.getElementById('ordersTableContainer');
  const session = JSON.parse(localStorage.getItem("session"));

//------------------------------------------------------------------------

  
  const res = await fetch(`${API_BASE}/orders`, { headers: authHeader() });
  const orders = await res.json();

  const search  = document.getElementById('searchInput')?.value || '';
  const payment = document.getElementById('paymentFilter')?.value || '';
  const filtered = filterOrders(orders, search, payment);

  if (!filtered.length) {
    container.innerHTML = '<div class="no-orders">No orders found.</div>';
    return;
  }

  let html = `<table class="orders-table"><thead><tr>
      <th>#</th><th>User</th><th>Table</th><th>Date</th>
      <th>Items</th><th>Total</th><th>Payment</th><th>Action</th>
    </tr></thead><tbody>`;

  filtered.forEach((order, idx) => {
    const itemsLi = order.items
      .map(i => `<li>${i.name} x${i.quantity} – ${formatPeso(i.quantity * i.price)}</li>`)
      .join('');

    const total = order.items
      .reduce((sum, i) => sum + i.quantity * i.price, 0);

    const payLabel = order.paymentMethod
      ? ({ cash:'Cash', gcash:'GCash', card:'Credit/Debit Card' }[order.paymentMethod] || order.paymentMethod)
      : '<i>Not set</i>';

    html += `<tr>
        <td>${idx + 1}</td>
        <td>${order.userEmail || '<i>Unknown</i>'}
            ${order.userName ? `<br><small>${order.userName}</small>` : ''}</td>
        <td>${order.table}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td><ul class="items-list">${itemsLi}</ul></td>
        <td>${formatPeso(total)}</td>
        <td>${payLabel}</td>
        <td><button class="delete-order-btn" data-order-id="${order._id}">Delete</button></td>
      </tr>`;
  });

  html += '</tbody></table>';
  container.innerHTML = html;

  // Add delete button event listeners
  container.querySelectorAll(".delete-order-btn").forEach(btn => {
    btn.addEventListener("click", async function () {
      if (!confirm("Delete this order?")) return;

      const orderId = this.dataset.orderId;
      const session = JSON.parse(localStorage.getItem("session"));

      try {
        const res = await fetch(`${API_BASE}/orders/${orderId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session?.token || ""}` }
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Delete failed");
        }

        alert("Order deleted.");
        renderAllOrders();        // refresh list
      } catch (err) {
        alert("Could not delete: " + err.message);
      }
    });
  });
}

async function exportOrdersToCSV() {
  const res = await fetch(`${API_BASE}/orders`, { headers: authHeader() });
  const orders = await res.json();
  const search  = document.getElementById('searchInput')?.value || '';
  const payment = document.getElementById('paymentFilter')?.value || '';
  const filtered = filterOrders(orders, search, payment);
  if (!filtered.length) return alert('No orders to export.');

  let csv = 'Order#,User Email,Table,Date,Items,Total,Payment Method\n';
  filtered.forEach((o,i)=>{
    const items = o.items.map(it=>`${it.name} x${it.quantity} (${formatPeso(it.quantity*it.price)})`).join('; ');
    const total = o.items.reduce((s,it)=>s+it.quantity*it.price,0);
    const pay   = o.paymentMethod || '';
    csv += `${i+1},"${o.userEmail||''}",${o.table},"${new Date(o.createdAt).toLocaleString()}","${items}",${total},${pay}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  renderAllOrders();
  document.getElementById('searchInput').addEventListener('input', renderAllOrders);
  document.getElementById('paymentFilter').addEventListener('change', renderAllOrders);
  document.getElementById('exportCsvBtn').addEventListener('click', exportOrdersToCSV);
});