// ==========================================
// VIVA PREP: WHAT IS LOCALSTORAGE?
// localStorage allows us to save data in the user's browser, so when they 
// close the tab and come back, their cart isn't empty!
// ==========================================

// 1. Get the cart from storage. JSON.parse turns the saved text back into a Javascript Array.
// If there is nothing saved (null), we use an empty array [].
let shoppingCartRaw = localStorage.getItem('cafeCart');
let shoppingCart = [];

if (shoppingCartRaw !== null) {
  shoppingCart = JSON.parse(shoppingCartRaw);
}

// ==========================================
// VIVA PREP: A SIMPLE FOR LOOP (Migration)
// We loop through the items to fix any old image links.
// ==========================================
for (let i = 0; i < shoppingCart.length; i++) {
  let item = shoppingCart[i];
  if (item.img !== undefined) {
    if (item.img.includes('now_make_different_flavour_of_202605201454.jpeg')) { item.img = 'french-vanilla.jpeg'; }
    else if (item.img.includes('now_make_different_flavour_of_202605201438.jpeg')) { item.img = 'hazelnut-vanilla.jpeg'; }
    else if (item.img.includes('now_make_different_flavour_of_202605201454(1).jpeg')) { item.img = 'hazelnut-roast.jpeg'; }
    else if (item.img.includes('don\'t_add_background_2K_202605201454.jpeg')) { item.img = 'original-roast.jpeg'; }
  }
}

// Function to save the cart back to the browser's memory
function saveCart() {
  // JSON.stringify turns our Javascript Array into a string of text so it can be saved.
  let stringCart = JSON.stringify(shoppingCart);
  localStorage.setItem('cafeCart', stringCart);
}

// Ensure fixed images are saved immediately
saveCart();

// 2. Select all the Navbar links
let cartNavBtns = document.querySelectorAll('nav a.pill');
let activeCartBtns = [];

// Loop through all buttons to find the ones that say "C A R T"
for (let i = 0; i < cartNavBtns.length; i++) {
  let btn = cartNavBtns[i];
  if (btn.textContent.includes('C A R T')) {
    activeCartBtns.push(btn); // Add it to our list of active buttons
    btn.href = 'cart.html'; // Make sure the link goes to the cart page
  }
}

// Update the number on the cart button when the page loads
updateCartUI();

// ==========================================
// VIVA PREP: EVENT DELEGATION
// We attach ONE event listener to the whole document. 
// When the user clicks ANYWHERE, we check if what they clicked has the class 'add-to-cart-btn'.
// This is better than adding 100 event listeners to 100 buttons!
// ==========================================
document.addEventListener('click', function(event) {
  
  if (event.target.classList.contains('add-to-cart-btn')) {
    
    // We grab the data attributes (data-id, data-name, etc) we wrote in the HTML
    let id = event.target.dataset.id;
    let name = event.target.dataset.name;
    // parseInt converts the string price ("220") into an actual math number (220)
    let price = parseInt(event.target.dataset.price, 10);
    
    // Try to find the image of the product we just clicked
    let img = '';
    let card = event.target.closest('.featured-card');
    if (card === null) {
      card = event.target.closest('.product-card');
    }
    
    if (card !== null) {
      let imageElement = card.querySelector('img');
      if (imageElement !== null) {
        img = imageElement.src;
      }
    }
    
    // Default quantity to add is 1
    let qtyToAdd = 1;
    if (card !== null) {
      let qtyEl = card.querySelector('.qty-num');
      if (qtyEl !== null) {
        qtyToAdd = parseInt(qtyEl.textContent, 10);
      }
    }
    
    // Check if this item is ALREADY inside our shopping cart
    let existingItem = null;
    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].id === id) {
        existingItem = shoppingCart[i];
        break; // Stop looping once we find it!
      }
    }
    
    // If we found it, just increase the quantity.
    if (existingItem !== null) {
      existingItem.quantity = existingItem.quantity + qtyToAdd;
    } else {
      // If we didn't find it, push a new Object into our array!
      let newItem = {
        id: id,
        name: name,
        price: price,
        quantity: qtyToAdd,
        img: img
      };
      shoppingCart.push(newItem);
    }
    
    saveCart(); // Save the new changes
    updateCartUI(); // Update the cart number in the navbar
    
    // Visual feedback for the user
    let originalText = event.target.textContent;
    event.target.textContent = '✓ A D D E D';
    
    // setTimeout runs code after a delay (1200 milliseconds = 1.2 seconds)
    setTimeout(function() {
      event.target.textContent = originalText;
    }, 1200);
  }
});

