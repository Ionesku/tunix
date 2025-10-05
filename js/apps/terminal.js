// Terminal Application (dtterm)
// Unix-style terminal emulator with command support

const TerminalApp = {
  name: 'Terminal',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAmklEQVR42u2WQQ6AIAwEsf//6Xox8SAJbWkLxIPOhYTsZAqFGvkfAgwCDHoDanXW1UwBWi0XoFVzAVrVDaDVdAFa3Q2gVdoAtHobQKu5AbTaG0CrtQG0ihtAq7YBtDobQKu2AbQaG0CrtwG0OhtAq7YBtDobQKu2AbQaG0Crtwm0GhtAq7MBtGobQKuxAbR6G0CrswG0ahtAK/8geAEfKB84MYT3pQAAAABJRU5ErkJggg==',
  
  launch() {
    const windowId = wm.createWindow('Terminal - dtterm', 600, 400, (content) => {
      content.className = 'terminal-content';
      content.innerHTML = '';
      
      const history = [];
      let historyIdx = -1;
      
      // Input line (создаём сначала, чтобы можно было использовать в addLine)
      const inputLine = document.createElement('div');
      inputLine.className = 'terminal-input-line';
      
      const addLine = (text, isError = false) => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (isError) line.style.color = '#FF4444';
        line.textContent = text;
        content.insertBefore(line, inputLine);
        content.scrollTop = content.scrollHeight;
      };
      
      // Welcome message
      addLine('CDE Terminal Emulator - dtterm');
      addLine('UNIX System V Release 4.0 (CDE-Simulator)');
      addLine(`Connected to ${vfs.getCurrentPath()}`);
      addLine('');
      addLine('Type "help" for available commands.');
      addLine('');
      
      const prompt = document.createElement('span');
      prompt.className = 'terminal-prompt';
      
      const updatePrompt = () => {
        prompt.textContent = `user@cde:${vfs.getCurrentPath()}$ `;
      };
      updatePrompt();
      
      const input = document.createElement('input');
      input.type = 'text';
      input.autocomplete = 'off';
      
      inputLine.appendChild(prompt);
      inputLine.appendChild(input);
      content.appendChild(inputLine);
      
      input.focus();
      content.addEventListener('click', () => input.focus());
      
      // Command execution
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = input.value.trim();
          if (cmd) {
            history.push(cmd);
            historyIdx = history.length;
          }
          
          addLine(prompt.textContent + cmd);
          
          if (cmd) {
            const output = this.executeCommand(cmd);
            if (output.error) addLine(output.error, true);
            else if (output.text) output.text.split('\n').forEach(l => addLine(l));
            if (output.clear) {
              content.querySelectorAll('.terminal-line').forEach(l => l.remove());
            }
          }
          
          updatePrompt();
          input.value = '';
          content.scrollTop = content.scrollHeight;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIdx > 0) input.value = history[--historyIdx];
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIdx < history.length - 1) input.value = history[++historyIdx];
          else { historyIdx = history.length; input.value = ''; }
        }
      });
    });
    
    return windowId;
  },
  
  executeCommand(cmdLine) {
    const parts = cmdLine.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    const commands = {
      help: () => ({
        text: 'Available commands:\n' +
              '  help              Show this help message\n' +
              '  ls [path]         List directory contents\n' +
              '  cd <path>         Change directory\n' +
              '  pwd               Print working directory\n' +
              '  cat <file>        Display file contents\n' +
              '  echo <text>       Echo text to terminal\n' +
              '  clear             Clear screen\n' +
              '  date              Show current date and time\n' +
              '  whoami            Show current user\n' +
              '  uname [-a]        Show system information\n' +
              '  mkdir <dir>       Create directory\n' +
              '  touch <file>      Create empty file\n' +
              '  rm <file>         Remove file\n' +
              '  env               Show environment variables'
      }),
      
      ls: () => {
        const path = args[0] || '.';
        const result = vfs.listDirectory(path);
        
        if (result.error) {
          return { error: `ls: ${result.error}` };
        }
        
        if (result.length === 0) {
          return { text: '' };
        }
        
        const formatted = result.map(item => {
          const prefix = item.type === 'directory' ? 'd' : '-';
          const perms = `${prefix}rwxr-xr-x`;
          const size = item.size || 0;
          const name = item.type === 'directory' ? `${item.name}/` : item.name;
          return `${perms}  ${String(size).padStart(6)}  ${name}`;
        }).join('\n');
        
        return { text: formatted };
      },
      
      cd: () => {
        const path = args[0] || '/home/user';
        const result = vfs.changeDirectory(path);
        if (result.error) {
          return { error: `cd: ${result.error}` };
        }
        return { text: '' };
      },
      
      pwd: () => ({
        text: vfs.getCurrentPath()
      }),
      
      cat: () => {
        if (args.length === 0) {
          return { error: 'cat: missing file argument' };
        }
        
        const result = vfs.readFile(args[0]);
        if (result.error) {
          return { error: `cat: ${result.error}` };
        }
        
        return { text: result.content };
      },
      
      echo: () => ({
        text: args.join(' ')
      }),
      
      clear: () => ({
        clear: true,
        text: ''
      }),
      
      date: () => ({
        text: new Date().toString()
      }),
      
      whoami: () => ({
        text: 'user'
      }),
      
      uname: () => {
        if (args.includes('-a')) {
          return {
            text: 'CDE-UNIX 5.0 cde-simulator i386 Sun Microsystems'
          };
        }
        return { text: 'CDE-UNIX' };
      },
      
      mkdir: () => {
        if (args.length === 0) {
          return { error: 'mkdir: missing directory argument' };
        }
        
        const result = vfs.createDirectory(args[0]);
        if (result.error) {
          return { error: `mkdir: ${result.error}` };
        }
        
        return { text: '' };
      },
      
      touch: () => {
        if (args.length === 0) {
          return { error: 'touch: missing file argument' };
        }
        
        const result = vfs.writeFile(args[0], '');
        if (result.error) {
          return { error: `touch: ${result.error}` };
        }
        
        return { text: '' };
      },
      
      rm: () => {
        if (args.length === 0) {
          return { error: 'rm: missing file argument' };
        }
        
        const result = vfs.deleteFile(args[0]);
        if (result.error) {
          return { error: `rm: ${result.error}` };
        }
        
        return { text: '' };
      },
      
      env: () => ({
        text: 'PATH=/usr/bin:/bin:/usr/sbin:/sbin\n' +
              'HOME=/home/user\n' +
              'USER=user\n' +
              'SHELL=/bin/sh\n' +
              'TERM=xterm-256color\n' +
              'DISPLAY=:0.0\n' +
              'LANG=en_US.UTF-8'
      })
    };
    
    if (cmd === '') {
      return { text: '' };
    }
    
    if (commands[cmd]) {
      return commands[cmd]();
    }
    
    return { error: `${cmd}: command not found` };
  }
};

