// Initialize state and functions
const state = {
  selectedCategory: "Popular",
  searchQuery: "",
  menuItems: JSON.parse(localStorage.getItem("menuItems")) || [],
  categories: [
    "All",
    "Popular",
    "Noodles",
    "Congee",
    "Soups",
    "Fried Rice",
    "Signature Dishes",
    "Rice Meals",
    "Chicken",
    "Fish",
    "Pork",
    "Beef",
    "Vegetarian",
    "Hotpot",
    "Dimsum",
    "Dessert",
    "Drinks",
  ],
  orderItems: [],
};

const tableLimits = JSON.parse(localStorage.getItem('tableLimits')) || { min: 1, max: 20 };

// Filter menu items based on search query
function getFilteredMenuItems() {
  return state.menuItems.filter((item) => {
    const searchLower = state.searchQuery.toLowerCase();
    // Check if item matches search and selected category
    const matchesSearch = item.name.toLowerCase().includes(searchLower);
    const matchesCategory = item.categories.includes(state.selectedCategory);
    return matchesSearch && matchesCategory;
  });
}

// Render category buttons
function renderCategories() {
  const categoriesNav = document.getElementById("categories");
  if (!categoriesNav) return;

  categoriesNav.innerHTML = state.categories
    .map(
      (category) => `
      <button
        class="category-button ${state.selectedCategory === category ? "active" : ""}"
        onclick="handleCategoryClick('${category}')"
      >
        ${category}
      </button>
    `,
    )
    .join("");
}

// Highlight search terms in text
function highlightSearch(text) {
  if (!state.searchQuery) return text;
  const regex = new RegExp(`(${state.searchQuery})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// Render menu items
function renderMenuItems() {
  const menuContainer = document.getElementById("menuContainer");
  const filteredItems = getFilteredMenuItems();

  menuContainer.innerHTML = ""; // Clear previous

  if (filteredItems.length === 0) {
    menuContainer.innerHTML = `
      <div class="no-results">
        <p>No results found.</p>
        
      </div>`;
    return;
  }

  filteredItems.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");

    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="menu-item-content">
        <h3>${highlightSearch(item.name)}</h3>
        <p>${highlightSearch(item.description)}</p>
        <div class="price-controls">
          <span class="price">₱${item.price.toFixed(2)}</span>
          <div class="quantity-control">
            <button class="minus" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="plus" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `;

    menuContainer.appendChild(menuItem);
  });
}

// Render order items
function renderOrderItems() {
  const orderItemsContainer = document.getElementById("orderItems");
  const totalAmountElement = document.getElementById("totalAmount");

  if (!orderItemsContainer || !totalAmountElement) return;

  const total = state.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  orderItemsContainer.innerHTML = state.orderItems
    .map(
      (item) => `
      <div class="order-item">
        <div class="order-item-details">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-price">
            <span>&#8369;</span>${item.price.toFixed(2)} x ${item.quantity}
          </div>
        </div>
        <div class="order-item-total">
          <span>&#8369;</span>${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    `,
    )
    .join("");

  totalAmountElement.innerHTML = `&#8369;${total.toFixed(2)}`;
}

// Initialize search input handler
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");
  if (!searchInput) return;

  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value;
      renderMenuItems();
    }, 300);
  });

  // Load saved table number if exists
  const savedTableNumber = localStorage.getItem("tableNumber");
  if (savedTableNumber) {
    const tableInput = document.getElementById("tableNumber");
    if (tableInput) {
      tableInput.value = savedTableNumber;
    }
  }
});

// Global functions for HTML event handlers
window.clearSearch = function () {
  state.searchQuery = "";
  const searchInput = document.querySelector(".search-input");
  if (searchInput) searchInput.value = "";
  renderMenuItems();
};

window.toggleOrderForm = function () {
  const orderSection = document.getElementById("orderSection");
  const overlay = document.getElementById("overlay");

  if (orderSection && overlay) {
    orderSection.classList.toggle("hidden");
    overlay.classList.toggle("visible");

    if (!orderSection.classList.contains("hidden")) {
      renderOrderItems();
    }
  }
};