// ==========================================
// VIVA PREP: A BASIC LOOP TO ADD NUMBERS
// We loop through the cart array, grabbing the quantity of each item, 
// and adding it to the 'totalItems' variable.
// ==========================================
function updateCartUI() {
  let totalItems = 0;
  for (let i = 0; i < shoppingCart.length; i++) {
    totalItems = totalItems + shoppingCart[i].quantity;
  }
  
  // Update the text on all cart buttons
  for (let i = 0; i < activeCartBtns.length; i++) {
    let btn = activeCartBtns[i];
    if (totalItems > 0) {
      btn.textContent = "C A R T (" + totalItems + ")";
    } else {
      btn.textContent = 'C A R T';
    }
  }
}

// 6. Global Quantity Function for Our Finding Panel
window.changeQty = function(btn, delta) {
  let control = btn.closest('.qty-control');
  let numEl = control.querySelector('.qty-num');
  let val = parseInt(numEl.textContent, 10) + delta;
  
  // Prevent the quantity from dropping below 1
  if (val < 1) {
    val = 1;
  }
  numEl.textContent = val;
};

// =========================================================================
// CART PAGE SPECIFIC LOGIC (Only runs if we are on cart.html)
// =========================================================================
let cartPageContainer = document.getElementById('cart-page-items');

if (cartPageContainer !== null) {
  
  function renderCartPage() {
    
    // If the cart is empty, show a message
    if (shoppingCart.length === 0) {
      cartPageContainer.innerHTML = '<p style="color:#111; font-family: monospace; font-size: 16px;">Your cart is completely empty. <a href="menu.html" style="color: #4a5c2f; text-decoration: underline;">Go back to menu</a> to add some drinks!</p>';
      document.getElementById('cart-total-price').textContent = '₹0';
      return;
    }

    let htmlString = "";
    let totalPrice = 0;
    
    // Loop through every item in the cart to build the HTML string and calculate the total
    for (let i = 0; i < shoppingCart.length; i++) {
      let item = shoppingCart[i];
      let rowTotal = item.price * item.quantity;
      
      // Add this item's price to the grand total
      totalPrice = totalPrice + rowTotal;
      
      // Add this item's HTML to our giant string
      htmlString = htmlString + `
        <div class="cart-item-row" style="border-bottom: 1px solid #ccc; padding: 20px 0;">
          <div class="cart-item-left">
            <img src="${item.img}" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;">
            <div>
              <h3 style="font-family: 'Space Mono', monospace; font-size: 18px; margin: 0 0 5px 0;">${item.name}</h3>
              <p style="font-family: 'Space Mono', monospace; font-size: 14px; margin: 0; color: #555;">₹${item.price} each</p>
            </div>
          </div>
          <div class="cart-item-right">
            <p style="font-family: monospace; font-size: 16px; margin: 0;">Qty: ${item.quantity}</p>
            <p style="font-family: monospace; font-size: 18px; font-weight: bold; margin: 0;">₹${rowTotal}</p>
            <!-- When clicked, this button calls the removeItem function and passes the index 'i' -->
            <button onclick="removeItem(${i})" style="background: none; border: none; color: #ff4b4b; cursor: pointer; font-size: 24px; padding: 0 10px;">×</button>
          </div>
        </div>
      `;
    }

    // Inject the HTML string into the webpage
    cartPageContainer.innerHTML = htmlString;
    
    // Update the total price text
    document.getElementById('cart-total-price').textContent = '₹' + totalPrice;
  }

  // ==========================================
  // VIVA PREP: WHAT IS SPLICE?
  // splice() is an Array method used to add or remove items from a specific position.
  // shoppingCart.splice(index, 1) means "go to this index, and remove exactly 1 item".
  // ==========================================
  window.removeItem = function(index) {
    shoppingCart.splice(index, 1);
    saveCart();
    updateCartUI();
    renderCartPage();
  };

  // Run the render function so the cart shows up immediately
  renderCartPage();

  // Handle Checkout Button
  let checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn !== null) {
    checkoutBtn.addEventListener('click', function() {
      
      if (shoppingCart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      
      // Calculate total price for the order again using a loop
      let total = 0;
      for (let i = 0; i < shoppingCart.length; i++) {
        total = total + (shoppingCart[i].price * shoppingCart[i].quantity);
      }
      
      alert("Order placed! Thank you.");
      
      // ==========================================
      // VIVA PREP: SAVING PREVIOUS ORDERS
      // We take everything in the shopping cart and save it to a new array called 'previousOrders'.
      // ==========================================
      let previousOrdersJSON = localStorage.getItem('previousOrders');
      let previousOrders = [];
      if (previousOrdersJSON !== null) {
        previousOrders = JSON.parse(previousOrdersJSON);
      }
      
      // Copy the items array manually (so it's not referencing the same shoppingCart array)
      let itemsCopy = [];
      for (let i = 0; i < shoppingCart.length; i++) {
        itemsCopy.push(shoppingCart[i]);
      }
      
      // Push the new order object
      previousOrders.push({
        timestamp: new Date().toISOString(),
        total: total,
        items: itemsCopy
      });
      
      localStorage.setItem('previousOrders', JSON.stringify(previousOrders));
      
      // Empty the cart
      shoppingCart = [];
      saveCart();
      updateCartUI();
      renderCartPage();
      
      // Redirect to previous orders tab on the menu page
      window.location.href = 'menu.html';
    });
  }
}

