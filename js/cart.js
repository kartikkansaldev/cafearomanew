/* =====================================================
   cart.js — Dynamic Shopping Cart & Fake Checkout (with localStorage)
   Syllabus Topics: Arrays/Objects (L5-8), Event Delegation (L27-30),
                    Higher-Order Functions reduce() (L17-18),
                    localStorage & JSON (L19-22)
   ===================================================== */

// 1. Arrays & Objects with Local Storage (Syllabus L19-22)
// We read from localStorage first. If nothing is there, we use an empty array.
let shoppingCart = JSON.parse(localStorage.getItem('cafeCart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('cafeHistory')) || [];

// Save function to update localStorage whenever the cart changes
function saveCart() {
  localStorage.setItem('cafeCart', JSON.stringify(shoppingCart));
}
function saveHistory() {
  localStorage.setItem('cafeHistory', JSON.stringify(orderHistory));
}

// 2. Select the Cart link in the Navbar
const cartNavBtns = document.querySelectorAll('nav a.pill');
let activeCartBtns = [];
cartNavBtns.forEach(btn => {
  if (btn.textContent.includes('C A R T')) {
    activeCartBtns.push(btn);
    // Ensure all Cart links point to the new Cart Page
    btn.href = 'cart.html';
  }
});

// Update UI on initial load
updateCartUI();

// 3. Event Delegation for Adding to Cart (Syllabus L27-30)
document.addEventListener('click', function(event) {
  
  if (event.target.classList.contains('add-to-cart-btn')) {
    const id = event.target.dataset.id;
    const name = event.target.dataset.name;
    const price = parseInt(event.target.dataset.price, 10);
    const img = event.target.closest('.featured-card, .product-card')?.querySelector('img')?.src || '';
    
    // Check if there is a custom quantity selector for this item
    let qtyToAdd = 1;
    const card = event.target.closest('.featured-card, .product-card');
    if (card) {
      const qtyEl = card.querySelector('.qty-num');
      if (qtyEl) {
        qtyToAdd = parseInt(qtyEl.textContent, 10);
      }
    }
    
    const existingItem = shoppingCart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += qtyToAdd;
    } else {
      shoppingCart.push({ id, name, price, quantity: qtyToAdd, img });
    }
    
    saveCart(); // Save to LocalStorage
    updateCartUI();
    
    // Visual feedback
    const originalText = event.target.textContent;
    event.target.textContent = '✓ A D D E D';
    setTimeout(() => {
      event.target.textContent = originalText;
    }, 1200);
  }
});

// 4. Update the Navbar Text
function updateCartUI() {
  const totalItems = shoppingCart.reduce((total, item) => total + item.quantity, 0);
  activeCartBtns.forEach(btn => {
    if (totalItems > 0) {
      btn.textContent = `C A R T (${totalItems})`;
    } else {
      btn.textContent = 'C A R T';
    }
  });
}

// 5. Render "PREVIOUS" Tab (if we are on menu.html)
function renderPreviousOrders() {
  const previousGrid = document.getElementById('previous-grid');
  if (!previousGrid) return;
  
  if (orderHistory.length === 0) {
    previousGrid.innerHTML = '<p style="color:#fff; grid-column: 1/-1;">You have no past orders yet.</p>';
    return;
  }
  
  const historyHTML = orderHistory.map(order => {
    return `
      <div class="featured-card">
        <img class="featured-card-img" src="${order.img}" alt="${order.name}">
        <div class="featured-card-body">
          <p class="featured-card-tag" style="color: #d4e9c4;">✓ PURCHASED (${order.quantity}x)</p>
          <h3 class="featured-card-title">${order.name}</h3>
          <p class="featured-card-desc">You previously ordered this item. Click below to quickly add it again!</p>
          <div class="featured-card-footer">
            <span class="featured-card-price">₹${order.price}</span>
            <button class="featured-card-btn add-to-cart-btn" style="background: #d4e9c4; color: #2c3d1a;" 
                    data-id="${order.id}" data-name="${order.name}" data-price="${order.price}">
              R E O R D E R
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  previousGrid.innerHTML = historyHTML;
}

// Call this immediately to render history on page load
renderPreviousOrders();

// 6. Global Quantity Function for Our Finding Panel
window.changeQty = function(btn, delta) {
  const control = btn.closest('.qty-control');
  const numEl = control.querySelector('.qty-num');
  let val = parseInt(numEl.textContent, 10) + delta;
  if (val < 1) val = 1; // Prevent negative quantity
  numEl.textContent = val;
};

// =========================================================================
// CART PAGE SPECIFIC LOGIC (Only runs if we are on cart.html)
// =========================================================================
const cartPageContainer = document.getElementById('cart-page-items');
if (cartPageContainer) {
  function renderCartPage() {
    if (shoppingCart.length === 0) {
      cartPageContainer.innerHTML = '<p style="color:#111; font-family: monospace; font-size: 16px;">Your cart is completely empty. <a href="menu.html" style="color: #4a5c2f; text-decoration: underline;">Go back to menu</a> to add some drinks!</p>';
      document.getElementById('cart-total-price').textContent = '₹0';
      return;
    }

    const html = shoppingCart.map((item, index) => {
      return `
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
            <p style="font-family: monospace; font-size: 18px; font-weight: bold; margin: 0;">₹${item.price * item.quantity}</p>
            <button onclick="removeItem(${index})" style="background: none; border: none; color: #ff4b4b; cursor: pointer; font-size: 24px; padding: 0 10px;">×</button>
          </div>
        </div>
      `;
    }).join('');

    cartPageContainer.innerHTML = html;
    
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-price').textContent = '₹' + total;
  }

  // Make remove function global so the inline onclick can find it
  window.removeItem = function(index) {
    shoppingCart.splice(index, 1);
    saveCart();
    updateCartUI();
    renderCartPage();
  };

  renderCartPage();

  // Handle Checkout Button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (shoppingCart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      
      const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      alert(`Checkout Successful!\nYou have purchased ${shoppingCart.length} items for a total of ₹${total}.\nEnjoy your Cafe Aroma coffee!`);
      
      // Save to history
      orderHistory.push(...shoppingCart);
      saveHistory();
      
      // Empty cart
      shoppingCart = [];
      saveCart();
      updateCartUI();
      renderCartPage();
      
      // Redirect to previous orders tab
      window.location.href = 'menu.html';
    });
  }
}

// 7. Dynamic Navbar Theme Detection based on Background under the Nav
const globalNav = document.querySelector('nav');
if (globalNav) {
  function updateNavbarTheme() {
    if (window.scrollY > 20) {
      globalNav.classList.add('nav-scrolled');
    } else {
      globalNav.classList.remove('nav-scrolled');
    }

    // Temporarily disable pointer events on the nav so we can get the element behind it
    const originalPointerEvents = globalNav.style.pointerEvents;
    globalNav.style.pointerEvents = 'none';

    // Get the element behind the navbar (using horizontal center and vertical center of nav bar)
    const navHeight = globalNav.offsetHeight || 60;
    const testY = navHeight / 2;
    const testX = window.innerWidth / 2;
    const elementBehind = document.elementFromPoint(testX, testY);

    // Restore pointer events
    globalNav.style.pointerEvents = originalPointerEvents;

    if (!elementBehind) return;

    // Traverse ancestors to find the first non-transparent background color
    let currentEl = elementBehind;
    let bg = 'rgba(0, 0, 0, 0)';

    while (currentEl && (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' || bg === 'rgba(0,0,0,0)')) {
      bg = window.getComputedStyle(currentEl).backgroundColor;
      currentEl = currentEl.parentElement;
    }

    let isDark = false;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

        if (a > 0.1) {
          // Calculate YIQ brightness
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          isDark = brightness < 150;
        }
      }
    } else {
      // Fallback: Check if body has dark-bg class
      isDark = document.body.classList.contains('dark-bg');
    }

    if (isDark) {
      globalNav.classList.add('nav-theme-dark');
      globalNav.classList.remove('nav-theme-light');
    } else {
      globalNav.classList.add('nav-theme-light');
      globalNav.classList.remove('nav-theme-dark');
    }
  }

  window.addEventListener('scroll', updateNavbarTheme);
  window.addEventListener('resize', updateNavbarTheme);
  
  // Run update immediately and after DOM/Styles loads
  updateNavbarTheme();
  window.addEventListener('DOMContentLoaded', updateNavbarTheme);
  setTimeout(updateNavbarTheme, 100);
}
