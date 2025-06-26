// Initialize menu on page load
document.addEventListener("DOMContentLoaded", () => {
    loadMenuItems();
    displayMenuItems();
});

// Select admin form elements
const addItemForm = document.getElementById("add-item-form");
const menuList = document.getElementById("menu-list");

// Default menu items
const defaultItems = [
    {
        id: 1,
        name: "China Chicken",
        price: "₱428.00",
        image: "https://c.animaapp.com/YbRZsaiC/img/rectangle-3@2x.png",
        description: "Succulent, tender and juicy half chicken marinated with oriental spices deep-fried.",
        quantity: 0,
    },
    {
        id: 2,
        name: "Imported Broccoli Flower",
        price: "₱228.00",
        image: "https://c.animaapp.com/YbRZsaiC/img/rectangle-4@2x.png",
        description: "Crisp broccoli florets lavishly poured with premium oyster sauce.",
        quantity: 0,
    },
    {
        id: 3,
        name: "Shanghai Chicken",
        price: "₱428.00",
        image: "https://c.animaapp.com/YbRZsaiC/img/rectangle-3-1@2x.png",
        description: "Traditionally pan-roasted half chicken served with a sweet tangy sauce.",
        quantity: 0,
    },
    {
        id: 4,
        name: "Sweet and Sour Fish Fillet",
        price: "₱308.00",
        image: "https://c.animaapp.com/YbRZsaiC/img/rectangle-3-2@2x.png",
        description: "Thinly sliced fish fillet, deep-fried then coated with our sweet and sour sauce.",
        quantity: 0,
    }
];

// Load menu items from localStorage or use defaults
let menuItems = JSON.parse(localStorage.getItem("menuItems")) || defaultItems;

// Save updated menu items to localStorage
function saveMenu() {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
}

// Load menu items into the menu container
function loadMenuItems() {
    const menuContainer = document.getElementById("menuContainer");
    if (!menuContainer) {
        console.error("menuContainer not found!");
        return;
    }

    menuContainer.innerHTML = "";

    // Render each menu item
    menuItems.forEach((item, index) => {
        const itemHTML = `
        <div class="menu-item" data-id="${index}">
            <img src="${item.image}" alt="${item.name}" />
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price-controls">
                    <span class="price">${item.price}</span>
                    <div class="quantity-control">
                        <button class="minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="plus">+</button>
                    </div>
                </div>
            </div>
        </div>`;
        menuContainer.innerHTML += itemHTML;
    });

    attachQuantityHandlers();
}

// Ensure all quantities start at zero
function setDefaultQuantities() {
    menuItems.forEach(item => item.quantity = 0);
    saveMenu();
}

// Handle + and - button clicks
function attachQuantityHandlers() {
    const menuContainer = document.getElementById("menuContainer");
    if (!menuContainer) return;

    menuContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("plus") || e.target.classList.contains("minus")) {
            const itemElement = e.target.closest(".menu-item");
            if (!itemElement) return;

            const itemIndex = parseInt(itemElement.dataset.id);
            let quantity = menuItems[itemIndex].quantity || 0;

            // Update quantity based on button clicked
            if (e.target.classList.contains("plus")) {
                quantity++;
            } else if (e.target.classList.contains("minus") && quantity > 0) {
                quantity--;
            }

            // Update and save quantity
            menuItems[itemIndex].quantity = quantity;
            saveMenu();

            // Update display
            itemElement.querySelector(".quantity").textContent = quantity;
        }
    });
}

// Display admin menu items
function displayMenuItems() {
    menuList.innerHTML = "";
    menuItems.forEach((item, index) => {
        const menuItem = document.createElement("div");
        menuItem.innerHTML = `
            <p><strong>${item.name}</strong> - ${item.price}</p>
            <p>${item.description || "No description available."}</p>
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="max-width: 100px;">` : ""}
            <button onclick="deleteItem(${index})">Delete</button>
            <hr>
        `;
        menuList.appendChild(menuItem);
    });
}

// Add new menu item from admin form
addItemForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("item-name").value;
    const price = document.getElementById("item-price").value;
    const image = document.getElementById("item-image").value;
    const description = document.getElementById("item-description").value;

    // Create new item with default quantity of 0
    const newItem = { id: Date.now(), name, price, image, description, quantity: 0 };

    // Add new item and update UI
    menuItems.push(newItem);
    saveMenu();
    addItemForm.reset();
    displayMenuItems();
    loadMenuItems();
});

// Delete menu item
function deleteItem(index) {
    menuItems.splice(index, 1);
    saveMenu();
    displayMenuItems();
    loadMenuItems();
}
