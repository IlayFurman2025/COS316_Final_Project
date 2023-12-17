chrome.runtime.onInstalled.addListener(function () {
  // Set the default state of the ad blocker to 'enabled' when the extension is installed
  chrome.storage.local.set({ adBlockerEnabled: true });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.adBlockerEnabled !== undefined) {
    // Update ad blocking functionality based on the state
    updateAdBlocking(request.adBlockerEnabled);
  }
});

function updateAdBlocking(enabled) {
  if (enabled) {
    // Enable the entire ruleset defined in rules.json
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["ruleset_1"],
    });
  } else {
    // Disable the entire ruleset
    chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ["ruleset_1"],
    });
  }
}
