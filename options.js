document.addEventListener('DOMContentLoaded', () => {
    loadFormNames();
});

function loadFormNames() {
    chrome.storage.local.get('savedForms', (data) => {
        const formNames = Object.keys(data.savedForms || {});
        const dropdown = document.getElementById('formNamesDropdown');
        dropdown.innerHTML = '';

        formNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });
    });
}

document.getElementById('deleteForm').addEventListener('click', () => {
    const selectedFormName = document.getElementById('formNamesDropdown').value;
    chrome.storage.local.get('savedForms', (data) => {
        const savedForms = data.savedForms || {};
        delete savedForms[selectedFormName];

        chrome.storage.local.set({ savedForms }, () => {
            alert(`Form data for ${selectedFormName} deleted.`);
            loadFormNames();
        });
    });
});

document.getElementById('exportData').addEventListener('click', () => {
    chrome.storage.local.get('savedForms', (data) => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form_data.json';
        a.click();
    });
});

document.getElementById('importData').addEventListener('click', () => {
    const file = document.getElementById('importFile').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const importedData = JSON.parse(e.target.result);
            chrome.storage.local.set({ savedForms: importedData.savedForms }, () => {
                alert('Form data imported successfully.');
                loadFormNames();
            });
        };
        reader.readAsText(file);
    }
});
