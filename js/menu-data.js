// ==========================================
// VIVA PREP: WHAT IS AN ARRAY OF OBJECTS?
// An Array is a list (like a shopping list). 
// An Object is a collection of related data (key-value pairs) about one thing.
// Here, we have an array called 'coffeeData', and inside it are multiple 
// objects. Each object represents one type of coffee drink!
// ==========================================

// 1. We store our menu data exactly like we would if we fetched it from a real database!
let coffeeData = [
  {
    id: 'hot-1',
    category: 'hot',
    name: 'Caffè Americano',
    tag: '★ CLASSIC',
    desc: 'Espresso shots topped with hot water create a light layer of crema culminating in this wonderfully rich cup with depth and nuance.',
    price: 220,
    img: 'assets/drinks/americano_1779306724447.png'
  },
  {
    id: 'hot-2',
    category: 'hot',
    name: 'Cappuccino',
    tag: '✨ POPULAR',
    desc: 'Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam. An alchemy of barista artistry and craft.',
    price: 260,
    img: 'assets/drinks/cappuccino_1779306743726.png'
  },
  {
    id: 'hot-3',
    category: 'hot',
    name: 'Caramel Macchiato',
    tag: '🔥 SIGNATURE',
    desc: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.',
    price: 310,
    img: 'assets/drinks/caramel_macchiato_1779306756833.png'
  },
  {
    id: 'cold-1',
    category: 'cold',
    name: 'Nitro Cold Brew',
    tag: '❄ REFRESHING',
    desc: 'Our small-batch cold brew, slowly steeped for a super-smooth taste, gets even better with nitrogen infusion.',
    price: 350,
    img: 'assets/drinks/nitro_cold_brew_1779306815886.png'
  },
  {
    id: 'cold-2',
    category: 'cold',
    name: 'Iced Shaken Espresso',
    tag: '❄ CHILLED',
    desc: 'Rich, full-bodied espresso shaken, chilled and mellowed with sweetness and a touch of milk.',
    price: 340,
    img: 'assets/drinks/iced_shaken_espresso_1779306835976.png'
  },
  // Featured Seasonal Drinks
  {
    id: 'feat-1',
    category: 'featured',
    name: 'Mango Cold Brew',
    tag: '★ STAFF FAVOURITE',
    desc: 'Slow-steeped cold brew shaken with real mango purée and a hint of chilli. Dangerously refreshing.',
    price: 340,
    img: 'assets/drinks/mango_cold_brew_1779306848768.png'
  },
  {
    id: 'feat-2',
    category: 'featured',
    name: 'Lavender Latte',
    tag: '🔥 TRENDING',
    desc: 'Oat milk latte with house-made lavender syrup and a dusting of dried lavender buds on top.',
    price: 310,
    img: 'assets/drinks/lavender_latte_1779307028256.png'
  },
  // Our Finding Signature Blends (Coffee Pouches)
  {
    id: 'find-1',
    category: 'finding',
    name: 'French Vanilla',
    tag: '12 OZ POUCH',
    desc: 'Signature blend ground coffee pouch.',
    price: 1499,
    img: 'french-vanilla.jpeg'
  },
  {
    id: 'find-2',
    category: 'finding',
    name: 'Hazelnut Vanilla',
    tag: '12 OZ POUCH',
    desc: 'Signature blend ground coffee pouch.',
    price: 1499,
    img: 'hazelnut-vanilla.jpeg'
  },
  {
    id: 'find-3',
    category: 'finding',
    name: 'Hazelnut Roast',
    tag: '12 OZ POUCH',
    desc: 'Signature blend ground coffee pouch.',
    price: 1649,
    img: 'hazelnut-roast.jpeg'
  },
  {
    id: 'find-4',
    category: 'finding',
    name: 'Original Roast',
    tag: '12 OZ POUCH',
    desc: 'Signature blend ground coffee pouch.',
    price: 1499,
    img: 'original-roast.jpeg'
  }
];

// ==========================================
// VIVA PREP: DOM SELECTION
// We use getElementById to find the empty <div> containers in our HTML file.
// We will use JavaScript to put the coffee cards inside these empty boxes!
// ==========================================
let hotGrid = document.getElementById('hot-coffee-grid');
let coldGrid = document.getElementById('cold-coffee-grid');

// ==========================================
// VIVA PREP: HOW TO BUILD HTML WITH JAVASCRIPT
// We created a function that takes ONE drink object from our array,
// and returns a big string of HTML code for that specific drink.
// ==========================================
function createCardHTML(drink) {
  // We check local storage to see if the user previously favorited this drink
  let currentFavoritesJSON = localStorage.getItem('cafeFavorites');
  let currentFavorites = [];
  
  if (currentFavoritesJSON !== null) {
    currentFavorites = JSON.parse(currentFavoritesJSON);
  }
  
  // We use a simple loop to check if the drink ID is inside our favorites list
  let isFav = false;
  for (let i = 0; i < currentFavorites.length; i++) {
    if (currentFavorites[i] === drink.id) {
      isFav = true;
    }
  }
  
  // If it's a favorite, make the heart red and filled! If not, make it white and empty.
  let heartText;
  let heartColor;
  
  if (isFav === true) {
    heartText = '♥';
    heartColor = '#ff4b4b';
  } else {
    heartText = '♡';
    heartColor = '#fff';
  }

  // ==========================================
  // VIVA PREP: TEMPLATE LITERALS
  // By using backticks ( ` ` ) instead of quotes ( ' ' ), Javascript lets us 
  // inject variables directly into the string using ${} syntax!
  // ==========================================
  return `
    <div class="featured-card" data-id="${drink.id}">
      <!-- HEART ICON FOR FAVORITES (We will select this in favorites.js) -->
      <button aria-label="Add to favourites" class="heart-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; color: ${heartColor}; cursor: pointer; text-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 10;">${heartText}</button>
      
      <img class="featured-card-img" src="${drink.img}" alt="${drink.name}">
      <div class="featured-card-body">
        <p class="featured-card-tag" style="color: #d4e9c4;">${drink.tag}</p>
        <h3 class="featured-card-title">${drink.name}</h3>
        <p class="featured-card-desc">${drink.desc}</p>
        <div class="featured-card-footer">
          <span class="featured-card-price">₹${drink.price}</span>
          <!-- ADD BUTTON FOR CART (We will select this in cart.js) -->
          <button class="featured-card-btn add-to-cart-btn" style="background: #d4e9c4; color: #2c3d1a;" 
                  data-id="${drink.id}" data-name="${drink.name}" data-price="${drink.price}">
            A D D
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// VIVA PREP: WHAT IS innerHTML?
// innerHTML is a DOM property that lets us completely change the HTML inside an element.
// Here we loop through our coffee array, build HTML for each hot/cold drink, 
// and shove it all into the webpage!
// ==========================================
if (hotGrid !== null && coldGrid !== null) {
  
  let hotHTML = "";
  let coldHTML = "";
  
  // We use a simple FOR loop to go through every single coffee in our array
  for (let i = 0; i < coffeeData.length; i++) {
    let drink = coffeeData[i];
    
    // If it's a hot coffee, add its HTML to our hotHTML string
    if (drink.category === 'hot') {
      hotHTML = hotHTML + createCardHTML(drink);
    }
    
    // If it's a cold coffee, add its HTML to our coldHTML string
    if (drink.category === 'cold') {
      coldHTML = coldHTML + createCardHTML(drink);
    }
  }
  
  // Finally, put the massive strings of HTML directly into the webpage!
  hotGrid.innerHTML = hotHTML;
  coldGrid.innerHTML = coldHTML;
}
