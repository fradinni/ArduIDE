/* global define, $, process */
define(['ui/Editor'], function(Editor) {

  var EditorPanel = function(app) {
    this.app = app;
    this.el = $('.editors');
    this.editors = [];
    this.activeEditor = -1;
  };

  /**
  *
  */
  EditorPanel.prototype.openFile = function(file, visualize) {

    this.editors.forEach((function(e, index) {
      if(!e.isOpened()) {
        this.closeFile(index);
      }
    }).bind(this));

    // Create new editor
    var editorIndex = this.editors.length;
    var editor = new Editor(this, editorIndex, file);
    editor.setOpened(!(visualize || false));

    // Add editor to editors list
    this.editors.push(editor);

    // Set editor active
    this.setActiveEditor(editorIndex);
  };


  /**
  *
  */
  EditorPanel.prototype.closeFile = function(index) {
    var editor = this.editors[index];

    this.app.recentFilesManager.addFile(editor.file.path);
    this.app.systemMenu.populateOpenRecentMenu();

    editor.close();
    this._removeEditor(index);
    this.setActiveEditor(index > 0 ? index-1 : 0);
  };


  /**
  *
  */
  EditorPanel.prototype.closeActiveFile = function() {
    this.closeFile(this.activeEditor);
  };


  /**
  *
  */
  EditorPanel.prototype.saveActiveFile = function() {
    this.getActiveEditor().saveFile();
  };


  /**
  *
  */
  EditorPanel.prototype._removeEditor = function(index) {
    var tmp = [];
    var i;

    // Copy editors to keep in new array
    for(i in this.editors) {
      if(i != index) tmp.push(this.editors[i]);
    }

    // Re-index editors
    for(i in tmp) {
      tmp[i].setIndex(i);
    }

    // Replace editors list
    this.editors = tmp;
  };


  /**
  *
  */
  EditorPanel.prototype.setActiveEditor = function(index) {
    if(!this.editors.length) {
      this.activeEditor = -1;
      return;
    }

    // Desactivate all editors
    this.editors.forEach((function(editor) {
      editor.setInactive();
    }).bind(this));

    // Activate requested editor
    this.editors[index].setActive();
    this.activeEditor = index;
  };

  EditorPanel.prototype.isFileOpened = function(path) {
    if(!path) return false;
    path = path.replace('~', process.env.HOME);
    var opened = false;
    this.editors.forEach(function(e) {
      if(e.file.path === path) {
        opened = true;
      }
    });
    return opened;
  };


  /**
  *
  */
  EditorPanel.prototype.getActiveEditor = function() {
    return this.editors[this.activeEditor];
  };

  return EditorPanel;

});