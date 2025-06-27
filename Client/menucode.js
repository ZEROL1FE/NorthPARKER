const state = {
  selectedCategory: "Popular",
  searchQuery: "",
  menuItems: [],
  categories: [],
  orderItems: [] 
}

window.menuItems = [];
function getSession () {
  try { return JSON.parse(localStorage.getItem("session") || "{}"); }
  catch { return {}; }
}
function authHeader () {
  const { token } = getSession();
  return token ? { Authorization: "Bearer " + token } : {};
}
function redirectToLogin () {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

/* Guard: kick out unauthenticated users immediately */
if (!getSession().token) redirectToLogin();


// Loads the menu from DB

async function loadMenuFromDatabase() {
  try {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) throw new Error("Failed to fetch menu");

    const menu = await res.json();   // ⇒ [{ _id, name, price, … }]
    window.menuItems = menu.map(m => ({
      ...m,
      id: m._id,
      quantity: 0
    }));
    syncStateMenuItems();

    // Build category list
    const catSet = new Set();
    window.menuItems.forEach((it) =>
      (it.categories?.length ? it.categories : ["All"]).forEach((c) =>
        catSet.add(c)
      )
    );
    window.menuItems.sort((a, b) => {
      const catA = (a.categories?.[0] || "").toLowerCase();
      const catB = (b.categories?.[0] || "").toLowerCase();
      if (catA === catB) return a.name.localeCompare(b.name);
      return catA.localeCompare(catB);
    });

    state.categories = Array.from(catSet).sort();
    state.selectedCategory = state.categories.includes("Popular")
      ? "Popular"
      : state.categories[0];
    
    renderCategories();
    renderMenuItems();
    updateStats();
  } catch (err) {
    console.error("Menu load error → showing empty menu", err);
    window.menuItems = [];
    renderCategories();
    renderMenuItems();
  }
}

state.menuItems = window.menuItems;

// Helper to sync state.menuItems after any change to window.menuItems
function syncStateMenuItems() {
  state.menuItems = window.menuItems;
}



// Display menu items in grid (deprecated, use renderMenuItems)
function displayMenuItems() { /* deprecated, do nothing */ }


// Load menu from admin database


// Load default menu (fallback)
function loadDefaultMenu() {
  // Use the default menu items as fallback
  state.menuItems = window.menuItems;

  // Extract unique categories from all menu items
  const allCategories = new Set();
  state.menuItems.forEach(item => {
    if (item.categories && Array.isArray(item.categories)) {
      item.categories.forEach(cat => allCategories.add(cat));
    }
  });

  // Save the sorted unique categories to state
  state.categories = Array.from(allCategories).sort();

  // Optionally, set the default selected category
  state.selectedCategory = state.categories.includes("Popular") ? "Popular" : state.categories[0];

  // Re-render categories and menu
  renderCategories();
  renderMenuItems();
}


// Debug: Log loaded menu items
console.log('[DEBUG] Loaded menuItems from localStorage:', state.menuItems);

// Get table limits from localStorage

// Filter menu items based on search query
function getFilteredMenuItems() {
  let filtered = state.menuItems.filter((item) => {
    const searchLower = state.searchQuery.toLowerCase();
    // Check if item matches search and selected category
    const matchesSearch = item.name.toLowerCase().includes(searchLower);
    const matchesCategory = item.categories && item.categories.includes(state.selectedCategory);
    return matchesSearch && matchesCategory;
  });
  // Debug: Log filtered items
  console.log('[DEBUG] Filtered menuItems for category', state.selectedCategory, ':', filtered);
  // Fallback: If no items match the selected category, show all items
  if (filtered.length === 0 && state.menuItems.length > 0) {
    console.warn('[DEBUG] No items found for category', state.selectedCategory, '. Showing all items as fallback.');
    filtered = state.menuItems;
  }
  return filtered;
}

