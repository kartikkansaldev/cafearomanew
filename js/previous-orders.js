// previous-orders.js

function renderPreviousOrders() {
  const previousGrid = document.getElementById('previous-grid');
  if (!previousGrid) return;
  
  let previousOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];
  
  let migrated = false;
  previousOrders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        if (item.img && item.img.includes('now_make_different_flavour_of_202605201454.jpeg')) { item.img = 'french-vanilla.jpeg'; migrated = true; }
        else if (item.img && item.img.includes('now_make_different_flavour_of_202605201438.jpeg')) { item.img = 'hazelnut-vanilla.jpeg'; migrated = true; }
        else if (item.img && item.img.includes('now_make_different_flavour_of_202605201454(1).jpeg')) { item.img = 'hazelnut-roast.jpeg'; migrated = true; }
        else if (item.img && item.img.includes('don\'t_add_background_2K_202605201454.jpeg')) { item.img = 'original-roast.jpeg'; migrated = true; }
      });
    }
  });

  if (migrated) {
    localStorage.setItem('previousOrders', JSON.stringify(previousOrders));
  }
  
  // Flatten all items from all past orders
  let allItems = [];
  previousOrders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        allItems.push(item);
      });
    }
  });

  if (allItems.length === 0) {
    previousGrid.innerHTML = '<p style="color:#fff; grid-column: 1/-1;">You have no past orders yet.</p>';
    return;
  }
  
  // Deduplicate items by ID, accumulating total quantity ordered over time
  const uniqueItems = [];
  const itemMap = new Map();
  allItems.forEach(item => {
    if (itemMap.has(item.id)) {
      itemMap.get(item.id).quantity += item.quantity;
    } else {
      itemMap.set(item.id, { ...item });
      uniqueItems.push(itemMap.get(item.id));
    }
  });
  
  const historyHTML = uniqueItems.map(order => {
    return `
      <div class="featured-card">
        <img class="featured-card-img" src="${order.img}" alt="${order.name}">
        <div class="featured-card-body">
          <p class="featured-card-tag" style="color: #d4e9c4;">✓ PURCHASED (${order.quantity}x total)</p>
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
