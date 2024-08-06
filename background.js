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
        console.log(`${rule.urlPattern} Pattern Matched, Delaying request to: ${details.url} for ${randomDelay}ms`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`Proceeding request to: ${details.url}`);
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
