// admin.js

// Select elements
const addItemForm = document.getElementById("add-item-form");
const menuList = document.getElementById("menu-list");
function getNextItemId() {
    if (menuItems.length === 0) return 1;
    const maxId = Math.max(...menuItems.map(item => item.id || 0));
    return maxId + 1;
  }
// Original menu items (default items)
const defaultItems = [
    {
      id: 1,
      name: "China Chicken",
      description:
        "Succulent, tender and juicy half chicken marinated with oriental spices deep-fried. An original best seller since the birth of NORTH PARK!",
      price: 428.0,
      image: "signatures/China Chicken.png",
      quantity: 0,
      categories: ["All","Popular", "Chicken", "Signature Dishes"],
    },
    {
      id: 2,
      name: "Imported Broccoli Flower in Oyster Sauce",
      description:
        "Crisp broccoli florets lavishly poured with premium oyster sauce. Recommended for vegetarian customers. High in flavonoids, low in calorie!",
      price: 228.0,
      image: "vegetarian/Brocolli.png",
      quantity: 0,
      categories: ["All","Popular", "Vegetarian"],
    },
    {
      id: 3,
      name: "Shanghai Chicken",
      description:
        "Pan-roasted chicken served with sweet tangy sauce. A must-try for all chicken lovers!",
      price: 428.0,
      image: "signatures/Shanghai Chicken.png",
      quantity: 0,
      categories: ["All","Popular", "Chicken", "Signature Dishes"],
    },
    {id: 4,
      name: "Sweet and Sour Fish Fillet",
      description:
        "Deep-fried fish fillet with sweet and sour sauce. A delightful dish that balances flavors perfectly!",
      price: 308.0,
      image: "signatures/SweetnSour Fish.png",
      quantity: 0,
      categories: ["All","Popular", "Fish"],
    },
    {id: 5,
      name: "taipao",
      description:
         "asdadasdasdasd",
      price: 300.0,
      image: "dimsum/taipao.png",
      quantity: 0,
      categories: ["All","Dimsum"],
    },
    {id: 6,
      name: "fresh prawn dumplings",
      description:
        "A classic dimsum dish made with fresh prawns wrapped in a delicate rice flour skin.",
      price: 240.0,
      image: "dimsum/fresh prawn dumpling.png",
      quantity: 0,
      categories: ["All","Dimsum"],
    },
    {id: 7,
      name: "Bola Bola",
      description: 
        "A savory meatball made with ground pork and spices, served with a sweet and sour sauce.",
      price: 180.0,
      image: "dimsum/bola bola.png",
      quantity: 0,
      categories: ["All","Dimsum"],
    },
    {id: 8,
      name: "Asado Pao",
      description:
        "A steamed bun filled with tender and flavorful asado pork, perfect for a quick snack or meal.",
      price: 200.0,
      image: "dimsum/asado pao.png",
      quantity: 0,
      categories: ["All","Dimsum"],
    },
    {id: 9,
      name: "Soft Tofu Veggie Stir-Fry",
      description:
        "A healthy and delicious stir-fry made with soft tofu and a variety of fresh vegetables, seasoned with soy sauce and sesame oil.",
      price: 398.0,
      image: "vegetarian/Tofu Stir-Fry.png",
      quantity: 0,
      categories: ["All","Vegetarian"],
    },
    {
      id: 10,
      name: "Cold Chrysanthemum Juice",
      description:
        "Refreshing juice of naturally sweetened herbal infusion chrysanthemum.",
      price: 65.0,
      image: "drinks/cold chrysanthemum.png",
      quantity: 0,
      categories: ["All","Drinks"],
    },
    {id: 11,
      name: "Cold Soya Bean Milk",
      description: 
        "A refreshing healthy delicious drink vitamin enriched with isoflavones. Safe for people who are lactose intolerant.",
      price: 78.0,
      image: "drinks/cold soya bean.png",
      quantity: 0,
      categories: ["All","Drinks"],
     },
     {
      id: 12,
      name: "Nestea Iced Tea",
      description: "Cool down with a glass of Nestea Iced Tea.",
      image: "drinks/nestea.png",
      price: 63.0,
      quantity: 0,
      categories: ["All","Drinks"],
     },
     {id: 13,
      name: "Fresh Lemonade- it's a must!",
      description: "A truly refreshing drink with no pre-made ingredients, using freshly squeezed imported whole lemon. NORTH PARKs own creation.",
      image: "drinks/fresh lemonade.png",
      price: 83.0,
      quantity: 0,
      categories: ["All","Drinks"],
     },
     {id: 14,
      name: "Four Seasons",
      description: "A delectable fruit drink that encompasses the goodness of fresh tropical fruits. A refreshing blend of mango,pineapple, guyabano and calamansi to tantalize your taste buds.",
      image: "drinks/four season.png",
      price:143.0,
      quantity: 0,
      categories: ["All","Drinks"],
     },
     {id: 15,
      name: "Apple Juice",
      description: "No - added sugar apple juice.",
      image: "drinks/apple juice.png",
      price: 78.0,
      quantity: 0,
      categories: ["All","Drinks"],
     },
     {id: 16,
      name: "Honey Lemonade",
      description: "Freshly squeezed lemon juice extracted from real whole lemons sweetened with honey.",
      image: "drinks/honey lemonade.png",
      price: 88.0,
      quantity: 0,
      categories: ["All","Drinks"],
     },
     {id: 17,
     name: "Nestea Lemon Iced Tea",
     description: 
      "Cool down with a glass of Nestea Iced Tea with Slices of Lemon.",
     image: "drinks/nestea lemon.png",
     price: 78.0,
     quantity: 0,
     categories: ["All","Drinks"],
     },
     {
      id: 18,
      name: "Fried Bread with Cream Dip",
      description: "Steamed bread deep fried and served with a creamy dip.",
      image: "dessert/fried.png",
      price: 118.0,
      quantity: 0,
      categories: ["All","Dessert"],
      },
      {
      id: 19,
      name: "Gabi Butchi",
      description: "Deep fried taro balls filled with salted eggyolk coated with sesame seeds. An authentic Chinese dessert!",
      image: "dessert/butchi.png",
      price: 88.0,
      quantity: 0,
      categories: ["All","Dessert"],
      },
      {
      id: 20,
      name: "Almond Jelly with Lychee",
      description: "A refreshing bowl of almond flavored jelly topped with lychees, with sugar syrup.",
      image: "dessert/DSSRT000003.png",
      price: 128.0,
      quantity: 0,
      categories: ["All","Dessert"],
      },
      {
      id: 21,
      name: "Herb Jelly with Lychee",
      description: "A bowl of cooling grass jelly topped with lychees, with sugar syrup",
      image: "dessert/herb jelly.png",
      price: 128.0,
      quantity: 0,
      categories: ["All","Dessert"],
      },
      {
      id: 22,
      name: "Almond Jelly with Fresh Mango",
      description: "A bowl of stimulating almond flavored jelly topped with fresh mango cubes and snow ice.",
      image: "dessert/almond jelly.png",
      price: 143.0,
      quantity: 0,
      categories: ["All","Dessert"],
      },
      {
      id: 23,
      name: "Fresh Mango Tapioca", 
      description: "A flavorful mixture of smooth, luscious tree-ripened mango halves mixed with crystal sago, topped with fresh mango bits and snow ice. PERFECT MEAL ENDER!",
      image: "dessert/fresh mango.png",
      price: 188.0, 
      quantity: 0,
      categories: ["All","Dessert"],
      },
      {
      id: 24,
      name: "Black and White Gulaman with Sago",
      description: "An all time Pinoy Favorite. Combination of herb and almond jelly cubes with sweetened tapioca pearls on shaved ice with gulaman syrup.",
      image: "dessert/black and white.png",
      price: 133.0,
      quantity: 0,
      categories: ["All","Dessert"],
      },
      {
      id: 25,
      name: "Ice Cold Espresso",
      description: 
        "A refreshing espresso drink served cold, perfect for coffee lovers.",
      image: "dessert/ice cold.png",
      price: 88.0,
      quantity: 0,
      categories: ["All","Dessert", "Drinks"],
      },
      {
      id: 26,
      name: "Nanking Beef and Tendon with Raddish Hot Pot",
      description: "Succulent chunks of beef, stewed for 3-hours in naturally brewed soy sauce under low fire, combined with flavorful, gelatinous achilles beef tendons, and thick slices of raddish.",
      image: "hotpot/nanking.png",
      price: 448.0,
      quantity: 0,
      categories: ["All","Hotpot","Beef"],
      },
      {
      id: 27,
      name: "Fish Fillet with Soft Tofu in Tausi Hot Pot",
      description: "Fish fillet with soft tofu perfectly cooked in special sauce, premium oyster and black bean sauce.",
      image: "hotpot/fish.png",
      price: 348.0,
      quantity: 0,
      categories: ["All","Hotpot","Fish"],
      },
      {
      id: 28,
      name: "Lechon Macau with Eggplant Hot Pot", 
      description: "Charcoal broiled crispy, juicy pork belly with slices of eggplant in shrimp paste sauce.",
      image: "hotpot/lechon.png",
      price: 538.0,
      quantity: 0,
      categories: ["All","Hotpot","Pork"],
      },
      {
      id: 30,
      name: "Roast Combination Platter",
      description: "A festive platter of BBQ pork asado, steamed white chicken, Soy Sauce chicken, Lapcheong and century egg wedges.",
      image: "chicken/roast.png",
      price: 848.0,
      quantity: 0,
      categories: ["All","Chicken","Dimsum","Pork"],
      },
      {
      id: 31,
      name: "BBQ Pork Asado Roast Specialty",
      description: "Charcoal-roasted pork asado basted with premium honey.",
      image: "chicken/bbq.png",
      price: 258.0,
      quantity: 0,
      categories: ["All","Pork","Dimsum"],
      },
      {
      id: 32,
      name: "Dried Pork Sausage Roast Specialty",
      description: "Air dried chinese sausage",
      image: "chicken/ssg.png",
      price: 298.0,
      quantity: 0,
      categories: ["All","Pork"],
      },
      {
      id: 33,
      name: "Lechon Macau Roast Specialty", 
      description: "Charcoal broiled crispy, juicy pork belly.",
      image: "chicken/macau.png",
      price: 408.0,
      quantity: 0,
      categories: ["All","Pork"],
      },
      {
      id: 34,
      name: "Plain Congee", 
      description: "Plain Congee no toppings.",
      image: "congee/CNGEE006000.png",
      price: 103.0,
      quantity: 0,
      categories: ["Congee","All"],
      },
      {
      id: 35,
      name: "Pork Bola-Bola Congee",
      description: "House recipe lean pork meatballs. Served with fresh egg and crispy wanton chips. 3 pieces for Light, 6 pieces for Regular.",
      image: "congee/CNGEE001000.png",
      price: 158.0,
      quantity: 0,
      categories: ["Congee","Pork","All"],
      },
      {
      id: 36,
      name: "Chicken Ball with Shiitake Mushroom Congee ",
      description:
      "House recipe ground chicken breast meatballs, shiitake mushrooms. Served with fresh egg and crispy wanton chips. 3 pieces for Light, 6 pieces for Regular. ", 
      image: "congee/CNGEE002000.png",
      price: 153.0,
      quantity: 0 ,
      categories:["Congee","Chicken","All"],
      },
      {
      id: 37,
      name: " Fresh Fish Fillet Blanched in Congee",
      description:
      " Heart healthy, thinly sliced fresh fish fillet, blanched in Congee. Served with fresh egg and crispy wanton chips.", 
      image: "congee/CNGEE003000.png",
      price: 163.0,
      quantity: 0,
      categories:["All","Congee","Fish"],
      },
      {
      id: 38,
      name: "Shredded Pork with Century Egg & Szechuan and Vegetable Congee ",
      description:
      " Lean pork strips with century egg and vegetable preserved Szechuan style. Served with fresh egg and crispy wanton chips.", 
      image: "congee/CNGEE004000.png",
      price: 168.0,
      quantity: 0,
      categories:["All","Pork","Congee"],
      },
      {
      id: 39,
      name: " Sliced Tender Beef Congee",
      description:
      "Slices of grass-fed beef tenderloin. Served with fresh egg and crispy wanton chips. ", 
      image: "congee/CNGEE005000.png" ,
      price: 223.0,
      quantity: 0,
      categories:["Beef","All","Congee"],
      },
      {
      id: 40,
      name: " Crystal Prawn in Congee with Shiitake Mushroom",
      description:
      "Sea-caught prawn. Served with fresh egg and crispy wanton chips. ", 
      image: "congee/SCNGE001000.png",
      price: 238.0 ,
      quantity: 0,
      categories:["All","Congee"],
      },
      {
      id: 41,
      name: "Steamed Rice Served with White Chicken",
      description: "Steamed white chicken, quarter serving.",
      image: "rice/steamedrice.png",
      price: 273.0,
      quantity: 0,
      categories: ["Rice Meals"],
      },
      {
      id: 42,
      name: "Steamed Rice Served with Nanking Beef",
      description: "Succulent, tender, chunky beef 3-hours stewed in naturally brewed soy sauce under low fire. A NORTH PARK Original!",
      image: "rice/steamednanking.png",
      price: 328.0,
      quantity: 0,
      categories: ["Rice Meals"],
      },
      {
      id: 43,
      name: "Steamed Rice Served with Aniseed Beef Tendon", 
      description: "A slow food classic. Flavorful, gelatinous achilles beef tendons, rich in protein. A sure kick!",
      image: "rice/beeftendo.png",
      price: 348.0,
      quantity: 0,
      categories: ["Rice Meals"],
      },
      {
      id: 44,
      name: "Steamed Rice Served with Double Pork Rib", 
      description: "Scrumptious, tender slices of lightly breaded pork chop with a distinct, unmistakably fruity aroma.",
      image: "rice/doublepork.png",
      price: 288.0,
      quantity: 0,
      categories: ["Rice Meals"],
      },
      {
      id: 45,
      name: "Steamed Rice Served with Soy Chicken", 
      description: "Poached chicken with soy and dried spices, quarter serving.",
      image: "rice/soy.png",
      price: 278.0,
      quantity: 0,
      categories: ["Rice Meals"],
      },
      {
      id: 46,
      name: "Lechon Macau Over Fried Rice", 
      description: "Charcoal broiled crispy, juicy pork belly. Served with egg fried rice.",
      image: "rice/overfried.png",
      price: 468.0,
      quantity: 0,
      categories: ["Rice Meals"],
      },
      {
      id: 47,
      name: "Superior Soup Nanking Beef",
      description: "Succulent, tender, chunky beef 3-hours stewed in naturally brewed soy sauce under low fire. Generously served with UMAMI broth in hotpot. A NORTH PARK Original!",
      image: "soup/nanking.png",
      price: 308.0,
      quantity: 0,
      categories: ["Soups"],
      },
      {
      id: 48,
      name: "Superior Soup Aniseed Beef Tendon",
      description: "A slow food classic. Flavorful, gelatinous achilles beef tendons, rich in protein. Generously served with UMAMI broth in hotpot. A sure kick!",
      image: "soup/superior.png",
      price: 318.0,
      quantity: 0,
      categories: ["Soups"],
      },
      {
      id: 49,
      name: "Superior Soup Wanton", 
      description: "Paper thin flour skin filled with diced pork and shrimp generously served with UMAMI broth in hotpot.",
      image: "soup/wanton.png",
      price: 188.0,
      quantity: 0,
      categories: ["Soups"],
      },
      {
      id: 50,
      name: "Superior Soup Fresh Prawn Dumpling", 
      description: "Made from 100% pure sea-caught prawns enveloped in high gluten skin generously with UMAMI broth in hotpot.",
      image: "soup/dumpling.png",
      price: 308.0,
      quantity: 0,
      categories: ["Soups"],
      },
      {
      id: 51,
      name: "Crab and Corn Soup", 
      description: "Sweet, tender crab meat and corn in a rich, flavorful broth. A comforting classic!",
      image: "soup/crab.png",
      price: 303.0,
      quantity: 0,
      categories: ["Soups"],
      },
       {
	    id: 52,
	    name: "Ultimate Noodles",
	    description: "SNORTH PARK's homemade noodles mixed with Wanton, Pork Ribs, Prawn Dumplings, 3 Kinds Mushrooms, Nanking beef and Tendon in Hongkong Noodles",
	    image: "noodles/ultimate.png",
	    price: 558.0,
	    quantity: 0,
	    categories: ["Noodles"],
	    },
	    {
	    id: 53,
	    name: "Noodles in Soup with Fresh Prawn Dumpling - Light", 
	    description: "Made from 100% pure sea-caught prawns enveloped in high gluten skin generously poured with premium oyster sauce, Yellow noodles made from farm fresh eggs, high gluten flour. Customer's choice!' Generously served with UMAMI broth soup in hotpot",
	    image: "noodles/freshprawn.png",
	    price: 233.0,
	    quantity: 0,
	    categories: ["Noodles"],
	    },
	    {
	    id: 56,
	    name: "Noodles in Soup with Wanton - Light", 
	    description: "Paper thin flour skin filled with diced pork and shrimp generously poured with premium oyster sauce, Yellow noodles made from farm fresh eggs, high gluten flour. Customer's choice!' Generously served with UMAMI broth in hotpot.",
	    image: "noodles/noodleswanton.png",
	    price: 133.0,
	    quantity: 0,
	    categories: ["Noodles"],
	    },
	    {
    	id: 57,
	    name: "Noodles in Soup with 3 Kinds of Mushroom - Regular", 
	    description: "Paper thin flour skin filled with diced pork and shrimp generously poured with premium oyster sauce, Yellow noodles made from farm fresh eggs, high gluten flour. Customer's choice!' Generously served with UMAMI broth in hotpot.",
	    image: "noodles/3kinds.png",
	    price: 188.0,
	    quantity: 0,
	    categories: ["Noodles"],
	    },
	    {
	    id: 58,
	    name: "Noodles in Soup with Double Pork Rib - Regular", 
	    description: "Scrumptious, tender slices of lightly breaded pork chop with a distinct, unmistakably fruity aroma, Yellow noodles made from farm fresh eggs, high gluten flour. Customer's choice!' Generously served with UMAMI broth in hotpot.",
	    image: "noodles/doublepork.png",
	    price: 273.0,
	    quantity: 0,
	    categories: ["Noodles"],
	    },
      {
      id: 59,
      name: "Salted Fish with Chicken Fried Rice",
      description: "Egg fried rice fragrantly scented with salted fish, diced chicken fillet & green peas.",
      image: "friedrice/salted.png",
      price: 328.0,
      quantity: 0,
      categories: ["Fried Rice"],
      },
      {
      id: 60,
      name: "Yang Chow Fried Rice",
      description: "Egg fried rice with shrimps, chopped BBQ pork, carrots, and green peas.",
      image: "friedrice/yang.png",
      price: 238.0,
      quantity: 0,
      categories: ["Fried Rice"],
      },
      {
      id: 61,
      name: "Pineapple Fried Rice with Pork Sausage",
      description: "Egg fried rice with pineapple tidbits, chinese pork sausage, shrimps, carrots and green peas",
      image: "friedrice/pork.png",
      price: 273.0,
      quantity: 0,
      categories: ["Fried Rice"],
      },
      {
      id: 62,
      name: "WOK Garlic Fried Rice",
      description: "WOK Garlic Fried Rice topped with bits of fried garlic.",
      image: "friedrice/wok.png",
      price: 188.0,
      quantity: 0,
      categories: ["Fried Rice"],
      },
      
  ];

