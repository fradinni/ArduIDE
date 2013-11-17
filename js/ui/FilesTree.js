/* global define, $ */
define([], function() {

  var fs = require('fs');


  /**
  * Files Tree Constructor
  */
  var FilesTree = function(app) {
    this.app = app;
    this.el = $('.files-tree');
    this.initFileTreeEvents();
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

      if(first) nodeItem.prepend('<i class="fa fa-caret-down"></i>');
      else nodeItem.prepend('<i class="fa fa-caret-right"></i>');

      node.append(nodeItem);

      var childrenNode = $('<div class="children" style="'+(first ? '' : 'display: none;')+'"></div>');
      content.children.forEach(function(child) {
        if(child.isDirectory) {
          var nodeChild = $('<div class="node"></div>');
          nodeChild = processContent(nodeChild, child, false);
          childrenNode.append(nodeChild);
        } else {
          if(!/\DS_Store/.test(child.name)) {
            childrenNode.append($('<div class="item">'+child.name+'</div>'));
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
  FilesTree.prototype.initFileTreeEvents = function() {
    $('.files-tree .item').unbind('click');
    $('.files-tree .item').bind('click',function() {
      var item = $(this);
      var node = item.parent();
      var children = $(node.find('.children')[0]);

      // If node is expanded
      if(node.hasClass('expanded')) {
        children.slideUp(200);
        item.find('i').removeClass('fa fa-caret-down').addClass('fa fa-caret-right');
      } else {
        children.slideDown(200);
        item.find('i').removeClass('fa fa-caret-right').addClass('fa fa-caret-down');
      }
      node.toggleClass('expanded');

      // $('.files-tree .item').removeClass('selected');
      // $(this).addClass('selected');
    });

    $('.files-tree .children > .item').unbind('click');
    $('.files-tree .children > .item').bind('click', function() {
      $('.files-tree .children > .item').removeClass('selected');
      $(this).addClass('selected');
    });
  };


  return FilesTree;

});