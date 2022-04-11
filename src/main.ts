chrome.runtime.onMessage.addListener((issues, _sender, sendResponse) => {
   updateIssues(JSON.parse(issues));
});

function updateIssues(issues: Record<string, { trackingStatistic: { statFieldValue: { text: string; }; }; }>) {
   const containter = document.querySelector('.ghx-issues');
   if (!containter) { return; }

   Array.from(containter.children).forEach((el) => {
      const c = el.querySelector('span.ghx-items-container');
      const id = el.getAttribute('data-issue-key');
      if (!c || !id) { return; }
      const trackingStatistic = document.createElement('span');
      trackingStatistic.innerText = issues[id].trackingStatistic.statFieldValue.text;
      c.insertBefore(trackingStatistic, c.firstChild);
   });
}