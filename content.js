// Extract all visible text from the webpage
function extractPageText() {
    const textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentNode.offsetParent !== null) { // Ensure the node is visible
        textNodes.push(node.nodeValue.trim());
      }
    }
    return textNodes.join(" ");
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractText") {
      const extractedText = extractPageText();
      console.log("Extracted text from page:", extractedText);
      sendResponse({ text: extractedText }); // Send the extracted text back to the popup
    }
  });
  