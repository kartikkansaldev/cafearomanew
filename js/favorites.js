/* =====================================================
   favorites.js — Like System & Favorites Tab
   Syllabus Topics: Event Delegation (L27-30), Arrays (L5-8),
                    DOM Manipulation & classList (L23-26)
   ===================================================== */

// 1. Array to hold the IDs of favorited drinks
let favoritesList = JSON.parse(localStorage.getItem('cafeFavorites')) || [];

function saveFavorites() {
  localStorage.setItem('cafeFavorites', JSON.stringify(favoritesList));
}

// 2. Event Delegation for the Heart Buttons (L27-30)
// Just like the 'ADD' button, the hearts are dynamically created.
// We listen to the entire document.
document.addEventListener('click', function(event) {
  
  // Did they click a heart button?
  if (event.target.classList.contains('heart-btn')) {
    
    // The button is inside the card. We need the product ID.
    // The closest() method (L23-26) goes up the DOM tree to find the nearest parent with this class.
    const card = event.target.closest('.featured-card, .product-card');
    if (!card) return;
    
    const productId = card.dataset.id;
    
    // 3. Array Manipulation (L5-8)
    // Check if it is already liked
    const index = favoritesList.indexOf(productId);
    
    if (index === -1) {
      // Not in list, so we add it (Like)
      favoritesList.push(productId);
      event.target.textContent = '♥'; // Filled heart
      event.target.style.color = '#ff4b4b'; // Red
    } else {
      // Already in list, so we remove it (Unlike)
      // splice removes 1 element at the given index
      favoritesList.splice(index, 1);
      event.target.textContent = '♡'; // Empty heart
      event.target.style.color = '#fff'; // White
    }
    
    saveFavorites();
    // Update the Favourites tab!
    renderFavorites();
  }
});

// 4. Render to the DOM (L23-26)
function renderFavorites() {
  const favGrid = document.getElementById('fav-grid');
  if (!favGrid) return;
  
  if (favoritesList.length === 0) {
    favGrid.innerHTML = '<p style="color:#fff; grid-column: 1/-1;">You have no favorites yet. Tap the heart on a product to save it here!</p>';
    return;
  }
  
  // 5. Higher-Order Functions (L17-18)
  // We map over the IDs in our favoritesList, look them up in coffeeData, and build HTML
  const favHTML = favoritesList.map(id => {
    const fullData = coffeeData.find(c => c.id === id);
    if (!fullData) return '';
    
    return `
      <div class="featured-card">
        <!-- We output the heart as filled because we know it's a favorite -->
        <button aria-label="Add to favourites" class="heart-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; color: #ff4b4b; cursor: pointer; text-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 10;">♥</button>
        <img class="featured-card-img" src="${fullData.img}" alt="${fullData.name}">
        <div class="featured-card-body">
          <p class="featured-card-tag" style="color: #d4e9c4;">&#9829; YOUR FAVORITE</p>
          <h3 class="featured-card-title">${fullData.name}</h3>
          <p class="featured-card-desc">${fullData.desc}</p>
          <div class="featured-card-footer">
            <span class="featured-card-price">₹${fullData.price}</span>
            <button class="featured-card-btn add-to-cart-btn" style="background: #d4e9c4; color: #2c3d1a;" 
                    data-id="${fullData.id}" data-name="${fullData.name}" data-price="${fullData.price}">
              A D D
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  favGrid.innerHTML = favHTML;
}
