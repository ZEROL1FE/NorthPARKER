const API_BASE = "https://northparker.onrender.com";

// Check for session
const session = JSON.parse(localStorage.getItem('session') || '{}');
if (!session.token) {
  alert('Please login to view your order history.');
  window.location.href = 'login.html';
}

function authHeader() {
  const session = JSON.parse(localStorage.getItem("session") || "{}");
  return session.token ? { Authorization: "Bearer " + session.token } : {};
}

async function fetchOrderHistory() {
  try {
    const res = await fetch(`${API_BASE}/orders`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch order history');
    const allOrders = await res.json();

    const myOrders = allOrders.filter(
      o => o.userEmail === session.email
    );

    renderHistory(myOrders);
  } catch (err) {
    console.error(err);
    document.getElementById('historyList').innerHTML =
      `<p class="no-history">Error loading history: ${err.message}</p>`;
  }
}

function renderHistory(orders) {
  const container = document.getElementById('historyList');
  if (!orders.length) {
    container.innerHTML = `<p class="no-history">No order history found.</p>`;
    return;
  }

  container.innerHTML = orders.map(order => {
    const itemList = order.items.map(item =>
      `<li>${item.name} x${item.quantity} - ₱${(item.quantity * item.price).toFixed(2)}</li>`
    ).join('');

    const total = order.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ).toFixed(2);

    const formattedDate = new Date(order.createdAt).toLocaleString();

    return `
      <div class="history-entry">
        <h4>Table ${order.table}</h4>
        <div class="date">${formattedDate}</div>
        <ul>${itemList}</ul>
        <div class="total">Total: ₱${total}</div>
      </div>
    `;
  }).join('');
}

fetchOrderHistory();