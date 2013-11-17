/* global define, $ */
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
  EditorPanel.prototype.openFile = function(file) {

    // Create new editor
    var editorIndex = this.editors.length;
    var editor = new Editor(this, editorIndex, file);

    // Add editor to editors list
    this.editors.push(editor);

    // Set editor active
    this.setActiveEditor(editorIndex);
  };


  /**
  *
  */
  EditorPanel.prototype.closeFile = function(index) {
    this.editors[index].close();
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
    this.editors.forEach(function(editor) {
      editor.setInactive();
    });

    // Activate requested editor
    this.editors[index].setActive();
    this.activeEditor = index;
  };

  return EditorPanel;

});