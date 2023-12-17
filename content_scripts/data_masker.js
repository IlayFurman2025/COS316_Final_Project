let isMaskingEnabled = false;

// Function to mask data in a field
function maskData(field) {
  if (field.dataset.originalValue === undefined) {
    field.dataset.originalValue = field.value;
  } else {
    // Update the stored original value only if it's not currently masked
    if (!isMaskingEnabled) {
      field.dataset.originalValue = field.value;
    }
  }
  if (isMaskingEnabled) {
    field.value = field.value.replace(/./g, "*");
  }
}

// Function to unmask data in a field
function unmaskData(field) {
  if (field.dataset.originalValue !== undefined) {
    field.value = field.dataset.originalValue;
  }
}

// Apply or remove masking from a field based on isMaskingEnabled
function applyMaskingToField(field) {
  if (isMaskingEnabled) {
    maskData(field);
  } else {
    unmaskData(field);
  }
}

// Set up event listeners on input fields for real-time masking and value updates
function setupFieldListeners(field) {
  field.addEventListener("input", () => {
    maskData(field);
  });
}

// Iterate over and initialize all applicable input fields
function initializeInputFields() {
  const inputFields = document.querySelectorAll(
    'input[type="text"], input[type="search"], input:not([type])'
  );
  inputFields.forEach((field) => {
    applyMaskingToField(field);
    setupFieldListeners(field);
  });
}

// MutationObserver to monitor changes in the DOM and apply masking to new input fields
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.querySelectorAll) {
        node
          .querySelectorAll(
            'input[type="text"], input[type="search"], input:not([type])'
          )
          .forEach((field) => {
            applyMaskingToField(field);
            setupFieldListeners(field);
          });
      }
    });
  });
});

// Start observing the document body for added nodes
observer.observe(document.body, { childList: true, subtree: true });

// Listen for toggle message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggleMasking !== undefined) {
    isMaskingEnabled = request.toggleMasking;
    initializeInputFields();
  }
});

// Initialize fields on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initializeInputFields();
});
