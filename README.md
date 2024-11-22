#News Bias Detector Extension
A Chrome extension that scans the text on any webpage and analyzes it for bias or factual inaccuracies. Using advanced AI models and APIs, this tool helps users identify potentially unreliable or biased news articles and fosters critical thinking.

##Features
Text Extraction: Automatically extracts visible text from the current webpage.
AI-Powered Analysis: Utilizes pre-trained language models (like OpenAI GPT) or fact-checking APIs (e.g., Google Fact Check) to analyze content for bias or inaccuracies.
User-Friendly Interface: Displays results in a clean, easy-to-read popup UI.
Customizable Alerts: Highlights key findings or warnings about potentially biased content.

##How It Works
Install the extension from the Chrome Web Store (or load it in Developer Mode).
Click the extension icon to activate it on any webpage.
The extension scans the text of the page and sends it to the backend for analysis.
Results are displayed in a popup, indicating the presence of bias, factual errors, or reliability concerns.

##Tech Stack
Chrome Extension API: Built using JavaScript, HTML, and CSS.
NLP Models: Integrates OpenAI's GPT or fine-tuned LLaMA models for text analysis.
APIs: Supports integration with Google Fact Check and other fact-verification tools.
Storage: Uses Chrome's local storage for temporary caching of analysis results.
