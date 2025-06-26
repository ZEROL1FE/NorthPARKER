const state = {
  selectedCategory: "Popular",
  searchQuery: "",
  categories: [
    "All", "Popular", "Noodles", "Congee", "Soups", "Fried Rice",
    "Signature Dishes", "Rice Meals", "Chicken", "Fish", "Pork", "Beef",
    "Vegetarian", "Hotpot", "Dimsum", "Dessert", "Drinks"
  ]
};

let menuItems = JSON.parse(localStorage.getItem("menuItems")) || defaultItems;

state.menuItems = JSON.parse(localStorage.getItem("menuItems")) || [defaultItems];
window.addEventListener('storage', function(e) {
  if (e.key === 'menuItems') {
    state.menuItems = JSON.parse(localStorage.getItem("menuItems")) || [defaultItems];
    renderMenuItems();
  }
});

function deleteItem(index) {
  state.menuItems.splice(index, 1);
  localStorage.setItem("menuItems", JSON.stringify(state.menuItems));
  renderMenuItems();
}

// Edit item by index
function editItem(index) {
  const item = state.menuItems[index];
  // Store the item's id in localStorage
  localStorage.setItem('editMenuItemId', item.id);
  // Redirect to admin.html
  window.location.href = 'admin.html';
}

function getFilteredMenuItems() {
  return state.menuItems.filter((item) => {
    const searchLower = state.searchQuery.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchLower);
    const matchesCategory = Array.isArray(item.categories) && item.categories.includes(state.selectedCategory);
    return matchesSearch && matchesCategory;
  });
}
function highlightSearch(text) {
  if (!state.searchQuery) return text;
  const regex = new RegExp(`(${state.searchQuery})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
// Get the container
const menuContainer = document.getElementById("menuContainer");

// Function to display menu items
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

  filteredItems.forEach((item, idx) => {
    // Find the index in the full menuItems array for editing/deleting
    const realIndex = state.menuItems.findIndex(i => i.id === item.id);

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
        <div class="admin-controls">
          <button onclick="editItem(${realIndex})">Edit</button>
          <button onclick="deleteItem(${realIndex})">Delete</button>
        </div>
      </div>
    `;

    menuContainer.appendChild(menuItem);
  });
}

// Run render function
renderMenuItems();
// logout handler
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
document.addEventListener("DOMContentLoaded", function() {
  renderCategories();
  renderMenuItems();

  // Add search input handler
  const searchInput = document.querySelector('.search-bar input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener("input", function(e) {
      state.searchQuery = e.target.value;
      renderMenuItems();
    });
  }
});
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
    `
    )
    .join("");
}
window.handleCategoryClick = function (category) {
  state.selectedCategory = category;
  renderCategories();
  renderMenuItems();
};