// 7. Dynamic Navbar Theme Detection based on Background under the Nav
let globalNav = document.querySelector('nav');

if (globalNav !== null) {
  function updateNavbarTheme() {
    if (window.scrollY > 20) {
      globalNav.classList.add('nav-scrolled');
    } else {
      globalNav.classList.remove('nav-scrolled');
    }

    // Get the element exactly in the middle behind the navbar
    let navHeight = globalNav.offsetHeight;
    if (navHeight === 0) { navHeight = 60; }
    
    let testY = navHeight / 2;
    let testX = window.innerWidth / 2;
    
    // Turn off pointer events briefly so we can 'look through' the navbar
    globalNav.style.pointerEvents = 'none';
    let elementBehind = document.elementFromPoint(testX, testY);
    globalNav.style.pointerEvents = 'auto'; // Turn it back on

    if (elementBehind === null) return;

    // Traverse upwards to find the background color
    let currentEl = elementBehind;
    let bg = 'transparent';

    while (currentEl !== null && (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent')) {
      bg = window.getComputedStyle(currentEl).backgroundColor;
      currentEl = currentEl.parentElement;
    }

    // Check if the body class tells us it is dark
    let isDark = document.body.classList.contains('dark-bg');
    
    // If the background isn't transparent, do some basic math to check if it's a dark color
    if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      // Find the RGB numbers inside the "rgb(255, 255, 255)" string
      let match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match !== null) {
        let r = parseInt(match[1], 10);
        let g = parseInt(match[2], 10);
        let b = parseInt(match[3], 10);
        
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
        isDark = brightness < 150;
      }
    }

    // Apply the correct class
    if (isDark) {
      globalNav.classList.add('nav-theme-dark');
      globalNav.classList.remove('nav-theme-light');
    } else {
      globalNav.classList.add('nav-theme-light');
      globalNav.classList.remove('nav-theme-dark');
    }
  }

  // Run the theme check whenever the user scrolls or resizes the window
  window.addEventListener('scroll', updateNavbarTheme);
  window.addEventListener('resize', updateNavbarTheme);
  
  // Run it once when the page loads
  updateNavbarTheme();
  setTimeout(updateNavbarTheme, 100);
}
