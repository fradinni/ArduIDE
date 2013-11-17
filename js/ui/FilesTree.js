/* global define, $ */
define([], function() {

  var fs = require('fs');
  var gui = require('nw.gui');


  /**
  * Files Tree Constructor
  */
  var FilesTree = function(app) {
    this.app = app;
    this.el = $('.files-tree');

    this.clickedItem = null;

    this.folderContextMenu = null;
    this.fileContextMenu = null;
    this.projectContextMenu = null;

    this.initContextMenus();
    this.initFileTreeEvents();
  };

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

    // Get directory content
    var content = this.getDirectoryContent(path);

    //
    // Function: Process directory content
    //
    function processContent(node, content, first) {
      var nodeItem = $('<div class="item">'+content.name+'</div>');

      if(first) {
        nodeItem.prepend('<i class="fa fa-caret-down"></i>');
        nodeItem.addClass('project');
      } else {
        nodeItem.prepend('<i class="fa fa-caret-right"></i>');
        nodeItem.addClass('directory');
      }

      node.append(nodeItem);

      var childrenNode = $('<div class="children" style="'+(first ? '' : 'display: none;')+'"></div>');
      content.children.forEach(function(child) {
        if(child.isDirectory) {
          var nodeChild = $('<div class="node"></div>');
          nodeChild = processContent(nodeChild, child, false);
          childrenNode.append(nodeChild);
        } else {
          if(!/\DS_Store/.test(child.name)) {
            childrenNode.append($('<div class="item file" data-path="'+child.path+'">'+child.name+'</div>'));
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
    $('.files-tree').find(elmt).remove();
  };


  /**
  *
  */
  FilesTree.prototype.initFileTreeEvents = function() {
    var self = this;

    // Expand folder item on click
    $('.files-tree .item').unbind('click');
    $('.files-tree .item').bind('click',function() {
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
    $('.files-tree .children > .item').bind('click', function() {
      $('.files-tree .children > .item').removeClass('selected');
      $(this).addClass('selected');
    });

    // Open contextual menu on right-click
    $('.files-tree .project').bind('contextmenu', function(e) {
      self.clickedItem = $(this).parent();
      self.projectContextMenu.popup(e.pageX, e.pageY);
    });
    $('.files-tree .file').bind('contextmenu', function(e) {
      self.clickedItem = $(this);
      self.fileContextMenu.popup(e.pageX, e.pageY);
    });
    $('.files-tree .directory').bind('contextmenu', function(e) {
      self.clickedItem = $(this).parent();
      self.folderContextMenu.popup(e.pageX, e.pageY);
    });

    // Open file on dblclick
    $('.files-tree .children > .item').unbind('dblclick');
    $('.files-tree .children > .item').bind('dblclick', function() {
      self.app.openFile($(this).attr('data-path'));
    });
  };


  return FilesTree;

});