// Load items from local storage (keep originals if not stored)
let menuItems = JSON.parse(localStorage.getItem("menuItems")) || defaultItems;

menuItems = menuItems.map(item => ({
    ...item,
    price: parseFloat(item.price),
    quantity: item.quantity || 0,
  }));

// Function to display menu item

function editItem(index) {
  const item = menuItems[index];

  // Populate the form fields with current item data
  document.getElementById("item-name").value = item.name;
  document.getElementById("item-price").value = item.price;
  document.getElementById("item-image").value = item.image;
  document.getElementById("item-description").value = item.description;

  // Set categories
  document.querySelectorAll('#item-categories input[type="checkbox"]').forEach(cb => {
    cb.checked = item.categories && item.categories.includes(cb.value);
  });

  // Change form submit button text to "Update Item"
  const submitBtn = document.querySelector("#add-item-form button[type='submit']");
  submitBtn.textContent = "Update Item";

  // Temporarily change form submission logic for editing
  addItemForm.onsubmit = function (e) {
    e.preventDefault();

    // Get updated values from form
    const updatedItem = {
      ...item,
      name: document.getElementById("item-name").value.trim(),
      price: parseFloat(document.getElementById("item-price").value),
      image: document.getElementById("item-image").value.trim(),
      description: document.getElementById("item-description").value.trim(),
      categories: Array.from(document.querySelectorAll('#item-categories input[type="checkbox"]:checked')).map(cb => cb.value),
    };

    // Replace the old item with the updated one
    menuItems.splice(index, 1, updatedItem);
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
    displayMenuItems();

    // Reset form and revert button to "Add Item" mode
    addItemForm.reset();
    submitBtn.textContent = "Add Item";
    addItemForm.onsubmit = originalAddHandler;
    document.querySelectorAll('#item-categories input[type="checkbox"]').forEach(cb => cb.checked = false);
  };
}

