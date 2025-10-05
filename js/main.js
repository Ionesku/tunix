// Main Application Entry Point for CDE Desktop
// Initializes desktop, front panel, and all system components

'use strict';

// Applications registry
const Apps = {
  terminal: TerminalApp,
  editor: EditorApp,
  files: FilesApp,
  calculator: CalculatorApp,
  clock: ClockApp,
  about: AboutApp
};

// Desktop icon definitions
const desktopIcons = [
  { app: 'terminal', x: 20, y: 20, label: 'Terminal', icon: 'icons/terminal.png' },
  { app: 'editor', x: 20, y: 110, label: 'Text Editor', icon: 'icons/editor.png' },
  { app: 'files', x: 20, y: 200, label: 'File Manager', icon: 'icons/files.png' },
  { app: 'calculator', x: 20, y: 290, label: 'Calculator', icon: 'icons/calculator.png' },
  { app: 'clock', x: 20, y: 380, label: 'Clock', icon: 'icons/clock.png' },
  { app: 'about', x: 20, y: 470, label: 'About', icon: 'icons/about.png' }
];

// Initialize desktop icons
function initDesktopIcons() {
  const desktop = document.getElementById('desktop');
  
  desktopIcons.forEach(({ app, x, y, label, icon }) => {
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.style.left = x + 'px';
    iconEl.style.top = y + 'px';
    iconEl.dataset.app = app;
    
    iconEl.innerHTML = `
      <div class="icon-image">
        <img src="${icon}" alt="${label}">
      </div>
      <div class="icon-label">${label}</div>
    `;
    
    iconEl.addEventListener('dblclick', () => {
      if (Apps[app]) Apps[app].launch();
    });
    
    iconEl.addEventListener('click', (e) => {
      if (!e.ctrlKey) {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      }
      iconEl.classList.toggle('selected');
    });
    
    desktop.appendChild(iconEl);
  });
  
  // Click desktop to deselect all
  desktop.addEventListener('click', (e) => {
    if (e.target === desktop) {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    }
  });
}

// Initialize Front Panel launchers
function initFrontPanel() {
  // Panel button click handlers
  document.getElementById('panel-terminal').addEventListener('click', () => Apps.terminal.launch());
  document.getElementById('panel-files').addEventListener('click', () => Apps.files.launch());
  document.getElementById('panel-editor').addEventListener('click', () => Apps.editor.launch());
  
  // Panel menu button
  const menuBtn = document.getElementById('panel-menu-btn');
  menuBtn.addEventListener('click', (e) => {
    const rect = menuBtn.getBoundingClientRect();
    
    contextMenu.show([
      { label: 'Applications', disabled: true },
      { separator: true },
      { label: 'Terminal', action: () => Apps.terminal.launch() },
      { label: 'Text Editor', action: () => Apps.editor.launch() },
      { label: 'File Manager', action: () => Apps.files.launch() },
      { label: 'Calculator', action: () => Apps.calculator.launch() },
      { label: 'Clock', action: () => Apps.clock.launch() },
      { separator: true },
      { label: 'About System...', action: () => Apps.about.launch() },
      { separator: true },
      { label: 'Display Settings...', action: () => openSettings() },
      { separator: true },
      { label: 'Refresh Desktop', action: () => location.reload() }
    ], rect.left, 0);
  });
  
  // Workspace switcher
  document.querySelectorAll('.workspace-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.workspace-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // In a real implementation, this would switch workspaces
    });
  });
  
  // Clock update
  updatePanelClock();
  setInterval(updatePanelClock, 1000);
}

function updatePanelClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('panel-clock').textContent = `${h}:${m}`;
}

// Settings panel functions
function openSettings() {
  document.getElementById('settings-panel').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settings-panel').classList.add('hidden');
}

function initSettings() {
  // Focus follows mouse
  document.getElementById('setting-focus-follows').addEventListener('change', (e) => {
    wm.setFocusFollowsMouse(e.target.checked);
  });
}


// Keyboard shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Alt+F4 = Close active window
    if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      if (wm.activeWindow) wm.closeWindow(wm.activeWindow);
    }
    
    // Escape = Close settings
    if (e.key === 'Escape') {
      closeSettings();
    }
  });
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c=== CDE Desktop Environment ===', 'font-weight: bold; font-size: 14pt; color: #3A3A6A;');
  console.log('%cWelcome to the Common Desktop Environment simulator!', 'font-size: 10pt;');
  console.log('%cKeyboard Shortcuts:', 'font-weight: bold; margin-top: 8px;');
  console.log('  Ctrl+Alt+T - Open Terminal');
  console.log('  Ctrl+Alt+E - Open Text Editor');
  console.log('  Ctrl+Alt+F - Open File Manager');
  console.log('  Ctrl+Alt+S - Display Settings');
  console.log('  Alt+F4     - Close Active Window');
  console.log('  Right-Click - Context Menu');
  
  initDesktopIcons();
  initFrontPanel();
  initSettings();
  initKeyboardShortcuts();
  
  console.log('%c✓ System initialized successfully', 'color: green; font-weight: bold;');
});

// Make closeSettings available globally (for inline onclick)
window.openSettings = openSettings;
window.closeSettings = closeSettings;

