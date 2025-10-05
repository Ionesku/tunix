// Window Manager for CDE Desktop Environment
// Handles window creation, positioning, focus, and lifecycle

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.windowCounter = 0;
    this.zIndex = 1;
    this.activeWindow = null;
    this.focusFollowsMouse = false;
  }

  createWindow(title, width, height, contentBuilder, options = {}) {
    this.windowCounter++;
    const windowId = `win-${this.windowCounter}`;
    
    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;
    win.style.width = width + 'px';
    win.style.height = height + 'px';
    
    // Smart positioning
    const offset = ((this.windowCounter - 1) * 20) % 200;
    win.style.left = (100 + offset) + 'px';
    win.style.top = (60 + offset) + 'px';
    
    // Titlebar
    const titlebar = this.createTitlebar(title, windowId, options);
    win.appendChild(titlebar);
    
    // Content area
    const content = document.createElement('div');
    content.className = 'window-content';
    win.appendChild(content);
    
    // Resize handle
    if (!options.noResize) {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'window-resize';
      win.appendChild(resizeHandle);
      this.makeResizable(win, resizeHandle);
    }
    
    // Add to desktop
    document.getElementById('desktop').appendChild(win);
    
    // Build content
    if (contentBuilder) contentBuilder(content, windowId);
    
    // Setup interactions
    this.makeDraggable(win, titlebar);
    this.setupFocus(win, windowId);
    
    // Add to taskbar
    this.addTaskbarItem(windowId, title);
    
    // Store window data
    this.windows.set(windowId, {
      element: win,
      title: title,
      minimized: false,
      options: options
    });
    
    this.focusWindow(windowId);
    
    return windowId;
  }

  createTitlebar(title, windowId, options) {
    const titlebar = document.createElement('div');
    titlebar.className = 'window-titlebar';
    
    // System menu icon
    const sysmenu = document.createElement('div');
    sysmenu.className = 'window-sysmenu';
    sysmenu.addEventListener('dblclick', () => this.closeWindow(windowId));
    sysmenu.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showWindowMenu(windowId, sysmenu);
    });
    
    // Title text
    const titleText = document.createElement('div');
    titleText.className = 'window-title';
    titleText.textContent = title;
    
    // Buttons
    const buttons = document.createElement('div');
    buttons.className = 'window-buttons';
    
    if (!options.noMinimize) {
      const minBtn = document.createElement('div');
      minBtn.className = 'window-button';
      minBtn.textContent = '_';
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(windowId);
      });
      buttons.appendChild(minBtn);
    }
    
    if (!options.noMaximize) {
      const maxBtn = document.createElement('div');
      maxBtn.className = 'window-button';
      maxBtn.textContent = '□';
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.maximizeWindow(windowId);
      });
      buttons.appendChild(maxBtn);
    }
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'window-button';
    closeBtn.textContent = 'X';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeWindow(windowId);
    });
    buttons.appendChild(closeBtn);
    
    titlebar.appendChild(sysmenu);
    titlebar.appendChild(titleText);
    titlebar.appendChild(buttons);
    
    return titlebar;
  }

  setupFocus(win, windowId) {
    win.addEventListener('mousedown', (e) => {
      // Focus window on any click within it
      this.focusWindow(windowId);
      e.stopPropagation();
    });
    
    if (this.focusFollowsMouse) {
      win.addEventListener('mouseenter', () => this.focusWindow(windowId));
    }
  }

  focusWindow(windowId) {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
    
    const winData = this.windows.get(windowId);
    if (!winData) return;
    
    winData.element.classList.add('active');
    winData.element.style.zIndex = ++this.zIndex;
    this.activeWindow = windowId;
    
    this.updateTaskbar();
  }

  closeWindow(windowId) {
    const winData = this.windows.get(windowId);
    if (!winData) return;
    
    winData.element.remove();
    this.windows.delete(windowId);
    this.removeTaskbarItem(windowId);
    
    if (this.activeWindow === windowId) {
      this.activeWindow = null;
    }
  }

  minimizeWindow(windowId) {
    const winData = this.windows.get(windowId);
    if (!winData) return;
    
    winData.element.style.display = 'none';
    winData.minimized = true;
    this.updateTaskbar();
  }

  restoreWindow(windowId) {
    const winData = this.windows.get(windowId);
    if (!winData) return;
    
    winData.element.style.display = 'flex';
    winData.minimized = false;
    this.focusWindow(windowId);
  }

  maximizeWindow(windowId) {
    const winData = this.windows.get(windowId);
    if (!winData) return;
    
    const win = winData.element;
    
    if (win.dataset.maximized === 'true') {
      // Restore
      win.style.width = win.dataset.oldW;
      win.style.height = win.dataset.oldH;
      win.style.left = win.dataset.oldL;
      win.style.top = win.dataset.oldT;
      win.dataset.maximized = 'false';
    } else {
      // Maximize
      win.dataset.oldW = win.style.width;
      win.dataset.oldH = win.style.height;
      win.dataset.oldL = win.style.left;
      win.dataset.oldT = win.style.top;
      win.style.left = '0';
      win.style.top = '0';
      win.style.width = window.innerWidth + 'px';
      win.style.height = (window.innerHeight - 52) + 'px';
      win.dataset.maximized = 'true';
    }
  }

  makeDraggable(win, handle) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    
    handle.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('window-button')) return;
      if (e.target.classList.contains('window-sysmenu')) return;
      
      isDragging = true;
      initialLeft = parseInt(win.style.left) || 0;
      initialTop = parseInt(win.style.top) || 0;
      startX = e.clientX;
      startY = e.clientY;
      
      e.preventDefault();
    });
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;
      
      // Keep window within bounds
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 52 - 30; // 52px for front panel
      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newTop = Math.max(0, Math.min(newTop, maxY));
      
      win.style.left = newLeft + 'px';
      win.style.top = newTop + 'px';
    };
    
    const onMouseUp = () => {
      isDragging = false;
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  makeResizable(win, handle) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(getComputedStyle(win).width);
      startHeight = parseInt(getComputedStyle(win).height);
      e.preventDefault();
      e.stopPropagation();
    });
    
    const onMouseMove = (e) => {
      if (!isResizing) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      const newW = Math.max(200, startWidth + dx);
      const newH = Math.max(150, startHeight + dy);
      
      win.style.width = newW + 'px';
      win.style.height = newH + 'px';
    };
    
    const onMouseUp = () => {
      isResizing = false;
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  showWindowMenu(windowId, element) {
    const items = [
      { label: 'Restore', action: () => this.restoreWindow(windowId) },
      { label: 'Move', action: () => {} },
      { label: 'Size', action: () => {} },
      { label: 'Minimize', action: () => this.minimizeWindow(windowId) },
      { label: 'Maximize', action: () => this.maximizeWindow(windowId) },
      { separator: true },
      { label: 'Close', action: () => this.closeWindow(windowId) }
    ];
    
    const rect = element.getBoundingClientRect();
    const desktop = document.getElementById('desktop');
    const desktopRect = desktop.getBoundingClientRect();
    contextMenu.show(items, rect.left - desktopRect.left, rect.bottom - desktopRect.top);
  }

  addTaskbarItem(windowId, title) {
    const taskbar = document.getElementById('panel-taskbar');
    const item = document.createElement('div');
    item.className = 'taskbar-item';
    item.id = `taskbar-${windowId}`;
    item.textContent = title;
    
    item.addEventListener('click', () => {
      const winData = this.windows.get(windowId);
      if (winData.minimized) {
        this.restoreWindow(windowId);
      } else if (this.activeWindow === windowId) {
        this.minimizeWindow(windowId);
      } else {
        this.focusWindow(windowId);
      }
    });
    
    taskbar.appendChild(item);
    this.updateTaskbar();
  }

  removeTaskbarItem(windowId) {
    const item = document.getElementById(`taskbar-${windowId}`);
    if (item) item.remove();
  }

  updateTaskbar() {
    document.querySelectorAll('.taskbar-item').forEach(item => {
      item.classList.remove('active');
      const windowId = item.id.replace('taskbar-', '');
      const winData = this.windows.get(windowId);
      
      if (winData && !winData.minimized && this.activeWindow === windowId) {
        item.classList.add('active');
      }
    });
  }

  setFocusFollowsMouse(enabled) {
    this.focusFollowsMouse = enabled;
  }
}

// Global window manager instance
const wm = new WindowManager();

