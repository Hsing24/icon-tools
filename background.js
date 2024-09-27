chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: extractSVGSymbols,
	});
});

function extractSVGSymbols() {
	// This function will be implemented to extract SVG symbols
	console.log("Extracting SVG symbols...");
}