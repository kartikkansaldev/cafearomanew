// ==========================================
// VIVA PREP: WHAT IS THE DOM?
// DOM stands for Document Object Model. 
// It is how JavaScript talks to HTML. The browser turns all HTML tags 
// (like <div>, <form>, <input>) into "Objects" that JavaScript can read and change.
// 
// VIVA PREP: WHAT IS getElementById?
// It is a built-in function that searches the HTML document and finds 
// the exact element that has the matching id attribute.
// ==========================================

// 1. Grab the form and input elements from the HTML using their IDs
let form = document.getElementById('newsletter-form');
let emailInput = document.getElementById('email-input');
let errorMsg = document.getElementById('email-error');

// Make sure the form actually exists on this page before we do anything
if (form) {
  
  // ==========================================
  // VIVA PREP: WHAT IS AN EVENT LISTENER?
  // It is a function that "listens" for something to happen on the webpage, 
  // like a 'click' or a form 'submit'. When that event happens, it runs our code.
  // ==========================================
  
  // 2. Listen for the user to submit the form
  form.addEventListener('submit', function(event) {
    
    // Step A: Prevent the default behavior!
    // Normally, submitting a form refreshes the page. 
    // event.preventDefault() stops the page from reloading.
    event.preventDefault();
    
    // Step B: Get the value the user typed in
    // .trim() removes any accidental spaces before or after the email
    let emailValue = emailInput.value.trim();
    
    // ==========================================
    // VIVA PREP: IF / ELSE CONDITIONALS
    // We use "if" statements to make decisions in our code.
    // The triple equals (===) checks if the value is EXACTLY equal to what we want.
    // ==========================================
    
    // Check if the user left the input box empty
    if (emailValue === '') {
      showError('Please enter an email address.');
      return; // "return" stops the function right here, so the rest of the code doesn't run
    }
    
    // Check if it looks like a real email (it must contain '@' and '.')
    // The "||" means OR. If it does NOT (!) have '@' OR it does NOT have '.', show error.
    if (!emailValue.includes('@') || !emailValue.includes('.')) {
      showError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    
    // If it passes all tests above, the email is valid!
    
    // Hide the error message text by changing its CSS display property to 'none'
    errorMsg.style.display = 'none';
    
    // Show a success popup box using the built-in alert() function
    alert("Thank you for subscribing!\nUpdates will be sent to: " + emailValue);
    
    // Clear the input box so it is empty again
    emailInput.value = '';
  });
}

// ==========================================
// VIVA PREP: WHAT IS A FUNCTION?
// A function is a reusable block of code that does a specific task.
// We created this custom function so we don't have to type these 
// two lines of code over and over again.
// ==========================================

function showError(message) {
  errorMsg.textContent = message; // Change the text inside the error paragraph
  errorMsg.style.display = 'block'; // Make the paragraph visible on the screen
}
