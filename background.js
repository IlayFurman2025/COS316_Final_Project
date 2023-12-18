chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ adBlockerEnabled: true });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.adBlockerEnabled !== undefined) {
    updateAdBlocking(request.adBlockerEnabled);
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
