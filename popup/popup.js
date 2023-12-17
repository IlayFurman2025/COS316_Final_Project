document.addEventListener('DOMContentLoaded', function () {

  function updateCounterDisplay(count) {
    document.getElementById('adCounter').textContent = count;
  }

  // Request the ad block count when the DOM content is fully loaded
  chrome.runtime.sendMessage({ getBlockedAdsCount: true }, response => {
    updateCounterDisplay(response.blockedAdsCount);
  });

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.blockedAdsCount !== undefined) {
	updateCounterDisplay(message.blockedAdsCount);
    }
  });
}
