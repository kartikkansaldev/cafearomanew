// ==========================================
// VIVA PREP: WHAT IS querySelectorAll?
// document.querySelectorAll searches the whole webpage and grabs ALL HTML 
// elements that match a class name (like '.tab-btn'). It puts them inside a list.
// ==========================================

// 1. Grab all the tab buttons on the page (both Menu tabs and Rewards tabs)
let tabButtons = document.querySelectorAll('.tab-btn, .star-tab');

// ==========================================
// VIVA PREP: WHAT IS A FOR LOOP?
// A "for loop" repeats a block of code a certain number of times. 
// Here, we loop through our list of buttons. 'i' starts at 0, and goes up 
// until it reaches the total number of buttons (tabButtons.length).
// ==========================================

for (let i = 0; i < tabButtons.length; i++) {
  let button = tabButtons[i]; // Get one button from the list at a time
  
  // 3. Add a "click" event listener to this specific button
  button.addEventListener('click', function() {
    
    // Step A: Find the parent box that holds this group of tabs
    // We do this so we only change tabs in the same menu, not the whole page.
    let parentContainer = button.parentElement;
    
    // Step B: Find all sibling tabs inside that parent box
    let siblings = parentContainer.querySelectorAll('.tab-btn, .star-tab');
    
    // Loop through all the siblings and remove the 'active' class
    // This turns off the color for the old tab
    for (let j = 0; j < siblings.length; j++) {
      siblings[j].classList.remove('active');
    }
    
    // Step C: Add the 'active' class to the exact button we just clicked!
    // classList allows Javascript to add or remove CSS classes from HTML.
    button.classList.add('active');

    // Step D: Change the background color of the whole page (if the tab has a custom color)
    // We read the 'data-color' attribute we wrote in our HTML
    if (button.dataset.color) {
      document.body.style.backgroundColor = button.dataset.color;
      updateBodyTheme(button.dataset.color);
      // We manually trigger a scroll event so the navbar updates its text color
      window.dispatchEvent(new Event('scroll'));
    }

    // Step E: Hide the old panel and show the new panel!
    // Find out which panel this button is supposed to open
    let targetPanelId = button.dataset.target;
    let targetPanel = document.getElementById(targetPanelId);
    
    if (targetPanel) {
      let panelContainer = targetPanel.parentElement;
      
      // Find all panels inside this section
      let allPanelsInGroup = panelContainer.querySelectorAll('.tab-panel, .star-panel');
      
      // Loop through all panels and hide them by removing the 'active' class
      for (let k = 0; k < allPanelsInGroup.length; k++) {
        allPanelsInGroup[k].classList.remove('active');
      }
      
      // Finally, show the panel we want by adding the 'active' class
      targetPanel.classList.add('active');
    }
  });
}

// ==========================================
// VIVA PREP: HELPER FUNCTION
// This function checks if a color is light or dark, and adds a CSS class 
// to the body so text colors stay readable (white text on dark backgrounds, etc).
// ==========================================
function updateBodyTheme(colorHex) {
  if (colorHex === undefined || colorHex[0] !== '#') {
    document.body.classList.add('dark-bg');
    document.body.classList.remove('light-bg');
    return;
  }
  
  // Basic math to figure out brightness
  let hex = colorHex.substring(1);
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If brightness is low, it's dark! If high, it's light!
  if (brightness < 150) {
    document.body.classList.add('dark-bg');
    document.body.classList.remove('light-bg');
  } else {
    document.body.classList.add('light-bg');
    document.body.classList.remove('dark-bg');
  }
}

// 4. When the page first loads, set the correct background color
let initialActiveTab = document.querySelector('.tab-btn.active, .star-tab.active');
if (initialActiveTab && initialActiveTab.dataset.color) {
  document.body.style.backgroundColor = initialActiveTab.dataset.color;
  updateBodyTheme(initialActiveTab.dataset.color);
}

// 5. Smart Sticky Navbar (Hide when scrolling down, show when scrolling up)
let lastScrollY = window.scrollY;
let mainNav = document.querySelector('nav');
let subNav = document.querySelector('.sub-nav');

window.addEventListener('scroll', function() {
  let currentScrollY = window.scrollY;
  
  // If we scrolled down more than 50px, hide the navbar
  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    if (mainNav) { mainNav.classList.add('nav-hidden'); }
    if (subNav) { subNav.classList.add('nav-hidden'); }
  } else {
    // If we scroll up, show the navbar again
    if (mainNav) { mainNav.classList.remove('nav-hidden'); }
    if (subNav) { subNav.classList.remove('nav-hidden'); }
  }
  
  // Update our last known scroll position
  lastScrollY = currentScrollY;
});
