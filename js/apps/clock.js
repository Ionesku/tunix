// Clock Application (dtclock)
// Displays current time and date

const ClockApp = {
  name: 'Clock',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVR42u2WMQ6DMAxFHXH/O3dhYEBiQMQkTvJe1aWq+rQx+UkC0lr7D2CtfQCstQ+AtfYBsNY+ANbaB8Ba+wBYax8Aa+0DYK19AKy1D4C19gGw1j4A1toHwFr7AFhrHwBr7QNgrX0ArLUPgLX2AbDWPgDW2gfAWvsAWGsfAGvtA2CtfQCstQ+AtfYBsNY+ANbaB8Ba+wBYax8Aa+0DYK19AKy1D4C19gGw1j4A1toHwFr7AFhrHwBr7QNgrX0ArLUPgLX2AbDWPgBr7SdgA4GcVLdS2qELAAAAAElFTkSuQmCC',
  
  launch() {
    wm.createWindow('Clock - dtclock', 300, 220, (content) => {
      content.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px;';
      
      const clockDisplay = document.createElement('div');
      clockDisplay.style.cssText = 'text-align: center; font-family: "Lucida Console", monospace;';
      
      const timeDisplay = document.createElement('div');
      timeDisplay.style.cssText = 'font-size: 36pt; font-weight: bold; margin-bottom: 12px;';
      
      const dateDisplay = document.createElement('div');
      dateDisplay.style.cssText = 'font-size: 12pt;';
      
      const dayDisplay = document.createElement('div');
      dayDisplay.style.cssText = 'font-size: 10pt; color: var(--cde-text-disabled); margin-top: 8px;';
      
      const updateClock = () => {
        const now = new Date();
        
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        timeDisplay.textContent = `${h}:${m}:${s}`;
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        dayDisplay.textContent = days[now.getDay()];
      };
      
      updateClock();
      const interval = setInterval(updateClock, 1000);
      
      // Cleanup interval when window closes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === content.parentElement) {
              clearInterval(interval);
              observer.disconnect();
            }
          });
        });
      });
      
      observer.observe(document.getElementById('desktop'), {
        childList: true
      });
      
      clockDisplay.appendChild(timeDisplay);
      clockDisplay.appendChild(dateDisplay);
      clockDisplay.appendChild(dayDisplay);
      content.appendChild(clockDisplay);
    }, { noResize: true });
  }
};

