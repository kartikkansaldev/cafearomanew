/* =====================================================
   validation.js — Form Validation & Event Interception
   Syllabus Topics: Event Handling (L27-30), Event Prevention (L27-30),
                    DOM Manipulation (L23-26), BOM Alerts (L31-34)
   ===================================================== */

// 1. Select the form and its elements (L23-26)
const form = document.getElementById('newsletter-form');
const emailInput = document.getElementById('email-input');
const errorMsg = document.getElementById('email-error');

// Make sure the form exists on this page before running the code
if (form) {
  
  // 2. Event Listener for Form Submission (L27-30)
  form.addEventListener('submit', function(event) {
    
    // Step A: Prevent the default behavior! (L27-30)
    // Normally, submitting a form refreshes the page. We stop that here.
    event.preventDefault();
    
    // Step B: Get the value the user typed in
    const emailValue = emailInput.value.trim();
    
    // Step C: Validation Logic (L5-8 If/Else Statements)
    
    // Check if empty
    if (emailValue === '') {
      showError('Please enter an email address.');
      return; // Stop the function here
    }
    
    // Check if it looks like a real email (contains @ and .)
    // This is a simple validation check.
    if (!emailValue.includes('@') || !emailValue.includes('.')) {
      showError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    
    // If it passes all tests, it is valid!
    // Hide the error message
    errorMsg.style.display = 'none';
    
    // Show a success alert (BOM L31-34)
    alert(`Thank you for subscribing!\nUpdates will be sent to: ${emailValue}`);
    
    // Clear the input box
    emailInput.value = '';
  });
}

// Helper function to easily display error messages
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block'; // Unhide the paragraph
}