// Render category buttons
function renderCategories() {
  const categoriesNav = document.getElementById("categories");
  if (!categoriesNav) return;

  // Ensure categories are loaded
  if (!state.categories || state.categories.length === 0) {
    console.warn("No categories available");
    return;
  }

  // Render the trigger and dropdown content
  categoriesNav.innerHTML = `
    <div style="position: relative; width: 220px;">
      <button class="category-dropdown-trigger" id="categoryDropdownTrigger" type="button">
        <span id="selectedCategoryLabel">${state.selectedCategory}</span>
        <span class="category-dropdown-arrow">&#9662;</span>
      </button>
      <div class="category-dropdown-content" id="categoryDropdownContent">
        ${state.categories
          .map(
            (category) => `
              <button class="category-dropdown-item${state.selectedCategory === category ? ' active' : ''}" data-category="${category}">${category}</button>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  // Dropdown logic
  const trigger = document.getElementById("categoryDropdownTrigger");
  const dropdown = document.getElementById("categoryDropdownContent");

  if (trigger && dropdown) {
    // Toggle dropdown
    trigger.onclick = function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("show");
      
      if (isOpen) {
        dropdown.classList.remove("show");
        trigger.classList.remove("active");
      } else {
        dropdown.classList.add("show");
        trigger.classList.add("active");
      }
    };
    
    // Handle category selection
    dropdown.querySelectorAll(".category-dropdown-item").forEach((item) => {
      item.onclick = function (e) {
        e.stopPropagation();
        const category = this.getAttribute("data-category");
        window.handleCategoryClick(category);
        dropdown.classList.remove("show");
        trigger.classList.remove("active");
        // Update label
        document.getElementById("selectedCategoryLabel").textContent = category;
      };
    });
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function closeDropdown(e) {
      if (!categoriesNav.contains(e.target)) {
        dropdown.classList.remove("show");
        trigger.classList.remove("active");
      }
    });
  }
}

