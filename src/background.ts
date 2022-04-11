
// @ts-ignore
chrome.webRequest.onCompleted.addListener((details) => {
   if (details.initiator === location.origin) { return; }
   fetch(details.url)
      .then((res) => res.text())
      .then(parse)
      .then(sendToOpenedTab)
      .catch(console.error);
}, {
   types: ['xmlhttprequest'],
   urls: ['https://cryptopayoffice.atlassian.net/rest/greenhopper/1.0/xboard/plan/v2/backlog/data?*']
});

function sendToOpenedTab(message: any) {
   send();
   function send() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         if (tabs.length === 0) {
            setTimeout(send, 1000);
            return;
         }
         chrome.tabs.sendMessage(tabs[0].id || 0, message, console.log);
      });
   }
}

function parse(s: string): string {
   const data = JSON.parse(s);
   const issues = Object.fromEntries(data.issues.map((issue: { key: string; }) => [issue.key, issue]));
   return JSON.stringify(issues);
}
