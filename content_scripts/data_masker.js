let isMaskingEnabled = false;

// Function to mask data
function maskData() {
  const inputFields = document.querySelectorAll('input[type="text"]');
  inputFields.forEach((field) => {
    if (!field.dataset.originalValue) {
      field.dataset.originalValue = field.value;
      field.value = field.value.replace(/./g, "*"); // Replace with asterisks or other characters
    }
  });
}

// Function to unmask data
function unmaskData() {
  const inputFields = document.querySelectorAll('input[type="text"]');
  inputFields.forEach((field) => {
    if (field.dataset.originalValue) {
      field.value = field.dataset.originalValue;
      delete field.dataset.originalValue;
    }
  });
}

// Listen for toggle message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggleMasking !== undefined) {
    isMaskingEnabled = request.toggleMasking;
    isMaskingEnabled ? maskData() : unmaskData();
  }
});
