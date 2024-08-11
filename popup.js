let editingIndex = -1;
function updateRulesList() {
  const rulesList = document.getElementById('rulesList');
  rulesList.innerHTML = '';
  browser.storage.local.get({ rules: [] }).then((data) => {
    data.rules.forEach((rule, index) => {
      const ruleElement = document.createElement('div');
      ruleElement.className = 'rule';
      ruleElement.textContent = `URL Pattern = ${rule.urlPattern}, Min Delay = ${rule.minDelayTime}ms, Max Delay = ${rule.maxDelayTime}ms`;
      const editButton = document.createElement('button');
      editButton.innerHTML = '<i class="fa fa-edit"></i>';
      editButton.onclick = function () {
        document.getElementById('urlPattern').value = rule.urlPattern;
        document.getElementById('minDelayTime').value = rule.minDelayTime;
        document.getElementById('maxDelayTime').value = rule.maxDelayTime;
        document.getElementById('save').style.display = 'none';
        document.getElementById('update').style.display = 'inline';
        editingIndex = index;
      };
      ruleElement.appendChild(editButton);
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
      deleteButton.onclick = function () {
        data.rules.splice(index, 1);
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
        updateRulesList();
        document.getElementById('urlPattern').value = '';
        document.getElementById('minDelayTime').value = '';
        document.getElementById('maxDelayTime').value = '';
      });
    });
  }
});
document.getElementById('update').addEventListener('click', () => {
  const urlPattern = document.getElementById('urlPattern').value.trim();
  const minDelayTime = document.getElementById('minDelayTime').value.trim();
  const maxDelayTime = document.getElementById('maxDelayTime').value.trim();
  if (urlPattern && minDelayTime && maxDelayTime) {
    const updatedRule = {
      urlPattern,
      minDelayTime: parseInt(minDelayTime, 10),
      maxDelayTime: parseInt(maxDelayTime, 10)
    };
    browser.storage.local.get({ rules: [] }).then((data) => {
      data.rules[editingIndex] = updatedRule;
      browser.storage.local.set({ rules: data.rules }).then(() => {
        updateRulesList();
        document.getElementById('urlPattern').value = '';
        document.getElementById('minDelayTime').value = '';
        document.getElementById('maxDelayTime').value = '';
        document.getElementById('save').style.display = 'inline';
        document.getElementById('update').style.display = 'none';
        editingIndex = -1;
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
