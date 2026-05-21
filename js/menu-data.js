/* =====================================================
   menu-data.js — Dynamic Menu Loading (JSON/Arrays)
   Syllabus Topics: Variables & Const (L1-4), Arrays/Objects (L5-8),
                    JSON concepts (L19-22), map() function (L17-18),
                    DOM Creation & Appending (L23-26)
   ===================================================== */

// 1. Array of Objects (Syllabus L5-8)
// We store our menu data exactly like we would if we fetched it from a real JSON API!
const coffeeData = [
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
    img: 'now_make_different_flavour_of_202605201454.jpeg'
  },
  {
    id: 'find-2',
    category: 'finding',
    name: 'Hazelnut Vanilla',
    tag: '12 OZ POUCH',
    desc: 'Signature blend ground coffee pouch.',
    price: 1499,
    img: 'now_make_different_flavour_of_202605201438.jpeg'
  },
  {
    id: 'find-3',
    category: 'finding',
    name: 'Hazelnut Roast',
    tag: '12 OZ POUCH',
    desc: 'Signature blend ground coffee pouch.',
    price: 1649,
    img: 'now_make_different_flavour_of_202605201454(1).jpeg'
  },
  {
    id: 'find-4',
    category: 'finding',
    name: 'Original Roast',
    tag: '12 OZ POUCH',
    desc: 'Signature blend ground coffee pouch.',
    price: 1499,
    img: "don't_add_background_2K_202605201454.jpeg"
  }
];

// 2. DOM Selection (Syllabus L23-26)
// Find the empty containers in menu.html where we will inject the cards
const hotGrid = document.getElementById('hot-coffee-grid');
const coldGrid = document.getElementById('cold-coffee-grid');

// 3. Higher-Order Function: Filter (Syllabus L17-18)
const hotCoffees = coffeeData.filter(drink => drink.category === 'hot');
const coldCoffees = coffeeData.filter(drink => drink.category === 'cold');

// 4. Create Node Function (Syllabus L23-26)
// This function takes a single drink object and returns a piece of HTML
function createCardHTML(drink) {
  // We use Template Literals (``) from ES6 to easily inject variables into HTML strings
  return `
    <div class="featured-card" data-id="${drink.id}">
      <!-- HEART ICON FOR FAVORITES (We will select this in favorites.js) -->
      <button class="heart-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; color: #fff; cursor: pointer; text-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 10;">♡</button>
      
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

// 5. Render to the DOM (Syllabus L17-18 & L23-26)
// map() goes through the array, generates HTML for each, and join('') merges them into one big string.
// innerHTML writes that string directly into the webpage!
if (hotGrid && coldGrid) {
  hotGrid.innerHTML = hotCoffees.map(createCardHTML).join('');
  coldGrid.innerHTML = coldCoffees.map(createCardHTML).join('');
}
