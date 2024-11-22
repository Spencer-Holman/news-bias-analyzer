chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzeText") {
      console.log("Received text to analyze:", message.text);
  
      analyzeTextWithOpenAI(message.text)
        .then((result) => {
          sendResponse({ analysis: result });
        })
        .catch((error) => {
          console.error("Error in OpenAI API call:", error);
          sendResponse({ analysis: "Error analyzing text." });
        });
  
      return true; // Keeps the message channel open for asynchronous response
    }
  });
  
  async function analyzeTextWithOpenAI(text) {
    const apiKey = process.env.OPENAI_API_KEY; // Your OpenAI API Key
    const apiUrl = "https://api.openai.com/v1/chat/completions";
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an assistant that analyzes text for nationalist and political biases. Your job is to detect and summarize any bias in the text clearly. Use the following structure for your response:\n\nNationalist Bias: [List pro- or anti- countries, or state 'No Significant Bias' if no bias applies.]\nPolitical Bias: [List pro- or anti- political ideologies, parties, or leaders, or state 'No Significant Bias' if no bias applies.]\n\nProvide only the above structure in your response. Do not include any other information.",
            },
            {
              role: "user",
              content: `Analyze the following text for bias:\n\n${text}`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.choices[0].message.content.trim();
      } else {
        console.error("API Error:", data);
        return `Error: ${data.error ? data.error.message : "Unknown error"}`;
      }
    } catch (error) {
      console.error("Network or API Error:", error);
      return "Error analyzing text.";
    }
  }
  