// File Manager Application (dtfile)
// Browse and manage files in the virtual filesystem

const FilesApp = {
  name: 'File Manager',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAeUlEQVR42u2WMQ6AIAxFKdz/zjIyCxM6SAstLfAn2aR5afulBbTW3gCstQ+AamsPQLX2BaC19gRQrX0BaK09AVRrXwBaa08A1doXgNbaE0C19gWgtfYEUK19AWitPQFUa18AWmtPANXaF4DW2hNAtfYFoLX2BFCtfQOYfAFP+zyME/XFqQAAAABJRU5ErkJggg==',
  
  launch() {
    let currentPath = vfs.getCurrentPath();
    
    wm.createWindow('File Manager - dtfile', 500, 400, (content) => {
      content.style.padding = '0';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      
      // Toolbar
      const toolbar = GUI.createToolbar();
      
      const backBtn = GUI.createButton('◀ Back', () => {
        navigateTo('..');
      });
      
      const homeBtn = GUI.createButton('🏠 Home', () => {
        navigateTo('/home/user');
      });
      
      const refreshBtn = GUI.createButton('↻ Refresh', () => {
        loadDirectory(currentPath);
      });
      
      const newFolderBtn = GUI.createButton('+ Folder', () => {
        GUI.prompt('New Folder', 'Enter folder name:', 'New Folder', (name) => {
          if (name) {
            const result = vfs.createDirectory(currentPath + '/' + name);
            if (result.error) {
              GUI.alert('Error', result.error);
            } else {
              loadDirectory(currentPath);
            }
          }
        });
      });
      
      const newFileBtn = GUI.createButton('+ File', () => {
        GUI.prompt('New File', 'Enter file name:', 'newfile.txt', (name) => {
          if (name) {
            const result = vfs.writeFile(currentPath + '/' + name, '');
            if (result.error) {
              GUI.alert('Error', result.error);
            } else {
              loadDirectory(currentPath);
            }
          }
        });
      });
      
      toolbar.appendChild(backBtn);
      toolbar.appendChild(homeBtn);
      toolbar.appendChild(refreshBtn);
      toolbar.appendChild(newFolderBtn);
      toolbar.appendChild(newFileBtn);
      
      // Path bar
      const pathBar = document.createElement('div');
      pathBar.className = 'motif-panel';
      pathBar.style.cssText = 'padding: 3px 6px; background: #FFF; margin: 0; font-family: "Lucida Console", monospace; font-size: 9pt;';
      
      const updatePathBar = () => {
        pathBar.textContent = `Location: ${currentPath}`;
      };
      
      // File list
      const fileList = GUI.createList();
      fileList.style.flex = '1';
      fileList.style.padding = '6px';
      
      // Status bar
      const statusBar = GUI.createStatusBar('Ready');
      
      // Navigation
      const navigateTo = (path) => {
        const result = vfs.changeDirectory(path);
        if (result.error) {
          GUI.alert('Error', result.error);
          return;
        }
        currentPath = result.path;
        loadDirectory(currentPath);
      };
      
      const loadDirectory = (path) => {
        fileList.innerHTML = '';
        
        const items = vfs.listDirectory(path);
        if (items.error) {
          GUI.alert('Error', items.error);
          return;
        }
        
        updatePathBar();
        statusBar.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
        
        // Add parent directory if not root
        if (path !== '/') {
          const parentItem = createFileItem('..', 'directory');
          parentItem.addEventListener('dblclick', () => navigateTo('..'));
          fileList.appendChild(parentItem);
        }
        
        // Sort: directories first, then files
        const sorted = items.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'directory' ? -1 : 1;
        });
        
        sorted.forEach(item => {
          const fileItem = createFileItem(item.name, item.type);
          
          fileItem.addEventListener('dblclick', () => {
            if (item.type === 'directory') {
              navigateTo(item.name);
            } else {
              // Open file in text editor
              const filePath = currentPath + (currentPath.endsWith('/') ? '' : '/') + item.name;
              EditorApp.launch(filePath);
            }
          });
          
          // Context menu for file items
          fileItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const rect = fileItem.getBoundingClientRect();
            const desktop = document.getElementById('desktop');
            const desktopRect = desktop.getBoundingClientRect();
            
            const menuItems = [
              {
                label: item.type === 'directory' ? 'Open' : 'Edit',
                action: () => {
                  fileItem.dispatchEvent(new Event('dblclick'));
                }
              },
              { separator: true },
              {
                label: 'Delete',
                action: () => {
                  GUI.confirm('Delete', `Delete ${item.name}?`, () => {
                    const result = vfs.deleteFile(item.name);
                    if (result.error) {
                      GUI.alert('Error', result.error);
                    } else {
                      loadDirectory(currentPath);
                    }
                  });
                }
              }
            ];
            
            contextMenu.show(menuItems, rect.left - desktopRect.left, rect.bottom - desktopRect.top);
          });
          
          fileList.appendChild(fileItem);
        });
      };
      
      const createFileItem = (name, type) => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 4px 8px; cursor: pointer; font-size: 10pt; display: flex; align-items: center; gap: 8px;';
        
        const icon = type === 'directory' ? '📁' : '📄';
        const displayName = type === 'directory' ? `${name}/` : name;
        
        item.innerHTML = `<span style="font-size: 14pt;">${icon}</span><span>${displayName}</span>`;
        
        item.addEventListener('mouseenter', () => {
          item.style.background = 'var(--cde-accent-alt)';
          item.style.color = 'var(--cde-text-inv)';
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.background = '';
          item.style.color = '';
        });
        
        return item;
      };
      
      // Build UI
      content.appendChild(toolbar);
      content.appendChild(pathBar);
      content.appendChild(fileList);
      content.appendChild(statusBar);
      
      // Load initial directory
      loadDirectory(currentPath);
    });
  }
};

