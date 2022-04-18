window.addEventListener('load', () => {
   getRapidView()
      .then(makeRequest)
      .then(parseResponse)
      .then(updateIssues)
      .catch(console.error);
});

function getRapidView(): Promise<string> {
   return new Promise((resolve, reject) => {
      try {
         const rapidViewId = localStorage.getItem('gh.latestRapidViewId');
         if (!rapidViewId) { return reject(new Error('No rapidViewId')); }
         resolve(rapidViewId);
      } catch (e) {
         reject(e);
      }
   });
}

function makeRequest(rapidViewId: string): Promise<string> {
   return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
         if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            resolve(xhr.responseText);
         }
      };
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.open('GET',
         `/rest/greenhopper/1.0/xboard/plan/v2/backlog/data?rapidViewId=${rapidViewId}&forceConsistency=true`);
      xhr.send();
   });
}

function parseResponse(s: string): Issues {
   const data = JSON.parse(s);
   const issues = Object.fromEntries(data.issues.map((issue: { key: string; }) => [issue.key, issue]));
   return issues;
}

function updateIssues(issues: Issues) {
   const containters = Array.from(document.querySelectorAll<HTMLDivElement>('.ghx-issues'));
   containters.forEach((containter) => {
      const totalTime: Record<string, number> = {};

      Array.from(containter.children).forEach((el) => {
         const c = el.querySelector('span.ghx-items-container');
         const id = el.getAttribute('data-issue-key');
         if (!c || !id) { return; }
         const trackingStatistic = document.createElement('span');
         const time = issues[id].trackingStatistic.statFieldValue.text;
         trackingStatistic.innerText = time;
         c.insertBefore(trackingStatistic, c.firstChild);

         const name = issues[id].assigneeName || 'Unassigned';
         totalTime[name] = Math.round((totalTime[name] || 0 + parseFloat(time || '0')) * 100) / 100;
      });

      const pie = document.createElement('a');
      const data = document.createElement('pre');
      containter.insertBefore(data, pie);
      pie.innerText = '📊';
      pie.onclick = () => {
         data.innerText = JSON.stringify(totalTime, null, 2);
      };
      containter.insertBefore(pie, containter.firstChild);
      console.info(totalTime);
   });
}

type Issues = Record<string, {
   assigneeName: string;
   trackingStatistic: { statFieldValue: { text: string; }; };
}>;