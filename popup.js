document.getElementById('analyze').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.error("No active tabs found.");
        document.getElementById("nationalist-bias").textContent = "Error: No active tab.";
        document.getElementById("political-bias").textContent = "Error: No active tab.";
        return;
      }
  
      const activeTabId = tabs[0].id;
      console.log("Active Tab ID:", activeTabId);
  
      // Programmatically inject the content script
      chrome.scripting.executeScript(
        { target: { tabId: activeTabId }, files: ["content.js"] },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error injecting content script:", chrome.runtime.lastError.message);
            document.getElementById("nationalist-bias").textContent = "Error: Unable to inject content script.";
            document.getElementById("political-bias").textContent = "Error: Unable to inject content script.";
            return;
          }
  
          console.log("Content script injected successfully.");
  
          // Send a message to the content script to extract text from the page
          chrome.tabs.sendMessage(activeTabId, { action: "extractText" }, (response) => {
            if (chrome.runtime.lastError || !response || !response.text) {
              console.error("Error extracting text:", chrome.runtime.lastError?.message);
              document.getElementById("nationalist-bias").textContent = "Error: Unable to extract text.";
              document.getElementById("political-bias").textContent = "Error: Unable to extract text.";
              return;
            }
  
            console.log("Extracted text from content script:", response.text);
  
            // Send extracted text to the background script for analysis
            chrome.runtime.sendMessage(
              { action: "analyzeText", text: response.text },
              (result) => {
                if (chrome.runtime.lastError || !result || !result.analysis) {
                  console.error("Error analyzing text:", chrome.runtime.lastError?.message);
                  document.getElementById("nationalist-bias").textContent = "Error analyzing text.";
                  document.getElementById("political-bias").textContent = "Error analyzing text.";
                  return;
                }
  
                console.log("Analysis result:", result.analysis);
  
                // Parse the analysis result
                const analysis = result.analysis.split("\n");
                const nationalistBias = analysis.find((line) =>
                  line.startsWith("Nationalist Bias:")
                ) || "Nationalist Bias: None";
                const politicalBias = analysis.find((line) =>
                  line.startsWith("Political Bias:")
                ) || "Political Bias: None";
                const detailedSummary = analysis
                  .slice(2) // Assume the detailed summary starts after the first two lines
                  .join("\n");
  
                // Update the concise analysis
                document.getElementById("nationalist-bias").textContent = nationalistBias.replace(
                  "Nationalist Bias:",
                  ""
                ).trim();
                document.getElementById("political-bias").textContent = politicalBias.replace(
                  "Political Bias:",
                  ""
                ).trim();
  
                // Update the detailed summary
                document.getElementById("detailed-content").textContent = detailedSummary.trim();
  
                // Show the "See More" button if there is a detailed summary
                if (detailedSummary.trim()) {
                  const seeMoreButton = document.getElementById("see-more");
                  const detailedSummaryDiv = document.getElementById("detailed-summary");
  
                  seeMoreButton.style.display = "inline-block";
                  seeMoreButton.addEventListener("click", () => {
                    const isHidden = detailedSummaryDiv.style.display === "none";
                    detailedSummaryDiv.style.display = isHidden ? "block" : "none";
                    seeMoreButton.textContent = isHidden ? "See Less" : "See More";
                  });
                } else {
                  document.getElementById("see-more").style.display = "none";
                }
              }
            );
          });
        }
      );
    });
  });
  