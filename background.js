chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.id) return;

    let message = null;

    switch(command) {
      case 'run-1': message = { action: 'number', value: 1 }; break;
      case 'run-2': message = { action: 'number', value: 2 }; break;
      case 'run-3': message = { action: 'number', value: 3 }; break;
      case 'run-special': message = { action: 'special' }; break;
    }

    if (message) {
      chrome.tabs.sendMessage(tab.id, message, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Message failed:', chrome.runtime.lastError.message);
        } else {
          console.log('Message response:', response);
        }
      });
    }
  });
});


chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'insertText') {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return; // no active tab
      const tabId = tabs[0].id;

      // Inject code into the page
      chrome.scripting.executeScript({
        target: { tabId, world: 'MAIN' }, // MAIN = page JS context
        args: [msg.text],
        func: (text) => {
          const input = document.activeElement;
          if (!input) return;

          input.focus();

          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          } else if (input.isContentEditable) {
            document.execCommand('insertText', false, text);
          }
        }
      });
    });
  }
});

// Listen for messages from the options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);  // Debug log to see the received message

  if (message.action === 'saveAPIKey') {
    // Save the API key to chrome.storage.local
    console.log('Saving API Key:', message.APIKEY);
    chrome.storage.local.set({ APIKEY: message.APIKEY }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving to storage:', chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        console.log('API Key saved to storage');
        sendResponse({ success: true });
      }
    });
  } else if (message.action === 'loadAPIKey') {
    // Load the API key from chrome.storage.local and send it back to the options page
    chrome.storage.local.get('APIKEY', (result) => {
      console.log('Loaded from storage:', result.APIKEY);
      if (chrome.runtime.lastError) {
        console.error('Error reading from storage:', chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        sendResponse({ APIKEY: result.APIKEY });
      }
    });
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'loadAPIKey') {
    // Load the API key from chrome.storage.local
    chrome.storage.local.get('APIKEY', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error reading from storage:', chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        // Respond with the stored API key
        sendResponse({ APIKEY: result.APIKEY });
      }
    });
    // Return true to indicate the response is asynchronous
    return true;
  }
});