// On DOMContentLoaded, check for editMenuItemId and trigger edit
document.addEventListener("DOMContentLoaded", function() {
  const editId = localStorage.getItem('editMenuItemId');
  if (editId) {
    const editItemIndex = menuItems.findIndex(item => item.id == editId);
    if (editItemIndex !== -1) {
      editItem(editItemIndex); // Pre-fill the form for editing
      localStorage.removeItem('editMenuItemId'); // Clean up
    }
  }
});


// Event listener for form submission (add item)
const originalAddHandler = function (e) {
    e.preventDefault();

    const name = document.getElementById("item-name").value.trim();
    const price = parseFloat(document.getElementById("item-price").value);
    const image = document.getElementById("item-image").value.trim();
    const description = document.getElementById("item-description").value.trim();
    const categories = Array.from(document.querySelectorAll('#item-categories input[type="checkbox"]:checked')).map(cb => cb.value);

    if (!name || isNaN(price)) {
        alert("Please fill out all required fields correctly.");
        return;
    }

    const newItem = {
        id: getNextItemId(),
        name,
        price,
        image,
        description,
        quantity: 0,
        categories,
    };

    menuItems.push(newItem);
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
    displayMenuItems();
    addItemForm.reset();
    document.querySelectorAll('#item-categories input[type="checkbox"]').forEach(cb => cb.checked = false);
};

