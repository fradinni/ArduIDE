/* global define, CodeMirror, $ */
define(['utils/SourceFile'], function(SourceFile) {

  /**
  * File Editor
  *
  * @param editorsPanel
  * @param index
  * @param file
  */
  var Editor = function(editorsPanel, index, file) {
    this.editorsPanel = editorsPanel;
    this.index = index || 0;
    this.el = $('<div class="editor" data-id="'+index+'"></div>');
    this.file = new SourceFile(file);
    this.tab = this._createTabForEditor();

    // Append tab and editor divs
    $('.tabs .wrapper').append($(this.tab));
    $(this.editorsPanel.el).append($(this.el));

    // Create code editor
    this.codeMirror = CodeMirror($(this.el).get(0), {
      value: this.file.content,
      mode:  this.file.getMIMEType(),
      lineNumbers: true,
      theme: 'ambiance',
      smartIndent: true
    });
  };


  /*
  *
  */
  Editor.prototype._createTabForEditor= function() {
    var element = $('<div class="tab">'+this.file.name+'<span class="tab-close">x</span></div>');

    var close_clicked =  false;

    // On click on editor's tab, set as active editor
    $(element).click((function() {
      setTimeout((function(){
        if(!close_clicked) this.editorsPanel.setActiveEditor(this.index);
      }).bind(this), 30);
    }).bind(this));

    // Bind close event
    $(element).find('.tab-close').click((function() {
      close_clicked = true;
      this.editorsPanel.closeFile(this.index);
      setTimeout(function(){ close_clicked = false; }, 60);
    }).bind(this));

    return element;
  };


  /**
  * Reload file content
  */
  Editor.prototype.reloadFile = function() {

  };


  /**
  * Save file
  */
  Editor.prototype.saveFile = function() {
    this.file.content = this.codeMirror.getValue();
    this.file.save();
  };


  /**
  *
  */
  Editor.prototype.close = function() {
    $('.tab')[this.index].remove();
    $('.editor')[this.index].remove();
  };


  /**
  *
  */
  Editor.prototype.setActive = function() {
    $(this.tab).addClass('active');
    $(this.el).addClass('active');
    setTimeout((function() {
      this.codeMirror.refresh();
    }).bind(this), 0);
  };

  Editor.prototype.setIndex = function(index) {
    this.index = index;
    $(this.el).attr('data-id', index);
  };

  /**
  *
  */
  Editor.prototype.setInactive = function() {
    $(this.tab).removeClass('active');
    $(this.el).removeClass('active');
  };

  return Editor;

});