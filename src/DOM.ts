export class TimeStatistics {
   constructor(root: HTMLDivElement, private totalTime: Record<string, number>) {
      const container= document.createElement('div')
      const data = document.createElement('div');
      data.innerHTML = this.getDataMarkup();
      data.hidden = true;
      const pie = document.createElement('a');
      pie.innerText = '📊';
      pie.onclick = () => {
         data.hidden = !data.hidden;
      };
      container.append(pie, data);
      root.insertBefore(container, root.firstChild)
   }

   private getDataMarkup():string{
      return `<ul>${Object.entries(this.totalTime).map(([name, time]) => `<li>${name} - ${time}d</li>`).join('')}</ul>`
   }
}