// Attach the handler to the form
addItemForm.onsubmit = originalAddHandler;

addItemForm.addEventListener("Add Item" || "Update Item", (e) => {
    e.preventDefault();
    const name = document.getElementById("item-name").value.trim();
    const price = parseFloat(document.getElementById("item-price").value);
    const image = document.getElementById("item-image").value.trim();
    const description = document.getElementById("item-description").value.trim();
    const categories = Array.from(document.querySelectorAll('#item-categories input[type="checkbox"]:checked')).map(cb => cb.value);


    if (!name || isNaN(price)) {
        alert("Please fill out all required fields correctly.");
        return;
    }

    const newItem = {
        id: getNextItemId(),
        name,
        price,
        image,
        description,
        quantity: 0,
        categories,
    };

    menuItems.push(newItem);
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
    displayMenuItems();
    addItemForm.reset();
    document.querySelectorAll('#item-categories input[type="checkbox"]').forEach(cb => cb.checked = false);

});

function displayMenuItems() {
  window.location.reload();
}

// Initialize the menu


// Restore the original menu (default items)
function restoreOriginalMenu() {
    localStorage.removeItem("menuItems");
    menuItems = defaultItems.map(item => ({ ...item })); // Deep copy to avoid mutation
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
    displayMenuItems();
}

