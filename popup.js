document.addEventListener('DOMContentLoaded', () => {
  loadFormNames();
});

// ফর্মের নাম ড্রপডাউন থেকে লোড করা
function loadFormNames(selectedForm = null) {
  chrome.storage.local.get('savedForms', (data) => {
      const savedForms = data.savedForms || {};
      const dropdown = document.getElementById('formNamesDropdown');
      dropdown.innerHTML = '';

      // ডিফল্ট অপশন
      const defaultOption = document.createElement('option');
      defaultOption.value = 'unfilled';
      defaultOption.textContent = 'unfilled';
      dropdown.appendChild(defaultOption);

      Object.keys(savedForms).forEach(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          dropdown.appendChild(option);
      });

      // ফর্ম যদি সিলেক্ট করা হয় তাহলে সেটি উপরে দেখানো হবে
      if (selectedForm) {
          dropdown.value = selectedForm;
          const selectedOption = dropdown.querySelector(`option[value="${selectedForm}"]`);
          dropdown.insertBefore(selectedOption, dropdown.firstChild);
      } else {
          dropdown.value = 'unfilled';
      }
  });
}

// নতুন ফর্ম সেভ করা
document.getElementById('addNew').addEventListener('click', () => {
  const newName = prompt("Enter a new form name:");
  if (newName) {
      saveFormName(newName);
  }
});

// ফর্ম সেভ করার জন্য
document.getElementById('saveForm').addEventListener('click', () => {
  const selectedFormName = document.getElementById('formNamesDropdown').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'save', formName: selectedFormName });
      loadFormNames(selectedFormName);  // ফর্মটি সেভ করে উপরে দেখানো হবে
  });
});

// ফর্ম অটোফিল করার জন্য
document.getElementById('fillForm').addEventListener('click', () => {
  const selectedFormName = document.getElementById('formNamesDropdown').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'fill', formName: selectedFormName });
      loadFormNames(selectedFormName);  // ফর্মটি উপরে দেখানো হবে
  });
});

// নতুন ফর্মের নাম সেভ করার জন্য
function saveFormName(name) {
  chrome.storage.local.get('savedForms', (data) => {
      const savedForms = data.savedForms || {};
      if (!savedForms[name]) {
          savedForms[name] = [];  // নতুন ফর্ম অ্যারে আকারে সেভ করা হবে
      }
      chrome.storage.local.set({ savedForms }, () => {
          loadFormNames(name); // ড্রপডাউন রিফ্রেশ করা হবে
      });
  });
}
