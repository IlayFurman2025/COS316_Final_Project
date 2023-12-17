chrome.runtime.onInstalled.addListener(function () {
  // Set the default state of the ad blocker to 'enabled' when the extension is installed
  chrome.storage.local.set({ adBlockerEnabled: true });
});

// Handle adblock statistics
let blockedAdsCount = 0;

chrome.declarativeNetRequest.onRuleMatched.addListener(({ rule }) => {
  if (rule.action.type === 'block') {
    blockedAdsCount++;
    // Inform the popup
    if (chrome.runtime.lastError === undefined) { // Avoid errors when popup is not open
      chrome.runtime.sendMessage({ blockedAdsCount: blockedAdsCount });
    }
  }
});

// Combine message listeners
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.getBlockedAdsCount) {
    sendResponse({ blockedAdsCount: blockedAdsCount });
  } else if (message.adBlockerEnabled !== undefined) {
    updateAdBlocking(message.adBlockerEnabled);
  }
    return true; // Indicates a response will be sent asynchronously
});

// Update the popup with the most recent number of blocked ads
function updatePopupCounter() {
  chrome.runtime.sendMessage({ blockedAdsCount: blockedAdsCount });
}

// Reset the counter when the browser starts a new session or on demand
function resetCounter() {
  blockedAdsCount = 0;
  chrome.declarativeNetRequest.clearRuleMatchedCounts();
  updatePopupCounter();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.getBlockedAdsCount) {
    sendResponse({ blockedAdsCount: blockedAdsCount });
  }
});

function updateAdBlocking(enabled) {
  if (enabled) {
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["ruleset_1"],
    });
  } else {
    chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ["ruleset_1"],
    });
  }
}