// Logout handler
function logout() {
    localStorage.removeItem('currentUser'); // or whatever key you're using to track login
    alert('You have been logged out.');
    window.location.href = 'login.html'; // Redirect to login page
}

if (!localStorage.getItem('currentUser')) {
    alert('You must be logged in to access this page.');
    window.location.href = 'login.html';
}

// Table limit configuration
function saveTableLimits() {
    const max = parseInt(document.getElementById('maxTableInput').value, 10);

    if (isNaN(max) || max < 1) {
        alert("Please enter a valid maximum table number (1 or higher).");
        return;
    }

    const tableLimits = { min: 1, max };
    localStorage.setItem('tableLimits', JSON.stringify(tableLimits));
    alert("Maximum table limit saved!");
}

    const data = localStorage.getItem('userRating');
    const display = document.getElementById('ratingDisplay');

    if (data) {
      const { ratings, comments, timestamp } = JSON.parse(data);

      // Build the HTML
      let html = '';
      if (ratings) {
        html += '<div class="rating-group"><span class="rating-label">Food:</span> ' + (ratings.food || 0) + ' / 5</div>';
        html += '<div class="rating-group"><span class="rating-label">Service:</span> ' + (ratings.service || 0) + ' / 5</div>';
        html += '<div class="rating-group"><span class="rating-label">Overall:</span> ' + (ratings.overall || 0) + ' / 5</div>';
      }
      html += '<div class="rating-group"><span class="rating-label">Comments:</span></div>';
      html += '<div class="comment-box">' + (comments ? comments : '<em>No comments provided.</em>') + '</div>';
      if (timestamp) {
        html += '<div style="margin-top:1em;color:#888;font-size:0.9em;">Submitted: ' + new Date(timestamp).toLocaleString() + '</div>';
      }
      display.innerHTML = html;
    } else {
      display.innerHTML = '<em>No feedback submitted yet.</em>';
    }


document.addEventListener("DOMContentLoaded", function() {
  const editId = localStorage.getItem('editMenuItemId');
  if (editId) {
    const editItemIndex = menuItems.findIndex(item => item.id == editId);
    if (editItemIndex !== -1) {
      editItem(editItemIndex); // Pre-fill the form for editing
      localStorage.removeItem('editMenuItemId'); // Clean up
    }
  }
});