// Highlight search terms in text
function highlightSearch(text) {
  if (!state.searchQuery) return text;
  const regex = new RegExp(`(${state.searchQuery})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// Add this function to update stats
function updateStats() {
  const totalItemsElement = document.getElementById('totalMenuItems');
  const totalCategoriesElement = document.getElementById('totalCategories');
  if (totalItemsElement) totalItemsElement.textContent = window.menuItems.length;
  if (totalCategoriesElement) {
    const uniqueCategories = new Set(window.menuItems.flatMap(item => item.categories || ['All']));
    totalCategoriesElement.textContent = uniqueCategories.size;
  }
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
    updateStats();
    return;
  }

  filteredItems.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");

    // Fix: handle invalid price
    const priceValue = Number(item.price);
    const displayPrice = isNaN(priceValue) ? "0.00" : priceValue.toFixed(2);

    // Admin controls
    if (window.isAdminPage) {
      menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="menu-item-image" />
        <div class="menu-item-content">
          <h3 class="menu-item-title">${item.name}</h3>
          <p class="menu-item-description">${item.description}</p>
          <div class="price-controls">
            <span class="price">₱${displayPrice}</span>
          </div>
          <div class="menu-item-actions">
            <button class="edit-btn" data-id="${item.id}"}>Edit</button>
            <button class="delete-btn" data-id="${item.id}" }>Delete</button>
          </div>
        </div>
      `;
    } else {
      // Client controls
      menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="menu-item-image" />
        <div class="menu-item-content">
          <h3 class="menu-item-title">${item.name}</h3>
          <p class="menu-item-description">${item.description}</p>
          <div class="price-controls">
            <span class="price">₱${displayPrice}</span>
            <div class="quantity-control">
              <button class="minus" onclick="updateQuantity('${item.id}',-1)" ${item.soldOut ? "disabled" : ""}>−</button>
              <span class="quantity">${item.quantity}</span>
              <button class="plus"  onclick="updateQuantity('${item.id}',1)" ${item.soldOut ? "disabled" : ""}>+</button>
            </div>
          </div>
          ${item.soldOut ? '<div style="color:#ff4444;font-weight:bold;">Sold Out</div>' : ''}
        </div>
      `;
    }
    menuContainer.appendChild(menuItem);
  });
  updateStats();
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
      (item) => {
        const priceValue = Number(item.price);
        const displayPrice = isNaN(priceValue) ? "0.00" : priceValue.toFixed(2);
        const totalValue = isNaN(priceValue) ? 0 : priceValue * item.quantity;
        const displayTotal = isNaN(totalValue) ? "0.00" : totalValue.toFixed(2);
        return `
          <div class="order-item">
            <div class="order-item-details">
              <div class="order-item-name">${item.name}</div>
              <div class="order-item-price">
                <span>&#8369;</span>${displayPrice}
                <div class="qty-controls">
                  <button onclick="decreaseQty('${item.name}')">−</button>
                  <span>${item.quantity}</span>
                  <button onclick="increaseQty('${item.name}')">+</button>
                </div>
              </div>
            </div>
            <div class="order-item-total">
              <span>&#8369;</span>${displayTotal}
            </div>
          </div>
        `;
      }
    )
    .join("");

  totalAmountElement.innerHTML = `&#8369;${total.toFixed(2)}`;

  window.increaseQty = function (itemName) {
    const item = state.orderItems.find(i => i.name === itemName);
    if (item) {
      item.quantity += 1;
      renderOrderItems();
    }
  };

  window.decreaseQty = function (itemName) {
    const itemIndex = state.orderItems.findIndex(i => i.name === itemName);
    if (itemIndex !== -1) {
      if (state.orderItems[itemIndex].quantity > 1) {
        state.orderItems[itemIndex].quantity -= 1;
      } else {
        // Remove item if quantity reaches 0
        state.orderItems.splice(itemIndex, 1);
      }
      renderOrderItems();
    }
  };
}

// Initialize search input handler
document.addEventListener("DOMContentLoaded", () => {
  loadMenuFromDatabase();
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

  renderCategories();
  renderMenuItems();
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

window.handleCheckout = async function () {
  if (state.orderItems.length === 0) {
    alert("Add items first."); return;
  }

  /* ---- 1. validate table # ---- */
  const tblInp   = document.getElementById("tableNumber");
  const tableNum = Number(tblInp?.value);
  const { min = 1, max = 20 } = JSON.parse(localStorage.getItem("tableLimits") || "{}");

  if (!tableNum || isNaN(tableNum) || tableNum < min || tableNum > max) {
    alert(`Enter a table number between ${min} and ${max}`);
    return;
  }

  /* ---- 2. build payload ---- */
  const payload = {
    table : tableNum,
    items: state.orderItems.map(({ id, name, price, quantity }) => ({
      menuId: id, name, price, quantity
    })),
    status: "pending"
  };

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader()
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // server may return { error:"…" }
      const { error = "Order failed" } = await res.json();
      throw new Error(error);
    }

    /* ---- 3. server replied OK -> save order locally ---- */
    const order = await res.json();          // { _id, … }
    localStorage.setItem("lastOrder", JSON.stringify(order));

    /* ---- 4. clear UI cart ---- */
    state.orderItems = [];
    window.menuItems.forEach(it => (it.quantity = 0));
    renderMenuItems();
    renderOrderItems();

    /* ---- 5. go to payment page ---- */
    window.location.href = `payment.html?id=${order._id}`;

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

function saveOrderToHistory(tableNumber, orderItems, total) {
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
  // Get user info from session
  const session = JSON.parse(localStorage.getItem('session') || '{}');
  orderHistory.push({
    tableNumber,
    items: [...orderItems],
    total,
    date: new Date().toLocaleString(),
    userEmail: session.email || "",
    userName: session.name || ""
  });
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

// Add missing toggleMenu function
window.toggleMenu = function() {
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu) {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
  }
};

// Add logout function
window.logout = function () {
  localStorage.removeItem("session");
  window.location.href = "login.html";
};

// Update all admin actions to call saveMenuItems and renderMenuItems after changes
// Example for soldout-btn (already present):
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('soldout-btn')) {
    const id  = String(e.target.getAttribute('data-id'));   
    const idx = window.menuItems.findIndex(
      (item) => String(item.id) === id                      
    );

    if (idx !== -1) {
      window.menuItems[idx].soldOut = !window.menuItems[idx].soldOut;

      // TODO: if you later persist to MongoDB, call a REST PATCH here instead
      saveMenuItems();         
      syncStateMenuItems();     
      renderMenuItems();

      alert(
        window.menuItems[idx].soldOut
          ? 'Item marked as Sold Out.'
          : 'Item is now available.'
      );
    }
  }
});