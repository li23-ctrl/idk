
document.getElementById('loadBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: Run
  });
});



/*
console.log("first");
if (document.readyState !== 'loading') {
  Run(); // The DOM is already ready, run the code
} else {
  document.addEventListener('DOMContentLoaded', Run); // The DOM is still loading, add the listener
}
*/
function Run()
{

  let KEY = "";

     // Send a message to the background script to request the API key
chrome.runtime.sendMessage({ action: 'loadAPIKey' }, (response) => {
  if (response && response.APIKEY) {
    console.log('Received API Key from background script:', response.APIKEY);
    // Now you can use the API key in the content script
    // For example, let's set it in the document body as a test:
    KEY = response.APIKEY;
  } else {
    console.log('No API Key found in storage or error occurred');
  }
});

 

function insertBoxAtAttributeFreeAncestor() {
    const inputBox = document.querySelector('div[role="textbox"][contenteditable="true"]');
    if (!inputBox) return null;

    let container = inputBox.parentElement;
    while (container && container.tagName === 'DIV' && container.attributes.length > 0) {
        container = container.parentElement;
    }
    if (!container) return null;

    let box = document.getElementById('custom-attribute-free-box');
    if (box) return box;



    



    // Create a div instead of a textarea
    box = document.createElement('div');
    box.id = 'custom-attribute-free-box';
    box.setAttribute('contenteditable', 'false'); // read-only
    box.style.width = '100%';
    box.style.height = '100px';
    box.style.margin = '8px 0';
    box.style.border = '1px solid #ccc';
    box.style.borderRadius = '8px';
    box.style.padding = '6px';
    box.style.fontSize = '10px';
    box.style.boxSizing = 'border-box';
    box.style.overflowY = 'auto';       // scroll if content is tall
    box.style.whiteSpace = 'pre-wrap';  // preserve line breaks
box.style.resize = "vertical";  // or "both" for horizontal + vertical
box.style.overflow = "auto";    // scrollbars appear when needed


    space = document.createElement('div');
    space.style.height = '10px';
    space.style.backgroundColor = 'transparent';

    rname = document.createElement('div');
    rname.innerText = 'The Rizzler (check ur keybinds)';
    rname.margin = '16px';
    rname.style.display = 'flex';            // Use flexbox to center content
rname.style.justifyContent = 'center';   // Center horizontally
rname.style.alignItems = 'center';       // Center vertically

// Optionally, add some extra styles for better look
rname.style.fontSize = '12px';  
 rname.style.backgroundColor = 'transparent;'
  // optional max height relative to viewport


box.innerText = "output here..."


/*
    box = document.createElement('textarea');
    box.id = 'custom-attribute-free-box';
    box.placeholder = 'Loaded messages will appear here...';
    box.style.width = '100%';
    box.style.height = '100px';
    box.style.margin = '8px 0';
    box.style.border = '1px solid #ccc';
    box.style.borderRadius = '8px';
    box.style.padding = '6px';
    box.style.fontSize = '14px';
    box.style.resize = 'none';
    box.style.boxSizing = 'border-box';*/

    container.prepend(box);
    container.prepend(rname);
    container.prepend(space);
    return box;
}

const box = insertBoxAtAttributeFreeAncestor();

// functions.js
function runNumber(n) {
  const rec =[ "aarewjgvehrughea", "brefjirfukyiu", "ckys"];
  //recommendations = rec;
  console.log('Number:', n);
  console.log(recommendations);
  if (recommendations.length >= n)
  {

  console.log(recommendations[n-1]);
  const replacement = recommendations[n-1];

  
  replaceInput(replacement);


  
  console.log("fin");

/*
    inputBox.focus();

    // Use Selection API to select all content
    const range = document.createRange();
    range.selectNodeContents(inputBox);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // Replace the selection with new text
    document.execCommand('insertText', false, replacement);

    // Notify React
    inputBox.dispatchEvent(new InputEvent('input', { bubbles: true }));

*/
  }
}
function replaceInput(replacement)
{
  inputBox.focus();

    console.log("b")
  console.log(inputBox);


   const range = document.createRange();
    range.selectNodeContents(inputBox);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

 setTimeout(() => {
    // Step 3: Execute the command to clear the text
    document.execCommand('insertText', false, "");
  }, 0);

setTimeout(() => {
    // For contenteditable / rich text editors
    document.execCommand('insertText', false, replacement);

},0);

}






const promptwords = `You are the rizzler. You are an expert at obtaining partners, of any gender. You have a client who you must help with obtaining a partner. They are your friend, and you should talk casually. Do not delimit sections with anything. Do not ask if the client wants more help. Send all your messages in a natural way. Respond like the thoughts of a friend looking upon their texts. Try to not be too assertive. Tune your responses and recommendations to the style of the conversation between the client and the target.
You will help with their instagram texts. You will give advice, predictions on the relationship status, and suggestions. Do not exceed 100 words, excluding recommended texts. You may give multiple suggestions, but give at least one and at most three. Insert recommendation texts enclosed in curly brackets. Do not use these brackets for anything else. 
All client messages will be prefixed with [client], all target messages will be prefixed with [target]. These messages have already been sent. Evaluate these messages and tell the client their relationship status and how to proceed. 
The client may also request your help, in which case you will receive the message they want to send, prefixed with [proposition]. This message has not been sent and can be replaced. You must analyze and evaluate the client’s proposed message. You must then send recommended messages as a replacements. If the proposition is empty, suggest messages instead.
You will be sent blocks of messages and requests. These will be updates to the conversation. Evaluate the entire block once, and not as a collection, each time you are sent a block. Consider the entire conversation in your response to a block, especially if the block is empty.
`;

let recommendations = [];
const inputBox = document.querySelector('div[contenteditable="true"][aria-label]');

    // Step 2: Find the inner text element (contenteditable)
    //document.querySelector('div[role="textbox"][contenteditable="true"]');

function runSpecial() {
   let words = extractMessages().map(word => "\n[" + word.sender + "] " + word.text);
   let proposal = "[proposition] " + extractInput();
    let prompt = "send\n" + promptwords + words + proposal;
  //getChatGPTResponse("")
  box.innerText = "loading...";
  (async () => {
  const result = await getGeminiResponse(prompt);
  console.log(result);
  recommendations = setBoxFormatted(result, box);
  })();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'number') runNumber(msg.value);
  if (msg.action === 'special') runSpecial();
});



