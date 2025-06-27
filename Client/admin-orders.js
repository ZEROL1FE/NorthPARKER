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
    let matchesSearch = true;
    if (search) {
      const user = (order.userEmail || '').toLowerCase();
      const table = (order.tableNumber + '').toLowerCase();
      const items = (order.items || []).map(i => i.name.toLowerCase()).join(' ');
      matchesSearch = user.includes(search) || table.includes(search) || items.includes(search);
    }
    let matchesPayment = true;
    if (payment) {
      matchesPayment = order.paymentMethod === payment;
    }
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
  const res = await fetch(`${API_BASE}/orders`, {
    headers: {
      Authorization: `Bearer ${session?.token || ""}`
    }
  });
  const orderHistory = await res.json();
  const search = document.getElementById('searchInput')?.value || '';
  const payment = document.getElementById('paymentFilter')?.value || '';
  const filteredOrders = filterOrders(orderHistory, search, payment);
  if (!filteredOrders.length) {
    container.innerHTML = '<div class="no-orders">No orders found.</div>';
    return;
  }
  let table = `<table class='orders-table'>
    <thead>
      <tr>
        <th>#</th>
        <th>User Email / Name</th>
        <th>Table</th>
        <th>Date</th>
        <th>Items</th>
        <th>Total</th>
        <th>Payment Method</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>`;

  filteredOrders.forEach((order, idx) => {
    const itemsHtml = order.items.map(item => `<li>${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}</li>`).join('');
    let paymentLabel = '';
    if (order.paymentMethod) {
      if (order.paymentMethod === 'cash') paymentLabel = 'Cash';
      else if (order.paymentMethod === 'gcash') paymentLabel = 'GCash';
      else if (order.paymentMethod === 'card') paymentLabel = 'Credit/Debit Card';
      else paymentLabel = order.paymentMethod;
    }
    table += `<tr>
      <td>${idx + 1}</td>
      <td>
        ${order.userEmail || '<i>Unknown</i>'}
        ${order.userName ? `<br><span style="font-size:12px;color:#888;">${order.userName}</span>` : ""}
      </td>
      <td>${order.tableNumber}</td>
      <td>${order.date}</td>
      <td><ul class='items-list'>${itemsHtml}</ul></td>
      <td>₱${order.total.toFixed(2)}</td>
      <td>${paymentLabel || '<i>Not set</i>'}</td>
      <td>
        <button class="delete-order-btn"
                data-order-id="${order._id}"
                style="background:#ff4444;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;">
          Delete
        </button>
      </td>
    </tr>`;
  });
  table += '</tbody></table>';
  container.innerHTML = table;

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
  const session = JSON.parse(localStorage.getItem("session"));
  const res = await fetch(`${API_BASE}/orders`, {
    headers: {
      Authorization: `Bearer ${session?.token || ""}`
    }
  });
  const orderHistory = await res.json();
  const search = document.getElementById('searchInput')?.value || '';
  const payment = document.getElementById('paymentFilter')?.value || '';
  const filteredOrders = filterOrders(orderHistory, search, payment);
  if (!filteredOrders.length) {
    alert('No orders to export.');
    return;
  }
  let csv = 'Order #,User Email,Table,Date,Items,Total,Payment Method\n';
  filteredOrders.forEach((order, idx) => {
    const items = order.items.map(item => `${item.name} x${item.quantity} (₱${(item.price * item.quantity).toFixed(2)})`).join('; ');
    let paymentLabel = '';
    if (order.paymentMethod === 'cash') paymentLabel = 'Cash';
    else if (order.paymentMethod === 'gcash') paymentLabel = 'GCash';
    else if (order.paymentMethod === 'card') paymentLabel = 'Credit/Debit Card';
    else paymentLabel = order.paymentMethod || '';
    csv += `${idx + 1},"${order.userEmail || ''}",${order.tableNumber},"${order.date}","${items}",${order.total.toFixed(2)},${paymentLabel}\n`;
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