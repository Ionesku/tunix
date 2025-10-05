// Context Menu System for CDE Desktop
// Handles right-click menus throughout the interface

class ContextMenu {
  constructor() {
    this.menuElement = document.getElementById('context-menu');
    this.currentItems = [];
    
    // Hide menu when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!this.menuElement.contains(e.target)) {
        this.hide();
      }
    });
    
    // Prevent default context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  show(items, x, y) {
    this.currentItems = items;
    this.menuElement.innerHTML = '';
    
    items.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.className = 'context-menu-separator';
        this.menuElement.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-menu-item';
        if (item.disabled) menuItem.classList.add('disabled');
        menuItem.textContent = item.label;
        
        if (!item.disabled && item.action) {
          menuItem.addEventListener('click', () => {
            item.action();
            this.hide();
          });
        }
        
        this.menuElement.appendChild(menuItem);
      }
    });
    
    // Position menu
    this.menuElement.style.left = x + 'px';
    this.menuElement.style.top = y + 'px';
    this.menuElement.classList.remove('hidden');
    
    // Adjust if menu goes off-screen
    setTimeout(() => {
      const rect = this.menuElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight - 52; // 52px for front panel
      
      if (x + rect.width > windowWidth) {
        this.menuElement.style.left = (x - rect.width) + 'px';
      }
      
      if (y + rect.height > windowHeight) {
        this.menuElement.style.top = (y - rect.height) + 'px';
      }
    }, 0);
  }

  hide() {
    this.menuElement.classList.add('hidden');
    this.currentItems = [];
  }
}

// Global context menu instance
const contextMenu = new ContextMenu();

// Desktop context menu
document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');
  
  desktop.addEventListener('contextmenu', (e) => {
    if (e.target === desktop) {
      e.preventDefault();
      
      const rect = desktop.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      contextMenu.show([
        { label: 'New Folder', action: () => {
          GUI.prompt('New Folder', 'Enter folder name:', 'New Folder', (name) => {
            if (name) {
              const result = vfs.createDirectory(vfs.getCurrentPath() + '/' + name);
              if (result.error) GUI.alert('Error', result.error);
            }
          });
        }},
        { label: 'New File', action: () => {
          GUI.prompt('New File', 'Enter file name:', 'newfile.txt', (name) => {
            if (name) {
              const result = vfs.writeFile(vfs.getCurrentPath() + '/' + name, '');
              if (result.error) GUI.alert('Error', result.error);
            }
          });
        }},
        { separator: true },
        { label: 'Refresh', action: () => {
          location.reload();
        }},
        { separator: true },
        { label: 'Display Settings...', action: () => {
          openSettings();
        }},
        { separator: true },
        { label: 'About System...', action: () => {
          if (typeof Apps !== 'undefined' && Apps.about) {
            Apps.about.launch();
          }
        }}
      ], x, y);
    }
  });
  
  // Icon context menus
  document.addEventListener('contextmenu', (e) => {
    const icon = e.target.closest('.desktop-icon');
    if (icon) {
      e.preventDefault();
      e.stopPropagation();
      
      const desktop = document.getElementById('desktop');
      const desktopRect = desktop.getBoundingClientRect();
      const x = e.clientX - desktopRect.left;
      const y = e.clientY - desktopRect.top;
      
      const appName = icon.dataset.app;
      
      contextMenu.show([
        { label: 'Open', action: () => {
          if (typeof Apps !== 'undefined' && Apps[appName]) {
            Apps[appName].launch();
          }
        }},
        { separator: true },
        { label: 'Properties', action: () => {
          GUI.alert('Properties', `Application: ${appName}\n\nThis would show properties in a real system.`);
        }}
      ], x, y);
    }
  });
});

