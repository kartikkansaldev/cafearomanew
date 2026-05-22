// ==========================================
// VIVA PREP: LOCAL STORAGE
// We want to remember the user's favorite drinks even if they refresh the page.
// We get the saved list from localStorage and turn it back into a JavaScript array using JSON.parse.
// If nothing is saved, we start with an empty array [].
// ==========================================
let favoritesListRaw = localStorage.getItem('cafeFavorites');
let favoritesList = [];

if (favoritesListRaw !== null) {
  favoritesList = JSON.parse(favoritesListRaw);
}

// Function to save the list back to the browser's memory
function saveFavorites() {
  let stringList = JSON.stringify(favoritesList);
  localStorage.setItem('cafeFavorites', stringList);
}

// ==========================================
// VIVA PREP: EVENT DELEGATION
// Instead of adding a 'click' listener to every single heart button (which might be 50 buttons!),
// we add ONE listener to the whole document. If they click anywhere, we check if what they 
// clicked was a heart button.
// ==========================================
document.addEventListener('click', function(event) {
  
  // Check if the thing they clicked has the class 'heart-btn'
  if (event.target.classList.contains('heart-btn')) {
    
    // The closest() method goes up the HTML tree to find the nearest parent box (the product card)
    let card = event.target.closest('.featured-card');
    if (card === null) {
      card = event.target.closest('.product-card');
    }
    
    // If we didn't click inside a card, stop here
    if (card === null) {
      return; 
    }
    
    let productId = card.dataset.id;
    
    // ==========================================
    // VIVA PREP: WHAT IS indexOf?
    // indexOf searches an array for a specific item. 
    // If it finds it, it returns its position (like 0, 1, or 2). 
    // If it CANNOT find it, it always returns -1.
    // ==========================================
    let index = favoritesList.indexOf(productId);
    
    if (index === -1) {
      // Not in list, so we add it (Like) using .push()
      favoritesList.push(productId);
      event.target.textContent = '♥'; // Change to Filled heart
      event.target.style.color = '#ff4b4b'; // Change to Red color
    } else {
      // Already in list, so we remove it (Unlike)
      // splice(index, 1) means "go to this position, and remove exactly 1 item"
      favoritesList.splice(index, 1);
      event.target.textContent = '♡'; // Change to Empty heart
      event.target.style.color = '#fff'; // Change to White color
    }
    
    saveFavorites();
    // Update the Favourites tab to show the new list!
    renderFavorites();
  }
});

// ==========================================
// VIVA PREP: BUILDING HTML WITH A LOOP
// This function looks at the user's favoritesList array, finds the full data for 
// that drink in coffeeData, and builds HTML to show it on the screen.
// ==========================================
function renderFavorites() {
  let favGrid = document.getElementById('fav-grid');
  if (favGrid === null) {
    return; // If the grid doesn't exist on this page, stop here
  }
  
  // If the array is empty, show a nice message
  if (favoritesList.length === 0) {
    favGrid.innerHTML = '<p style="color:#fff; grid-column: 1/-1;">You have no favorites yet. Tap the heart on a product to save it here!</p>';
    return;
  }
  
  let favHTMLString = "";
  
  // Loop through all the favorite IDs saved by the user
  for (let i = 0; i < favoritesList.length; i++) {
    let favId = favoritesList[i];
    
    // Now we need to find the full data (name, price, image) for this ID inside coffeeData
    let fullData = null;
    for (let j = 0; j < coffeeData.length; j++) {
      if (coffeeData[j].id === favId) {
        fullData = coffeeData[j];
        break; // Stop looping once we find the matching coffee
      }
    }
    
    // If we successfully found the data, build the HTML
    if (fullData !== null) {
      // We output the heart as filled (♥) because we know it's already a favorite
      favHTMLString = favHTMLString + `
        <div class="featured-card">
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
    }
  }
  
  // Shove the massive HTML string into the webpage!
  favGrid.innerHTML = favHTMLString;
}
