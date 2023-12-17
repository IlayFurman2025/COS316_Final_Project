// Function to update the counter in the popup
function updateCounterDisplay(count) {
  document.getElementById('adCounter').textContent = count;
}

// Request the current ad block count from the background script when the popup is opened
chrome.runtime.sendMessage({ getBlockedAdsCount: true }, response => {
  updateCounterDisplay(response.blockedAdsCount);
});

// Listen for real-time updates from the background script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.blockedAdsCount !== undefined) {
    updateCounterDisplay(message.blockedAdsCount);
  }
});
