// GUI Components Library for CDE Desktop
// Provides reusable Motif-style UI components

const GUI = {
  // Create a Motif-style button
  createButton(label, onClick) {
    const btn = document.createElement('button');
    btn.className = 'motif-button';
    btn.textContent = label;
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
  },

  // Create a default button (with thicker border)
  createDefaultButton(label, onClick) {
    const btn = this.createButton(label, onClick);
    btn.classList.add('default');
    return btn;
  },

  // Create an input field
  createInput(value = '', placeholder = '') {
    const input = document.createElement('input');
    input.className = 'motif-input';
    input.type = 'text';
    input.value = value;
    input.placeholder = placeholder;
    return input;
  },

  // Create a textarea
  createTextarea(value = '', rows = 10) {
    const textarea = document.createElement('textarea');
    textarea.className = 'motif-textarea';
    textarea.value = value;
    textarea.rows = rows;
    return textarea;
  },

  // Create a panel (sunken container)
  createPanel() {
    const panel = document.createElement('div');
    panel.className = 'motif-panel';
    return panel;
  },

  // Create a toolbar
  createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'motif-toolbar';
    return toolbar;
  },

  // Create a list container
  createList() {
    const list = document.createElement('div');
    list.className = 'motif-list';
    return list;
  },

  // Create a list item
  createListItem(text, onClick) {
    const item = document.createElement('div');
    item.className = 'motif-list-item';
    item.textContent = text;
    
    if (onClick) item.addEventListener('click', onClick);
    
    return item;
  },

  // Create a menu bar
  createMenuBar() {
    const menuBar = document.createElement('div');
    menuBar.className = 'motif-menubar';
    return menuBar;
  },

  // Create a menu bar item
  createMenuItem(label, items) {
    const menuItem = document.createElement('div');
    menuItem.className = 'motif-menubar-item';
    menuItem.textContent = label;
    
    menuItem.addEventListener('click', (e) => {
      const rect = menuItem.getBoundingClientRect();
      const desktop = document.getElementById('desktop');
      const desktopRect = desktop.getBoundingClientRect();
      contextMenu.show(items, rect.left - desktopRect.left, rect.bottom - desktopRect.top);
    });
    
    return menuItem;
  },

  // Create a status bar
  createStatusBar(text = 'Ready') {
    const statusBar = document.createElement('div');
    statusBar.className = 'motif-statusbar';
    statusBar.textContent = text;
    return statusBar;
  },

  // Create a label
  createLabel(text) {
    const label = document.createElement('label');
    label.style.cssText = 'font-size: 11px;';
    label.textContent = text;
    return label;
  },

  // Create a checkbox
  createCheckbox(label, checked = false, onChange) {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    if (onChange) checkbox.addEventListener('change', onChange);
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = 'font-size: 11px; cursor: pointer;';
    labelEl.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
      if (onChange) onChange({ target: checkbox });
    });
    
    container.appendChild(checkbox);
    container.appendChild(labelEl);
    
    return { container, checkbox };
  },

  // Show an alert dialog
  alert(title, message) {
    const windowId = wm.createWindow(title, 300, 150, (content) => {
      content.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; text-align: center;';
      
      const messageEl = document.createElement('div');
      messageEl.style.cssText = 'margin-bottom: 16px; font-size: 11px;';
      messageEl.textContent = message;
      
      const okBtn = this.createDefaultButton('OK', () => {
        wm.closeWindow(windowId);
      });
      
      content.appendChild(messageEl);
      content.appendChild(okBtn);
    }, { noMinimize: true, noMaximize: true, noResize: true });
  },

  // Show a confirm dialog
  confirm(title, message, onConfirm, onCancel) {
    const windowId = wm.createWindow(title, 320, 150, (content) => {
      content.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; text-align: center;';
      
      const messageEl = document.createElement('div');
      messageEl.style.cssText = 'margin-bottom: 16px; font-size: 11px;';
      messageEl.textContent = message;
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 8px;';
      
      const yesBtn = this.createDefaultButton('Yes', () => {
        wm.closeWindow(windowId);
        if (onConfirm) onConfirm();
      });
      
      const noBtn = this.createButton('No', () => {
        wm.closeWindow(windowId);
        if (onCancel) onCancel();
      });
      
      buttonContainer.appendChild(yesBtn);
      buttonContainer.appendChild(noBtn);
      
      content.appendChild(messageEl);
      content.appendChild(buttonContainer);
    }, { noMinimize: true, noMaximize: true, noResize: true });
  },

  // Show a prompt dialog
  prompt(title, message, defaultValue = '', onSubmit) {
    const windowId = wm.createWindow(title, 350, 170, (content) => {
      content.style.cssText = 'display: flex; flex-direction: column; padding: 16px; gap: 12px;';
      
      const messageEl = document.createElement('div');
      messageEl.style.cssText = 'font-size: 11px;';
      messageEl.textContent = message;
      
      const input = this.createInput(defaultValue);
      input.style.width = '100%';
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end;';
      
      const okBtn = this.createDefaultButton('OK', () => {
        wm.closeWindow(windowId);
        if (onSubmit) onSubmit(input.value);
      });
      
      const cancelBtn = this.createButton('Cancel', () => {
        wm.closeWindow(windowId);
      });
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') okBtn.click();
        if (e.key === 'Escape') cancelBtn.click();
      });
      
      buttonContainer.appendChild(okBtn);
      buttonContainer.appendChild(cancelBtn);
      
      content.appendChild(messageEl);
      content.appendChild(input);
      content.appendChild(buttonContainer);
      
      setTimeout(() => input.focus(), 100);
    }, { noMinimize: true, noMaximize: true, noResize: true });
  }
};

