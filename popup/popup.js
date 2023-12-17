document.addEventListener("DOMContentLoaded", function () {
  var toggleAdBlockerButton = document.getElementById("toggleAdBlockerButton");
  var toggleMaskingButton = document.getElementById("toggleMaskingButton");

  // Check and update the state of ad blocker
  chrome.storage.local.get(["adBlockerEnabled"], function (result) {
    toggleAdBlockerButton.textContent = result.adBlockerEnabled
      ? "Disable Ad Blocker"
      : "Enable Ad Blocker";
  });

  // Check and update the state of masking
  chrome.storage.local.get(["maskingEnabled"], function (result) {
    toggleMaskingButton.textContent = result.maskingEnabled
      ? "Disable Masking"
      : "Enable Masking";
  });

  // Toggle ad blocker
  toggleAdBlockerButton.addEventListener("click", function () {
    chrome.storage.local.get(["adBlockerEnabled"], function (result) {
      var currentState = result.adBlockerEnabled;
      chrome.storage.local.set(
        { adBlockerEnabled: !currentState },
        function () {
          toggleAdBlockerButton.textContent = currentState
            ? "Enable Ad Blocker"
            : "Disable Ad Blocker";
          chrome.runtime.sendMessage({ adBlockerEnabled: !currentState });
        }
      );
    });
  });

  // Toggle masking
  toggleMaskingButton.addEventListener("click", function () {
    chrome.storage.local.get(["maskingEnabled"], function (result) {
      var currentState = result.maskingEnabled;
      chrome.storage.local.set({ maskingEnabled: !currentState }, function () {
        toggleMaskingButton.textContent = currentState
          ? "Enable Masking"
          : "Disable Masking";
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              toggleMasking: !currentState,
            });
          }
        );
      });
    });
  });
});
