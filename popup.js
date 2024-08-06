function updateRulesList() {
  const rulesList = document.getElementById('rulesList');
  rulesList.innerHTML = '';
  browser.storage.local.get({ rules: [] }).then((data) => {
    data.rules.forEach((rule, index) => {
      const ruleElement = document.createElement('div');
      ruleElement.className = 'rule';
      ruleElement.textContent = `URL Pattern = ${rule.urlPattern}, Min Delay = ${rule.minDelayTime}ms, Max Delay = ${rule.maxDelayTime}ms `;
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
      deleteButton.onclick = function () {
        data.rules.splice(index, 1); // Remove the rule
        browser.storage.local.set({ rules: data.rules }).then(updateRulesList);
      };
      ruleElement.appendChild(deleteButton);
      rulesList.appendChild(ruleElement);
    });
  });
}
document.getElementById('save').addEventListener('click', () => {
  const urlPattern = document.getElementById('urlPattern').value.trim();
  const minDelayTime = document.getElementById('minDelayTime').value.trim();
  const maxDelayTime = document.getElementById('maxDelayTime').value.trim();
  if (urlPattern && minDelayTime && maxDelayTime) {
    const newRule = {
      urlPattern,
      minDelayTime: parseInt(minDelayTime, 10),
      maxDelayTime: parseInt(maxDelayTime, 10)
    };
    browser.storage.local.get({ rules: [] }).then((data) => {
      data.rules.push(newRule);
      browser.storage.local.set({ rules: data.rules }).then(() => {
        updateRulesList(); // Refresh the list
        document.getElementById('urlPattern').value = ''; // Reset input fields
        document.getElementById('minDelayTime').value = '';
        document.getElementById('maxDelayTime').value = '';
      });
    });
  }
});
const toggle = document.getElementById('toggle');
toggle.addEventListener('change', () => {
  const isEnabled = toggle.checked;
  browser.storage.local.set({ enabled: isEnabled });
});
browser.storage.local.get({ enabled: true }).then((data) => {
  toggle.checked = data.enabled;
});
updateRulesList();
