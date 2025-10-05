// Virtual Filesystem for CDE Desktop
// Provides Unix-like filesystem with basic operations

class VirtualFS {
  constructor() {
    this.currentPath = '/home/user';
    this.fs = {
      '/': {
        'home': {
          'user': {
            'documents': {
              'readme.txt': 'Welcome to CDE!\n\nThis is a simulated Unix desktop environment based on the Common Desktop Environment.\n\nYou can use the terminal to navigate the filesystem.',
              'notes.txt': 'My notes...'
            },
            'downloads': {},
            '.profile': '# User profile\nexport PATH=/usr/bin:/bin\n'
          }
        },
        'usr': {
          'bin': {},
          'lib': {},
          'share': {
            'doc': {}
          }
        },
        'etc': {
          'hosts': '127.0.0.1  localhost\n',
          'passwd': 'root:x:0:0:root:/root:/bin/sh\nuser:x:1000:1000:User:/home/user:/bin/sh\n'
        },
        'tmp': {},
        'var': {
          'log': {}
        }
      }
    };
  }

  getCurrentPath() {
    return this.currentPath;
  }

  changeDirectory(path) {
    const newPath = this.resolvePath(path);
    const result = this.getNode(newPath);
    if (result.error) return result;
    if (typeof result !== 'object' || result === null) {
      return { error: 'Not a directory' };
    }
    this.currentPath = newPath;
    return { path: newPath };
  }

  resolvePath(path) {
    if (path === '~') return '/home/user';
    if (path.startsWith('/')) return path;
    if (path === '.') return this.currentPath;
    if (path === '..') {
      const parts = this.currentPath.split('/').filter(p => p);
      parts.pop();
      return '/' + parts.join('/');
    }
    return this.currentPath + (this.currentPath.endsWith('/') ? '' : '/') + path;
  }

  getNode(path) {
    const parts = path.split('/').filter(p => p);
    let node = this.fs['/'];
    for (const part of parts) {
      if (!node[part]) {
        return { error: 'No such file or directory' };
      }
      node = node[part];
    }
    return node;
  }

  listDirectory(path) {
    const fullPath = this.resolvePath(path || '.');
    const node = this.getNode(fullPath);
    if (node.error) return node;
    if (typeof node !== 'object') return { error: 'Not a directory' };
    
    const items = [];
    for (const name in node) {
      const type = typeof node[name] === 'object' ? 'directory' : 'file';
      items.push({ name, type, size: type === 'file' ? node[name].length : 0 });
    }
    return items;
  }

  readFile(path) {
    const fullPath = this.resolvePath(path);
    const node = this.getNode(fullPath);
    if (node.error) return node;
    if (typeof node === 'object') return { error: 'Is a directory' };
    return { content: node };
  }

  writeFile(path, content) {
    const fullPath = this.resolvePath(path);
    const parts = fullPath.split('/').filter(p => p);
    const fileName = parts.pop();
    const dirPath = '/' + parts.join('/');
    const dir = this.getNode(dirPath);
    if (dir.error) return dir;
    if (typeof dir !== 'object') return { error: 'Not a directory' };
    dir[fileName] = content;
    return { success: true };
  }

  createDirectory(path) {
    const fullPath = this.resolvePath(path);
    const parts = fullPath.split('/').filter(p => p);
    const dirName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parent = this.getNode(parentPath);
    if (parent.error) return parent;
    if (typeof parent !== 'object') return { error: 'Not a directory' };
    if (parent[dirName]) return { error: 'File exists' };
    parent[dirName] = {};
    return { success: true };
  }

  deleteFile(path) {
    const fullPath = this.resolvePath(path);
    const parts = fullPath.split('/').filter(p => p);
    const fileName = parts.pop();
    const dirPath = '/' + parts.join('/');
    const dir = this.getNode(dirPath);
    if (dir.error) return dir;
    if (!dir[fileName]) return { error: 'No such file or directory' };
    delete dir[fileName];
    return { success: true };
  }
}

// Global filesystem instance
const vfs = new VirtualFS();

