// Calculator Application (dtcalc)
// Scientific calculator with memory functions

const CalculatorApp = {
  name: 'Calculator',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAjklEQVR42u2WQQrAIAxEU+h979eFLqRQcEhiZh5kNkL+Z0wRKaX8BzDGvABYa18A1toXgLX2BWCtfQFYa18A1toXgLX2BWCtfQFYa18A1toXgLX2BWCtfQFYa18A1toXgLX2BWCtfQFYa18A1toXgLX2BWCtfQFYa18A1toXgLX2BWCtfQFYa98AVsqfAR/0WFr+Y26jtAAAAABJRU5ErkJggg==',
  
  launch() {
    wm.createWindow('Calculator - dtcalc', 280, 380, (content) => {
      content.style.padding = '8px';
      
      let currentVal = '0';
      let operator = null;
      let prevVal = null;
      let waitingForOperand = false;
      let memory = 0;
      
      // Memory display
      const memoryDisplay = document.createElement('div');
      memoryDisplay.style.cssText = 'font-size: 8pt; height: 12px; margin-bottom: 4px;';
      
      const updateMemoryDisplay = () => {
        memoryDisplay.textContent = memory !== 0 ? `M = ${memory}` : '';
      };
      updateMemoryDisplay();
      
      // Display
      const display = document.createElement('div');
      display.className = 'motif-panel';
      display.style.cssText = 'background: #A0D8A0; padding: 8px 12px; text-align: right; font-size: 18pt; font-family: "Lucida Console", monospace; font-weight: bold; margin-bottom: 8px; min-height: 32px; word-break: break-all;';
      display.textContent = '0';
      
      // Button grid
      const grid = document.createElement('div');
      grid.style.cssText = 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px;';
      
      const buttons = [
        ['MC', 'MR', 'M+', 'M-', '√'],
        ['7', '8', '9', '/', 'CE'],
        ['4', '5', '6', '*', 'C'],
        ['1', '2', '3', '-', '←'],
        ['0', '.', '±', '+', '=']
      ];
      
      const handleInput = (val) => {
        if (val >= '0' && val <= '9') {
          currentVal = waitingForOperand ? val : (currentVal === '0' ? val : currentVal + val);
          waitingForOperand = false;
        } else if (val === '.') {
          if (!currentVal.includes('.')) currentVal += '.';
        } else if (val === 'C') {
          currentVal = '0';
          operator = null;
          prevVal = null;
          waitingForOperand = false;
        } else if (val === 'CE') {
          currentVal = '0';
        } else if (val === '←') {
          currentVal = currentVal.length > 1 ? currentVal.slice(0, -1) : '0';
        } else if (val === '±') {
          currentVal = String(-parseFloat(currentVal));
        } else if (val === '√') {
          const num = parseFloat(currentVal);
          currentVal = num >= 0 ? String(Math.sqrt(num)) : 'Error';
        } else if (val === '=') {
          if (operator && prevVal !== null) {
            const result = calculate(parseFloat(prevVal), parseFloat(currentVal), operator);
            currentVal = String(result);
            operator = null;
            prevVal = null;
            waitingForOperand = true;
          }
        } else if (['+', '-', '*', '/'].includes(val)) {
          if (operator && prevVal !== null && !waitingForOperand) {
            const result = calculate(parseFloat(prevVal), parseFloat(currentVal), operator);
            currentVal = String(result);
          }
          prevVal = currentVal;
          operator = val;
          waitingForOperand = true;
        } else if (val === 'MC') {
          memory = 0;
          updateMemoryDisplay();
        } else if (val === 'MR') {
          currentVal = String(memory);
          waitingForOperand = true;
        } else if (val === 'M+') {
          memory += parseFloat(currentVal);
          updateMemoryDisplay();
        } else if (val === 'M-') {
          memory -= parseFloat(currentVal);
          updateMemoryDisplay();
        }
        
        display.textContent = currentVal;
      };
      
      const calculate = (a, b, op) => {
        switch(op) {
          case '+': return a + b;
          case '-': return a - b;
          case '*': return a * b;
          case '/': return b !== 0 ? a / b : 0;
          default: return b;
        }
      };
      
      buttons.forEach(row => {
        row.forEach(label => {
          const btn = GUI.createButton(label);
          btn.style.cssText = 'padding: 12px 4px; font-size: 11pt; font-weight: bold; margin: 0;';
          btn.addEventListener('click', () => handleInput(label));
          grid.appendChild(btn);
        });
      });
      
      // Keyboard support
      const handleKeyboard = (e) => {
        if (wm.activeWindow !== content.parentElement.id) return;
        
        const key = e.key;
        if (key >= '0' && key <= '9') handleInput(key);
        else if (key === '.') handleInput('.');
        else if (key === '+') handleInput('+');
        else if (key === '-') handleInput('-');
        else if (key === '*') handleInput('*');
        else if (key === '/') { e.preventDefault(); handleInput('/'); }
        else if (key === 'Enter' || key === '=') handleInput('=');
        else if (key === 'Escape') handleInput('C');
        else if (key === 'Backspace') handleInput('←');
      };
      
      document.addEventListener('keydown', handleKeyboard);
      
      content.appendChild(memoryDisplay);
      content.appendChild(display);
      content.appendChild(grid);
    }, { noResize: true });
  }
};

