// Function to send a message to the background script to save the value
function saveValue() {
  const value = document.getElementById('APIKEY').value;
  console.log('Saving value:', value);  // Log what we are trying to save

  if (!value) {
    console.log('No value entered. Skipping save.');
    return; // Skip if the input field is empty
  }

  // Send a message to the background script to save the value
  chrome.runtime.sendMessage({ action: 'saveAPIKey', APIKEY: value }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error in message response:', chrome.runtime.lastError);
    } else {
      console.log('Response from background script:', response);
    }
  });
}

// Save on "blur" (when the input loses focus)
document.getElementById('APIKEY').addEventListener('blur', () => {
  console.log('Input lost focus (blur event)');
  saveValue();
});

// Save when the "Save" button is clicked
document.getElementById('saveButton').addEventListener('click', () => {
  console.log('Save button clicked');
  saveValue();  // Call saveValue() when button is clicked
});

// Load the value from chrome.storage.local when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Options page loaded, sending load request');
  chrome.runtime.sendMessage({ action: 'loadAPIKey' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error reading from storage:', chrome.runtime.lastError);
    } else {
      console.log('Loaded value from background script:', response.APIKEY);
      if (response && response.APIKEY) {
        document.getElementById('APIKEY').value = response.APIKEY;
      } else {
        console.log('No API key found in storage');
      }
    }
  });
});
