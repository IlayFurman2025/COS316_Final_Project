let isMaskingEnabled = false;

// Function to mask data in a field
function maskData(field) {
  if (field.dataset.originalValue === undefined) {
    field.dataset.originalValue = field.value;
  } else {
    // Update the stored original value only if it's not currently masked
    if (!isMaskingEnabled) {
      if (field.value.includes("*")) {
        field.value = field.dataset.originalValue;
      }
      // Typing
      if (field.value.length > field.dataset.originalValue.length) {
        field.dataset.originalValue += field.value.slice(-1);
      }
      // Deleting
      else if (field.value.length < field.dataset.originalValue.length) {
        field.dataset.originalValue = field.dataset.originalValue.slice(0, -1);
      }
    }
  }
  if (isMaskingEnabled) {
    // Typing
    if (field.value.length > field.dataset.originalValue.length) {
      field.dataset.originalValue += field.value.slice(-1);
    }
    // Deleting
    else if (field.value.length < field.dataset.originalValue.length) {
      field.dataset.originalValue = field.dataset.originalValue.slice(0, -1);
    }

    field.value =
      field.dataset.originalValue.slice(0, -1).replace(/./g, "*") +
      field.dataset.originalValue.slice(-1);
  }
}

function setupFieldListeners(field) {
  field.addEventListener("input", () => {
    maskData(field);
  });
}

function initializeInputFields() {
  const inputFields = document.querySelectorAll(
    'input[type="text"], input[type="search"], input:not([type])'
  );
  inputFields.forEach((field) => {
    maskData(field);
    setupFieldListeners(field);
  });
}

// Apply submission handling to all forms on the page (ended up failling for unknown reason)
function handleFormSubmissions() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputFields = form.querySelectorAll(
        'input[type="text"], input[type="search"], input:not([type])'
      );
      inputFields.forEach((field) => {
        if (field.dataset.originalValue !== undefined) {
          field.value = field.dataset.originalValue;
        }
      });

      form.submit();
    });
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.querySelectorAll) {
        node
          .querySelectorAll(
            'input[type="text"], input[type="search"], input:not([type])'
          )
          .forEach((field) => {
            maskData(field);
            setupFieldListeners(field);
          });
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for toggle message from popup
chrome.runtime.onMessage.addListener((request) => {
  if (request.toggleMasking !== undefined) {
    isMaskingEnabled = request.toggleMasking;
    initializeInputFields();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initializeInputFields();
  handleFormSubmissions();
});