/**
 * Set the custom box text with color for {} content.
 * 
 * @param {string} str - string containing up to 3 {} blocks
 * @param {HTMLElement} box - the div to render into
 * @returns {string[]} - list of inner strings inside {}
 */
function setBoxFormatted(str, box) {
  if (!box) return [];

  // Define up to 3 colors
  const colors = ['red', 'green', 'blue'];
  
  // Regex to match {content}
  const regex = /\{(.*?)\}/g;
  let match;
  let colorIndex = 0;
  const innerStrings = [];

  // Start building HTML
  let html = '';
  let lastIndex = 0;

  while ((match = regex.exec(str)) !== null && colorIndex < colors.length) {
    innerStrings.push(match[1]); // save inner content

    // Add text before the {}
    html += str.substring(lastIndex, match.index);

    // Add colored span for inner content
    html += `<span style="color:${colors[colorIndex]}">${match[1]}</span>`;

    lastIndex = match.index + match[0].length;
    colorIndex++;
  }

  // Add remaining text after last match
  html += str.substring(lastIndex);

  // Set innerHTML of the box
  box.innerHTML = html;
  console.log(innerStrings);
  return innerStrings;
}

async function getGeminiResponse(prompt) {
  const apiKey = KEY;//"AIzaSyAya5btBx4XqAI6nNFpjs4P_oQGVoFLneQ"; // set your Gemini API key here
  const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",   // you can change this model as needed
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`HTTP ${res.status} – ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    // This path matches the Gemini Chat Completions response format
    const text = data.choices?.[0]?.message?.content ?? "";
    return text;

  } catch (error) {
    console.error("Gemini API error:", error);
    return `Error: ${error.message}`;
  }
}


async function getChatGPTResponse(prompt) {
  const apiKey = "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"; // Replace with your API key

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    return null;
  }
}


function extractMessages() {
      function getTextFromMessageRow(row) {
    const textContainers = row.querySelectorAll('div[dir="auto"]');
    const textParts = [];
    textContainers.forEach(div => {
      div.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const txt = node.textContent.trim();
          if (txt) textParts.push(txt);
        }
      });
    });
    return textParts.join('\n');
    }


function getBubbleFromMessageRow(messageRow) {
  if (!messageRow) return null;

  // 1️⃣ Find the div whose class starts with "html-div"
  const  buttonDiv = messageRow.querySelector('div[role="button"]');
  if (!buttonDiv) return null;
  const htmlDiv = Array.from(buttonDiv.querySelectorAll('div'))
    .find(d => {
        if (d.attributes.length !== 1) return false;
      const cls = d.className;
      return cls && cls.split(' ')[0] === 'html-div'; // first class is html-div
    });

  if (!htmlDiv) return null;

  // 2️⃣ The first child is the actual bubble
  const bubbleDiv = htmlDiv;
    console.log(bubbleDiv);
    //console.log(messageRow);
  return bubbleDiv || null;
}


  const messages = [];
  

  document.querySelectorAll('div[role="row"]').forEach(row => {
    const bubble = getBubbleFromMessageRow(row);
    if (!bubble) return;

    const text = getTextFromMessageRow(bubble);

    
    const style = window.getComputedStyle(bubble.firstElementChild);

    const incomingColor = style.getPropertyValue('--chat-incoming-message-bubble-background-color').trim();
    const bgColor = style.backgroundColor;









    const sender = (bgColor === incomingColor) ? "target" : "client";// senderEl.innerText.trim() : null;

    messages.push({ sender, text });
  });

  return messages;
}



//function setInput(words)
//{
//    const inputBox = document.querySelector('div[role="textbox"][contenteditable="true"]');
//    inputBox.?innerText = words;
//}

function extractInput()
{
    function getTypedMessage() {
    inputBox.querySelector('div[contenteditable="true"]');
    console.log(inputBox);
    return inputBox ? inputBox.innerText.trim() : '';
  }

  // Include the message currently being typed
  const typed = getTypedMessage();
  if (typed) {
    return typed;
  }

  return null;
}


//console.log(extractInput());


}