// ==========================================
// VIVA PREP: PREVIOUS ORDERS LOGIC
// This file reads the user's past purchases from local storage and displays them.
// We use simple loops to go through the data, fix any broken image links, 
// and merge duplicate drinks together so the screen doesn't get cluttered.
// ==========================================

function renderPreviousOrders() {
  let previousGrid = document.getElementById('previous-grid');
  if (previousGrid === null) {
    return; // If the container isn't on this page, stop here
  }
  
  // 1. Get the past orders from the browser's memory
  let previousOrdersRaw = localStorage.getItem('previousOrders');
  let previousOrders = [];
  
  if (previousOrdersRaw !== null) {
    previousOrders = JSON.parse(previousOrdersRaw);
  }
  
  // ==========================================
  // VIVA PREP: FIXING BROKEN IMAGES (MIGRATION)
  // We use standard 'for' loops inside other 'for' loops (nested loops)
  // to check every single item inside every single order.
  // ==========================================
  let migrated = false;
  
  for (let i = 0; i < previousOrders.length; i++) {
    let order = previousOrders[i];
    
    // Check if this order actually has items in it
    if (order.items !== undefined && Array.isArray(order.items)) {
      
      // Loop through the items inside this specific order
      for (let j = 0; j < order.items.length; j++) {
        let item = order.items[j];
        
        // If it has an old image link, replace it with the new one
        if (item.img !== undefined) {
          if (item.img.includes('now_make_different_flavour_of_202605201454.jpeg')) { item.img = 'french-vanilla.jpeg'; migrated = true; }
          else if (item.img.includes('now_make_different_flavour_of_202605201438.jpeg')) { item.img = 'hazelnut-vanilla.jpeg'; migrated = true; }
          else if (item.img.includes('now_make_different_flavour_of_202605201454(1).jpeg')) { item.img = 'hazelnut-roast.jpeg'; migrated = true; }
          else if (item.img.includes('don\'t_add_background_2K_202605201454.jpeg')) { item.img = 'original-roast.jpeg'; migrated = true; }
        }
      }
    }
  }

  // If we fixed any links, save the clean version back to storage
  if (migrated === true) {
    localStorage.setItem('previousOrders', JSON.stringify(previousOrders));
  }
  
  // 2. Extract all items into one big flat array
  let allItems = [];
  for (let i = 0; i < previousOrders.length; i++) {
    let order = previousOrders[i];
    if (order.items !== undefined && Array.isArray(order.items)) {
      for (let j = 0; j < order.items.length; j++) {
        allItems.push(order.items[j]); // Push adds the item to the end of our list
      }
    }
  }

  // If they haven't bought anything yet, show a nice message
  if (allItems.length === 0) {
    previousGrid.innerHTML = '<p style="color:#fff; grid-column: 1/-1;">You have no past orders yet.</p>';
    return;
  }
  
  // ==========================================
  // VIVA PREP: DEDUPLICATING ITEMS
  // If the user bought a Cappuccino twice on different days, we don't want 
  // to show two separate Cappuccino cards. We want to show ONE card that says "Purchased 2x".
  // ==========================================
  let uniqueItems = [];
  
  for (let i = 0; i < allItems.length; i++) {
    let currentItem = allItems[i];
    let foundDuplicate = false;
    
    // Look through our uniqueItems list to see if we already added this coffee
    for (let u = 0; u < uniqueItems.length; u++) {
      if (uniqueItems[u].id === currentItem.id) {
        // We found a duplicate! Just increase the quantity instead of adding a new card.
        uniqueItems[u].quantity = uniqueItems[u].quantity + currentItem.quantity;
        foundDuplicate = true;
        break; // Stop searching, we already found it
      }
    }
    
    // If it's a completely new drink, add it to our unique list!
    if (foundDuplicate === false) {
      // We create a fresh copy of the object so we don't accidentally mess up the original data
      let itemCopy = {
        id: currentItem.id,
        name: currentItem.name,
        price: currentItem.price,
        quantity: currentItem.quantity,
        img: currentItem.img
      };
      uniqueItems.push(itemCopy);
    }
  }
  
  // 3. Build the HTML to display the past orders
  let historyHTMLString = "";
  
  for (let i = 0; i < uniqueItems.length; i++) {
    let orderItem = uniqueItems[i];
    
    historyHTMLString = historyHTMLString + `
      <div class="featured-card">
        <img class="featured-card-img" src="${orderItem.img}" alt="${orderItem.name}">
        <div class="featured-card-body">
          <p class="featured-card-tag" style="color: #d4e9c4;">✓ PURCHASED (${orderItem.quantity}x total)</p>
          <h3 class="featured-card-title">${orderItem.name}</h3>
          <p class="featured-card-desc">You previously ordered this item. Click below to quickly add it again!</p>
          <div class="featured-card-footer">
            <span class="featured-card-price">₹${orderItem.price}</span>
            <button class="featured-card-btn add-to-cart-btn" style="background: #d4e9c4; color: #2c3d1a;" 
                    data-id="${orderItem.id}" data-name="${orderItem.name}" data-price="${orderItem.price}">
              R E O R D E R
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  // Inject the final HTML into the webpage
  previousGrid.innerHTML = historyHTMLString;
}

// Call this function immediately when the page loads so the history shows up right away!
renderPreviousOrders();
