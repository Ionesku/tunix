// Main Application Entry Point for CDE Desktop
// Initializes desktop, front panel, and all system components

'use strict';

// --- ICONS WILL BE LOCAL FILES ---

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
  { app: 'terminal', x: 10, y: 10, label: 'Terminal' },
  { app: 'editor', x: 10, y: 90, label: 'Text Editor' },
  { app: 'files', x: 10, y: 170, label: 'File Manager' },
  { app: 'calculator', x: 10, y: 250, label: 'Calculator' },
  { app: 'clock', x: 10, y: 330, label: 'Clock' },
  { app: 'about', x: 10, y: 410, label: 'About' }
];

// Initialize desktop icons
function initDesktopIcons() {
  const desktop = document.getElementById('desktop');
  
  desktopIcons.forEach(({ app, x, y, label }) => {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.style.left = x + 'px';
    icon.style.top = y + 'px';
    icon.dataset.app = app;
    
    // SVG icons for each app
    const icons = {
      terminal: '<svg width="32" height="32" fill="currentColor"><rect x="4" y="4" width="24" height="20" fill="#000" stroke="#0F0"/><text x="6" y="16" fill="#0F0" font-size="10">$_</text></svg>',
      editor: '<svg width="32" height="32" fill="currentColor"><rect x="6" y="4" width="20" height="24" fill="#FFF" stroke="#000"/><line x1="9" y1="9" x2="23" y2="9" stroke="#000"/><line x1="9" y1="13" x2="23" y2="13" stroke="#000"/><line x1="9" y1="17" x2="19" y2="17" stroke="#000"/></svg>',
      files: '<svg width="32" height="32" fill="currentColor"><path d="M8 8 L12 8 L14 6 L24 6 L24 24 L8 24 Z" fill="#D4B830" stroke="#000"/><rect x="8" y="10" width="16" height="14" fill="#E8D060"/></svg>',
      calculator: '<svg width="32" height="32" fill="currentColor"><rect x="6" y="4" width="20" height="24" fill="#C0C0C0" stroke="#000"/><rect x="8" y="6" width="16" height="5" fill="#A0D8A0" stroke="#000"/><rect x="8" y="13" width="4" height="4" fill="#808080"/><rect x="14" y="13" width="4" height="4" fill="#808080"/><rect x="20" y="13" width="4" height="4" fill="#808080"/></svg>',
      clock: '<svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="14" fill="#FFF" stroke="#000" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="#000"/><line x1="16" y1="16" x2="16" y2="6" stroke="#000" stroke-width="2"/><line x1="16" y1="16" x2="22" y2="16" stroke="#000"/></svg>',
      about: '<svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="14" fill="#4A7C9E" stroke="#000" stroke-width="2"/><text x="12" y="22" fill="#FFF" font-size="18" font-weight="bold">i</text></svg>'
    };
    
    icon.innerHTML = `
      <div class="icon-image">
        ${icons[app] || icons.about}
      </div>
      <div class="icon-label">${label}</div>
    `;
    
    icon.addEventListener('dblclick', () => {
      if (Apps[app]) Apps[app].launch();
    });
    
    icon.addEventListener('click', (e) => {
      if (!e.ctrlKey) {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      }
      icon.classList.toggle('selected');
    });
    
    desktop.appendChild(icon);
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
  const launchers = document.getElementById('panel-launchers');
  
  const launcherApps = ['terminal', 'files', 'editor', 'calculator'];
  
  launcherApps.forEach(appName => {
    const app = Apps[appName];
    if (!app) return;
    
    const btn = document.createElement('div');
    btn.className = 'panel-btn';
    
    // SVG icons for panel
    const panelIcons = {
      terminal: '<svg width="24" height="24" fill="#000"><rect x="2" y="4" width="20" height="16" fill="#000" stroke="#0F0"/><text x="4" y="14" fill="#0F0" font-size="8">$_</text></svg>',
      files: '<svg width="24" height="24" fill="#000"><path d="M4 6 L8 6 L10 4 L20 4 L20 20 L4 20 Z" fill="#D4B830" stroke="#000"/></svg>',
      editor: '<svg width="24" height="24" fill="#000"><rect x="4" y="2" width="16" height="20" fill="#FFF" stroke="#000"/><line x1="6" y1="6" x2="18" y2="6" stroke="#000"/><line x1="6" y1="10" x2="18" y2="10" stroke="#000"/></svg>',
      calculator: '<svg width="24" height="24" fill="#000"><rect x="4" y="2" width="16" height="20" fill="#C0C0C0" stroke="#000"/><rect x="6" y="4" width="12" height="4" fill="#A0D8A0"/></svg>'
    };
    
    btn.innerHTML = panelIcons[appName] || '';
    btn.addEventListener('click', () => app.launch());
    launchers.appendChild(btn);
  });
  
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
  setInterval(updatePanelClock, 5000);
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

