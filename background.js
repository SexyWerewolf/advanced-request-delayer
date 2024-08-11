function delayRequest(details) {
  return browser.storage.local.get({ enabled: true, rules: [] }).then((data) => {
    if (!data.enabled) {
      return { cancel: false };
    }
    for (let rule of data.rules) {
      if (new RegExp(rule.urlPattern).test(details.url)) {
        let minDelay = rule.minDelayTime;
        let maxDelay = rule.maxDelayTime;
        let randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        console.log(${rule.urlPattern} Pattern Matched, Delaying request to: ${details.url} for ${randomDelay}ms);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(Proceeding request to: ${details.url});
            resolve({ cancel: false });
          }, randomDelay);
        });
      }
    }
    return { cancel: false };
  });
}
browser.webRequest.onBeforeRequest.addListener(
  delayRequest,
  { urls: ["<all_urls>"] },
  ["blocking"]
);
(manifest.json)
{
    "manifest_version": 2,
    "name": "Advanced Request Delayer",
    "version": "1.2",
    "description": "Delays specific requests based on regex rules.",
    "permissions": [
        "webRequest",
        "webRequestBlocking",
        "<all_urls>",
        "storage"
    ],
    "background": {
        "scripts": [
            "background.js"
        ]
    },
    "browser_action": {
        "default_popup": "popup.html",
        "default_icon": {
            "32": "icon.png"
        },
        "default_title": "Advanced Request Delayer"
    },
    "icons": {
        "32": "icon.png"
    }
}
