/* global define, $ */
define([], function() {

  var fs = require('fs');
  var gui = require('nw.gui');
  var FileWatcher = require('chokidar');


  /**
  * Files Tree Constructor
  */
  var FilesTree = function(app) {
    this.app = app;
    this.el = $('.files-tree');
    this.watchers = {};

    this.clickedItem = null;

    this.folderContextMenu = null;
    this.fileContextMenu = null;
    this.projectContextMenu = null;

    this._excludedFiles = [
      /\.DS_Store$/,
      /\.git$/
    ];

    this.initContextMenus();
    this.initFileTreeEvents();
  };

  FilesTree.prototype._isFileAuthorized = function(fileName) {
    var authorized = true;
    this._excludedFiles.forEach(function(regex) {
      if(regex.test(fileName)) {
        authorized = false;
      }
    });
    return authorized;
  };


  /**
  * Init Files Tree Context Menu
  */
  FilesTree.prototype.initContextMenus = function() {

    //
    // Project context menu
    //
    this.projectContextMenu = new gui.Menu();
    this.projectContextMenu.append(new gui.MenuItem({
      label: 'Nouveau fichier',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.projectContextMenu.append(new gui.MenuItem({
      label: 'Nouveau dossier...',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.projectContextMenu.append(new gui.MenuItem({ type: 'separator' }));
    this.projectContextMenu.append(new gui.MenuItem({
      label: 'Fermer le projet',
      click: (function() {
        this.removeDirectory(this.clickedItem);
        this.clickedItem = null;
      }).bind(this)
    }));

    //
    // File context menu
    //
    this.fileContextMenu = new gui.Menu();
    this.fileContextMenu.append(new gui.MenuItem({
      label: 'Renomer...',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.fileContextMenu.append(new gui.MenuItem({
      label: 'Supprimer le fichier',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.fileContextMenu.append(new gui.MenuItem({ type: 'separator' }));
    this.fileContextMenu.append(new gui.MenuItem({
      label: 'Afficher dans le finder',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));

    //
    // Folder context menu
    //
    this.folderContextMenu = new gui.Menu();
    this.folderContextMenu.append(new gui.MenuItem({
      label: 'Nouveau fichier',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.folderContextMenu.append(new gui.MenuItem({
      label: 'Renomer...',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.folderContextMenu.append(new gui.MenuItem({ type: 'separator' }));
    this.folderContextMenu.append(new gui.MenuItem({
      label: 'Nouveau dossier...',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.folderContextMenu.append(new gui.MenuItem({
      label: 'Supprimer le dossier...',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
    this.folderContextMenu.append(new gui.MenuItem({ type: 'separator' }));
    this.folderContextMenu.append(new gui.MenuItem({
      label: 'Afficher dans le finder',
      enabled: false,
      click: (function() {

      }).bind(this)
    }));
  };


  /**
  * Add directory to Files Tree
  */
  FilesTree.prototype.addDirectory = function(path) {
    var self = this;

    console.log('Open dir', path);

    // Get directory content
    var content = this.getDirectoryContent(path);

    //
    //
    //
    function addFileToDir(path) {
      var dirPath = path.substring(0, path.lastIndexOf('/'));
      var fileName = path.substring(path.lastIndexOf('/')+1);
      var nodeItem = $('.item[data-path="'+dirPath+'"]').parent();
      var childrenNode = $(nodeItem.find('.children')[0]);
      if(self._isFileAuthorized(fileName)) {
        var childItem = $('<div class="item file" data-path="'+path+'">'+fileName+'</div>');
        if(/\.ino$/.test(fileName)) childItem.addClass('ino-file');
        childrenNode.append(childItem);
      }
    }

    //
    //
    //
    function removeFile(path) {
      var nodeItem = $('.item[data-path="'+path+'"]');
      if(nodeItem.hasClass('directory')) nodeItem = nodeItem.parent();
      nodeItem.remove();
    }


    //
    // Function: Process directory content
    //
    function processContent(node, content, first) {
      var nodeItem = $('<div class="item" data-path="'+content.path+'">'+content.name+'</div>');

      // If first node, it's a project node
      if(first) {
        nodeItem.prepend('<i class="fa fa-caret-down"></i>');
        nodeItem.addClass('project');
      } else {
        nodeItem.prepend('<i class="fa fa-caret-right"></i>');
        nodeItem.addClass('directory');
      }
      node.append(nodeItem);

      // Parse children of curretn node
      var childrenNode = $('<div class="children" style="'+(first ? '' : 'display: none;')+'"></div>');
      content.children.forEach(function(child) {
        if(child.isDirectory && child.name !== '.git') {
          var childNode = $('<div class="node"></div>');
          childNode = processContent(childNode, child, false);
          childrenNode.append(childNode);
        } else {
          if(self._isFileAuthorized(child.name)) {
            var childItem = $('<div class="item file" data-path="'+child.path+'">'+child.name+'</div>');
            if(/\.ino$/.test(child.name)) childItem.addClass('ino-file');
            childrenNode.append(childItem);
          }
        }
      });
      node.append(childrenNode);

      return node;
    }

    // Create Directory Node
    var node = $('<div class="node expanded"></div>');
    node = processContent(node, content, true);
    $('.files-tree .tree-scroll').append(node);

    // Add watcher on this directory
    var nodeWatcher = FileWatcher.watch(content.path, {
      ignored: function(path) {
        if(/node_modules/.test(path))
          return true;
        if(/\.git$/.test(path))
          return true;
        return false;
      },
      ignoreInitial: true,
      interval: 1000,
      binaryInterval: 60000,
    });
    nodeWatcher.on('add', function(path) {
      addFileToDir(path);
    });
    nodeWatcher.on('unlink', function(path) {
      removeFile(path);
    });
    // nodeWatcher.on('change', function(path) {
    //   console.log('File changed: ', path);
    // });
    this.watchers[content.path] = nodeWatcher;

    // Init events
    this.initFileTreeEvents();
  };


  /**
  *
  */
  FilesTree.prototype.getDirectoryContent = function(path) {
    return {
      path: path,
      name: path.substring(path.lastIndexOf('/')+1),
      children: this._readDir(path)
    };
  };


  /**
  *
  */
  FilesTree.prototype._readDir = function(path) {
    var self = this;
    var content = [];
    var files = fs.readdirSync(path);
    files.forEach(function(f) {
      var filePath = path+'/'+f;
      var fStat = fs.statSync(path+'/'+f);
      var file = {
        path: filePath,
        name: filePath.substring(filePath.lastIndexOf('/')+1),
        isDirectory: fStat.isDirectory()
      };

      if(file.isDirectory) {
        file.children = self._readDir(filePath);
      } else {
        file.ext = '';
        var pointIndex = file.name.lastIndexOf('.');
        if(pointIndex > 0) {
          file.ext = file.name.substring(pointIndex+1);
        }
      }

      content.push(file);
    });

    return content;
  };


  /**
  *
  */
  FilesTree.prototype.removeDirectory = function(elmt) {
    var path = $($(elmt).find('.item')[0]).attr('data-path');
    this.watchers[path].close();
    delete this.watchers[path];
    $('.files-tree').find(elmt).remove();
  };


  /**
  *
  */
  FilesTree.prototype.initFileTreeEvents = function() {
    var self = this;

    $('.directory, .project, .file').unbind('click').unbind('dblclick').unbind('contextmenu');

    // Expand folder item on click
    $('.directory, .project').bind('click',function() {
      var item = $(this);
      var node = item.parent();
      var children = $(node.find('.children')[0]);

      // If node is expanded
      if(children && node.hasClass('expanded')) {
        children.slideUp(200);
        item.find('i').removeClass('fa fa-caret-down').addClass('fa fa-caret-right');
      } else {
        children.slideDown(200);
        item.find('i').removeClass('fa fa-caret-right').addClass('fa fa-caret-down');
      }
      node.toggleClass('expanded');
    });

    // Select item on click
    $('.file').bind('click', function() {
      $('.file').removeClass('selected');
      $(this).addClass('selected');
    });

    // Open contextual menu on right-click
    $('.project').bind('contextmenu', function(e) {
      self.clickedItem = $(this).parent();
      self.projectContextMenu.popup(e.pageX, e.pageY);
    });
    $('.file').bind('contextmenu', function(e) {
      self.clickedItem = $(this);
      self.fileContextMenu.popup(e.pageX, e.pageY);
    });
    $('.directory').bind('contextmenu', function(e) {
      self.clickedItem = $(this).parent();
      self.folderContextMenu.popup(e.pageX, e.pageY);
    });

    // Open file on dblclick
    $('.file').bind('dblclick', function() {
      self.app.openFile($(this).attr('data-path'));
    });
  };


  return FilesTree;

});