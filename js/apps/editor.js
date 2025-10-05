// Text Editor Application (dtpad)
// Simple text editor for viewing and editing files

const EditorApp = {
  name: 'Text Editor',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAf0lEQVR42u3WwQnAIBBE0Yn3zkYs0VpsxRLswxLswxI2FyEQNO7qQQbmJMAH/0gEaK1dAKy1HoBa6wWgWusJoFp7AVCtfQBQax8AtfYBUK19AFBrHwDV2gdAtfYBUK09AKi1B4Bq7QFQrT0AVGsPgGrtAVCtvQNU698C+ACjjTNpXvGWIgAAAABJRU5ErkJggg==',
  
  launch(filePath = null) {
    let currentFile = filePath;
    let modified = false;
    
    const windowTitle = currentFile ? `Text Editor - ${currentFile.split('/').pop()}` : 'Text Editor - dtpad';
    
    wm.createWindow(windowTitle, 550, 450, (content, windowId) => {
      content.style.padding = '0';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      
      // Text area (создаём раньше чтобы можно было использовать в функциях)
      const textarea = GUI.createTextarea('', 20);
      textarea.style.cssText = 'flex: 1; resize: none; border: none; font-family: "Lucida Console", monospace; font-size: 10pt; padding: 6px;';
      
      // Вспомогательные функции
      const updateTitle = () => {
        const fileName = currentFile ? currentFile.split('/').pop() : 'Untitled';
        const modifiedMark = modified ? ' *' : '';
        const titlebar = content.parentElement.querySelector('.window-title');
        if (titlebar) {
          titlebar.textContent = `Text Editor - ${fileName}${modifiedMark}`;
        }
      };
      
      const save = () => {
        if (!currentFile) {
          saveAs();
          return;
        }
        
        const result = vfs.writeFile(currentFile, textarea.value);
        if (result.error) {
          GUI.alert('Error', result.error);
        } else {
          modified = false;
          updateTitle();
          statusBar.textContent = 'File saved';
          setTimeout(() => statusBar.textContent = 'Ready', 2000);
        }
      };
      
      const saveAs = () => {
        GUI.prompt('Save As', 'Enter file path:', currentFile || 'newfile.txt', (path) => {
          if (path) {
            currentFile = path;
            save();
          }
        });
      };
      
      // Menu bar
      const menuBar = GUI.createMenuBar();
      
      const fileMenu = GUI.createMenuItem('File', [
        {
          label: 'New',
          action: () => {
            if (modified) {
              GUI.confirm('Unsaved Changes', 'Discard changes?', () => {
                textarea.value = '';
                currentFile = null;
                modified = false;
                updateTitle();
              });
            } else {
              textarea.value = '';
              currentFile = null;
              modified = false;
              updateTitle();
            }
          }
        },
        {
          label: 'Open...',
          action: () => {
            GUI.prompt('Open File', 'Enter file path:', currentFile || '', (path) => {
              if (path) {
                const result = vfs.readFile(path);
                if (result.error) {
                  GUI.alert('Error', result.error);
                } else {
                  textarea.value = result.content;
                  currentFile = path;
                  modified = false;
                  updateTitle();
                }
              }
            });
          }
        },
        {
          label: 'Save',
          action: () => {
            if (!currentFile) {
              saveAs();
            } else {
              save();
            }
          }
        },
        {
          label: 'Save As...',
          action: saveAs
        },
        { separator: true },
        {
          label: 'Close',
          action: () => {
            if (modified) {
              GUI.confirm('Unsaved Changes', 'Save before closing?', () => {
                save();
                wm.closeWindow(windowId);
              }, () => {
                wm.closeWindow(windowId);
              });
            } else {
              wm.closeWindow(windowId);
            }
          }
        }
      ]);
      
      const editMenu = GUI.createMenuItem('Edit', [
        { label: 'Cut', action: () => document.execCommand('cut') },
        { label: 'Copy', action: () => document.execCommand('copy') },
        { label: 'Paste', action: () => document.execCommand('paste') },
        { separator: true },
        { label: 'Select All', action: () => textarea.select() }
      ]);
      
      const helpMenu = GUI.createMenuItem('Help', [
        {
          label: 'About dtpad',
          action: () => {
            GUI.alert('About dtpad', 'CDE Text Editor\nVersion 1.0\n\nSimple text editor for CDE Desktop Environment.');
          }
        }
      ]);
      
      menuBar.appendChild(fileMenu);
      menuBar.appendChild(editMenu);
      menuBar.appendChild(helpMenu);
      
      textarea.addEventListener('input', () => {
        if (!modified) {
          modified = true;
          updateTitle();
        }
      });
      
      // Status bar
      const statusBar = GUI.createStatusBar('Ready');
      
      // Build UI
      content.appendChild(menuBar);
      content.appendChild(textarea);
      content.appendChild(statusBar);
      
      // Load file if specified
      if (filePath) {
        const result = vfs.readFile(filePath);
        if (result.error) {
          GUI.alert('Error', result.error);
        } else {
          textarea.value = result.content;
        }
      }
      
      setTimeout(() => textarea.focus(), 100);
    });
  }
};

