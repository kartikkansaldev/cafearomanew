/* =====================================================
   tabs.js — JavaScript Tab Switching
   Syllabus Topics: Variables & Const (L1-4), 
                    DOM Selectors (L23-26), 
                    Event Delegation/Handling (L27-30),
                    Functions & Arrow Syntax (L13-16)
   ===================================================== */

// 1. Select all the tab buttons on the page using querySelectorAll (L23-26)
// This will grab both the Menu tabs (M E N U, F E A T U R E D) and Rewards tabs (25★, 50★)
const tabButtons = document.querySelectorAll('.tab-btn, .star-tab');

// 2. Loop through every single button (Syllabus L5-8)
// We use forEach to attach an Event Listener to each one.
tabButtons.forEach(button => {
  
  // 3. Add an Event Listener (L27-30)
  // Listen for the 'click' event
  button.addEventListener('click', () => {
    
    // Step A: Find out which group of tabs this button belongs to.
    // If it's a .tab-btn, its siblings are other .tab-btn inside .sub-nav.
    // We can look at the parent container to scope our changes.
    const parentContainer = button.parentElement;
    
    // Step B: Remove the "active" class from ALL buttons inside this specific group
    // This turns off the highlighting for the old tab
    const siblings = parentContainer.querySelectorAll('.tab-btn, .star-tab');
    siblings.forEach(sib => sib.classList.remove('active'));
    
    // Step C: Add the "active" class to the EXACT button we just clicked (L23-26)
    button.classList.add('active');

    // Step D: Change the background color if this tab requested it (Menu Page logic)
    // We read the custom HTML attribute data-color using dataset (L23-26)
    if (button.dataset.color) {
      document.body.style.backgroundColor = button.dataset.color;
      updateBodyTheme(button.dataset.color);
      // Dispatch scroll event so navbar text color updates to match new background color
      window.dispatchEvent(new Event('scroll'));
    }

    // Step E: Switch the panels!
    // Every button has a data-target attribute (e.g., data-target="panel-menu")
    const targetPanelId = button.dataset.target;
    
    // Find the container holding the panels (menu-layout or star-content-container)
    // We go up the DOM tree and find the relevant wrapper to avoid mixing menu and rewards panels.
    // A simple way is to just find ALL panels that are siblings of the target panel,
    // but the safest way is to find the target panel by ID, get its parent, and hide all its children.
    const targetPanel = document.getElementById(targetPanelId);
    
    if (targetPanel) {
      const panelContainer = targetPanel.parentElement;
      
      // Hide all panels inside this specific container
      const allPanelsInGroup = panelContainer.querySelectorAll('.tab-panel, .star-panel');
      allPanelsInGroup.forEach(panel => panel.classList.remove('active'));
      
      // Show the one we want
      targetPanel.classList.add('active');
    }
  });
});

// Helper function to update theme class based on background brightness
function updateBodyTheme(colorHex) {
  if (!colorHex || colorHex[0] !== '#') {
    document.body.classList.add('dark-bg');
    document.body.classList.remove('light-bg');
    return;
  }
  const hex = colorHex.substring(1);
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  if (brightness < 150) {
    document.body.classList.add('dark-bg');
    document.body.classList.remove('light-bg');
  } else {
    document.body.classList.add('light-bg');
    document.body.classList.remove('dark-bg');
  }
}

// 4. Initialize Background Color on Load
// Find the currently active tab (if any) and set the body color to match its dataset.color
const initialActiveTab = document.querySelector('.tab-btn.active, .star-tab.active');
if (initialActiveTab && initialActiveTab.dataset.color) {
  document.body.style.backgroundColor = initialActiveTab.dataset.color;
  updateBodyTheme(initialActiveTab.dataset.color);
}

// 5. Smart Sticky Navbar (Hide on scroll down, show on scroll up)
let lastScrollY = window.scrollY;
const mainNav = document.querySelector('nav');
const subNav = document.querySelector('.sub-nav');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  // If we scroll down more than 50px, hide the navbar
  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    if (mainNav) mainNav.classList.add('nav-hidden');
    if (subNav) subNav.classList.add('nav-hidden');
  } else {
    // If we scroll up, show the navbar
    if (mainNav) mainNav.classList.remove('nav-hidden');
    if (subNav) subNav.classList.remove('nav-hidden');
  }
  
  lastScrollY = currentScrollY;
});
