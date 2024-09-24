// ফর্মের ডাটা সেভ করার জন্য
function saveFormData(formName) {
  const inputs = document.querySelectorAll('input, textarea, select');
  const formData = {};

  inputs.forEach(input => {
      formData[input.name] = input.value;
  });

  chrome.storage.local.get('savedForms', (data) => {
      const savedForms = data.savedForms || {};
      if (!savedForms[formName]) {
          savedForms[formName] = [];
      }

      // নতুন ইনপুট অ্যারে আকারে সেভ করা হবে
      savedForms[formName].push(formData);  // একই নামের অধীনে মাল্টিপল ফর্ম সেভ করা হবে

      chrome.storage.local.set({ savedForms }, () => {
          alert(`Form data saved under the name: ${formName}`);
      });
  });
}

// ফর্ম অটোফিল করার জন্য
function autofillForm(formName) {
  chrome.storage.local.get('savedForms', (data) => {
      const savedForms = data.savedForms || {};

      if (savedForms[formName] && savedForms[formName].length > 0) {
          const inputs = document.querySelectorAll('input, textarea, select');

          // সব ফর্মের ডেটা ফিল করা হবে
          savedForms[formName].forEach(formData => {
              inputs.forEach(input => {
                  if (formData[input.name]) {
                      input.value = formData[input.name];
                  }
              });
          });
      } else {
          alert('No form data found for that name.');
      }
  });
}

// মেসেজ লিসেনার (Popup.js থেকে মেসেজ নিয়ে কাজ করা হবে)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'save') {
      saveFormData(request.formName);
  } else if (request.action === 'fill') {
      autofillForm(request.formName);
  }
});
