const API_BASE = "https://northparker.onrender.com";

const token = localStorage.getItem('session');
if (!token) {
  alert('Please login to view your order history.');
  window.location.href = 'login.html';
}

async function fetchOrderHistory() {
  try {
    // grab the session we saved at login/signup
    const session = JSON.parse(localStorage.getItem('session') || '{}');

    // if there’s no token, kick the user to the login page
    if (!session.token) {
      window.location.href = 'login.html';
      return;
    }

    const res = await fetch(`${API_BASE}/orders`, {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch order history');
    const orders = await res.json();
    renderHistory(orders);           // your existing renderer
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
      `<li>${item.name} x${item.qty} - ₱${(item.qty * item.price).toFixed(2)}</li>`
    ).join('');

    const total = order.items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2);
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