window.handleCategoryClick = function (category) {
  state.selectedCategory = category;
  renderCategories();
  renderMenuItems();
};

window.updateQuantity = function (id, increment) {
  state.menuItems = state.menuItems.map((item) => {
    if (item.id === id) {
      const newQuantity = Math.max(0, item.quantity + increment);

      if (increment > 0) {
        const existingOrderItem = state.orderItems.find(
          (orderItem) => orderItem.id === id,
        );
        if (existingOrderItem) {
          existingOrderItem.quantity = newQuantity;
        } else {
          state.orderItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
          });
        }
      } else if (increment < 0) {
        const existingOrderItem = state.orderItems.find(
          (orderItem) => orderItem.id === id,
        );
        if (existingOrderItem) {
          if (newQuantity === 0) {
            state.orderItems = state.orderItems.filter(
              (orderItem) => orderItem.id !== id,
            );
          } else {
            existingOrderItem.quantity = newQuantity;
          }
        }
      }

      return {
        ...item,
        quantity: newQuantity,
      };
    }
    return item;
  });

  renderMenuItems();
  renderOrderItems();
};

window.handleCheckout = function () {
  if (state.orderItems.length === 0) {
    alert("Please add items to your order first.");
    return;
  }

  const tableInput = document.getElementById("tableNumber");
  const tableNumber = tableInput.value.trim();

  const tableNum = Number(tableNumber);

  if (
    !tableNumber ||
    isNaN(tableNum) ||
    tableNum < tableLimits.min ||
    tableNum > tableLimits.max ||
    !Number.isInteger(tableNum)
  ) {
    alert('Please enter a valid *whole number* between 1 and ' + tableLimits.max + '.');
    tableInput.focus();
    return;
  }

  localStorage.setItem("tableNumber", tableNumber);

  const total = state.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderSummary = state.orderItems
    .map(
      (item) =>
        `${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");

  alert(
    `Order Summary:\n` +
      `Table Number: ${tableNumber}\n` +
      `------------------\n` +
      `${orderSummary}\n` +
      `------------------\n` +
      `Total Amount: ₱${total.toFixed(2)}\n\n` +
      `Thank you for your order!`
  );

  state.orderItems = [];
  state.menuItems = state.menuItems.map((item) => ({ ...item, quantity: 0 }));
  saveOrderToHistory(tableNumber, state.orderItems, total);

  renderMenuItems();
  renderOrderItems();
  toggleOrderForm();
  window.location.reload();
};
function saveOrderToHistory(tableNumber, orderItems, total) {
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

  orderHistory.push({
    tableNumber,
    items: [...orderItems], 
    total,
    date: new Date().toLocaleString(), 
  });

  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

// Render the order history section
function renderOrderHistory() {
  const historyContainer = document.getElementById("orderHistoryContainer");
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

  if (!historyContainer) return;

  if (orderHistory.length === 0) {
    historyContainer.innerHTML = "<p>No previous orders.</p>";
    return;
  }

  historyContainer.innerHTML = orderHistory
    .map((order, index) => {
      const itemsHtml = order.items
        .map(
          (item) =>
            `<li>${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}</li>`
        )
        .join("");

      return `
        <div class="history-entry">
          <h4>Order #${index + 1} - Table ${order.tableNumber}</h4>
          <p><strong>Date:</strong> ${order.date}</p>
          <ul>${itemsHtml}</ul>
          <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
          <hr>
        </div>
      `;
    })
    .join("");
}



// Add this inside your handleCheckout() function, before resetting the cart:



// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderOrderHistory();
  renderCategories();
  renderMenuItems();
  renderOrderItems();
});
function logout() {
  localStorage.removeItem('currentUser'); // or whatever key you're using to track login
  alert('You have been logged out.');
  window.location.href = 'login.html'; // Redirect to login page
}
if (!localStorage.getItem('currentUser')) {
  alert('You must be logged in to access this page.');
  window.location.href = 'login.html';
}

  // Toggle the dropdown menu
  function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    // Toggle the menu visibility
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
  }

// Close the dropdown menu if clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.menu-button') && !event.target.matches('.dropdown-content a')) {
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    }
  }
}