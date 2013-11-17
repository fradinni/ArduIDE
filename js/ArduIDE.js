/* global define, $, CodeMirror, process */
define([
  'utils/ConfigFile', 'utils/RecentFilesManager', 'utils/SerialPortManager',
  'ui/Layout', 'ui/SystemMenu'
], function (
  ConfigFile, RecentFilesManager, SerialPortManager,
  Layout, SystemMenu
) {

  var gui = require('nw.gui');

  /**
  * ArduIDE Application
  */
  var ArduIDE = function(argv) {
    this.version = '0.1.0a';
    this.config = new ConfigFile('config.json');
    this.serialPortManager = new SerialPortManager(this);
    this.recentFilesManager = new RecentFilesManager(this);

    this._addEditorExtraKeys();

    this.layout = new Layout(this);
    this.systemMenu = new SystemMenu(this);
    this.serialWindow = null;

     // Hide splash screen
    setTimeout(function(){
      gui.Window.get().show();
      //$('.splash-screen').fadeOut(1000);
    }, 0);

    argv.forEach((function(file) {
      if(file.indexOf('.ino') === file.length - 4) {
        this.openDirectory(file.substring(0, file.lastIndexOf('/')));
      }
      this.openFile(file);
    }).bind(this));
  };


  /**
  * Add extra key bindings to CodeMirror
  */
  ArduIDE.prototype._addEditorExtraKeys = function() {
    CodeMirror.commands.openFile = (function() {
      this.chooseFile();
    }).bind(this);

    CodeMirror.commands.closeFile = (function() {
      this.closeActiveFile();
    }).bind(this);

    CodeMirror.commands.openDirectory = (function() {
      this.chooseDirectory();
    }).bind(this);

    CodeMirror.commands.saveFile = (function() {
      this.saveActiveFile();
    }).bind(this);

    CodeMirror.commands.saveFileAs = (function() {
      this.saveAsDialog();
    }).bind(this);

    CodeMirror.keyMap['default']['Cmd-O'] = 'openFile';
    CodeMirror.keyMap['default']['Ctrl-W'] = 'closeFile';
    CodeMirror.keyMap['default']['Shift-Cmd-O'] = 'openDirectory';
    CodeMirror.keyMap['default']['Cmd-S'] = 'saveFile';
    CodeMirror.keyMap['default']['Shift-Cmd-S'] = 'saveFileAs';
  };


  /**
  * Open File
  */
  ArduIDE.prototype.openFile = function(file) {
    var self = this;
    if(file && file.indexOf(';') > 0) {
      file.split(';').forEach(function(f){
        self.layout.editorsPanel.openFile(f);
      });
    } else {
      this.layout.editorsPanel.openFile(file);
    }
  };

  /**
  * Visualize file
  */
  ArduIDE.prototype.visuFile = function(file) {
    this.layout.editorsPanel.openFile(file, true);
  };


  /**
  *
  */
  ArduIDE.prototype.openRecentFile = function() {
    var recentFiles = this.config.get().recentFiles;
    var fileOpened = false;
    recentFiles.forEach((function(file) {
      if(!fileOpened && !this.layout.editorsPanel.isFileOpened(file)) {
        this.openFile(file.replace('~', process.env.HOME));
        fileOpened = true;
      }
    }).bind(this));
  };

  /**
  * Open Directory
  */
  ArduIDE.prototype.openDirectory = function(path) {
    this.setStatusBarText('Opening...', 1000);
    setTimeout((function(){
      this.recentFilesManager.addDirectory(path);
      this.systemMenu.populateOpenRecentMenu();
      this.layout.filesTree.addDirectory(path);
    }).bind(this), 0);
  };


  /**
  * Close active file
  */
  ArduIDE.prototype.closeActiveFile = function() {
    // Close file
    this.layout.editorsPanel.closeActiveFile();
  };


  /**
  *
  */
  ArduIDE.prototype.saveActiveFile = function() {

    var editor = this.layout.editorsPanel.getActiveEditor();

    if(!editor.file.path)
      return this.saveAsDialog();

    // Save file
    this.layout.editorsPanel.saveActiveFile();

    // Display status bar text
    var filePath = this.layout.editorsPanel.getActiveEditor().file.path;
    filePath.replace(process.env.HOME, '~');
    this.setStatusBarText('File saved ' + filePath, 3000);
  };

  /**
  *
  */
  ArduIDE.prototype.saveActiveFileAs = function(path) {
    if(!path) return;

    // Update editor file path
    var editor = this.layout.editorsPanel.getActiveEditor();
    editor.setFilePath(path);

    // Save file
    this.layout.editorsPanel.saveActiveFile();

    // Display status bar text
    var filePath = this.layout.editorsPanel.getActiveEditor().file.path;
    filePath.replace(process.env.HOME, '~');
    this.setStatusBarText('File saved ' + filePath, 3000);
  };


  /**
  * Open Choose File Dialog
  */
  ArduIDE.prototype.chooseFile = function(callback) {
    var self = this;
    $('#openFile').unbind('change');
    $('#openFile').bind('change',function() {
      if(callback) callback($(this).val());
      else self.openFile($(this).val());
    });
    $('#openFile').click();
  };


  /**
  * Open Choose Directory Dialog
  */
  ArduIDE.prototype.chooseDirectory = function(callback) {
    var self = this;
    $('#openDir').unbind('change');
    $('#openDir').bind('change',function() {
      if(callback) callback($(this).val());
      else self.openDirectory($(this).val());
    });
    $('#openDir').trigger('click');
  };


  /**
  * Open Save As Dialog
  */
  ArduIDE.prototype.saveAsDialog = function(callback) {
    var self = this;
    $('#saveFileAs').unbind('change');
    $('#saveFileAs').bind('change',function(e) {
      e.preventDefault();
      e.stopPropagation();
      if(callback) callback($(this).val());
      else self.saveActiveFileAs($(this).val());
      return false;
    });
    $('#saveFileAs').attr('nwsaveas', this.layout.editorsPanel.getActiveEditor().file.name);
    $('#saveFileAs').trigger('click');
  };


  /**
  *
  */
  ArduIDE.prototype.setStatusBarText = function(text, autoHideDelay) {
    autoHideDelay = autoHideDelay || -1;
    var sb = $('.status-bar');
    var sbText;

    if(autoHideDelay) {
      sbText = sb.html();
    }
    sb.text(text);
    if(autoHideDelay) {
      setTimeout(function() {
        sb.text(sbText);
      }, autoHideDelay);
    }
  };


  /**
  *
  */
  ArduIDE.prototype.updateSerialPortsSelect = function() {
    this.layout.toolbar.updateSerialPortsSelect(this.serialPortManager.serialPorts);
  };

  ArduIDE.prototype.getSelectedSerialPort = function() {
    return this.serialPortManager.serialPorts[this.layout.toolbar.getSelectedSerialPort()];
  };

  ArduIDE.prototype.openSerialWindow = function() {
    if(this.serialWindow) return;
    var self = this;
    this.serialWindow = gui.Window.open('./serial.html', {
      position: 'center',
      toolbar: false,
      title: 'Moniteur série',
      width: 500,
      height: 300
    });
    this.serialWindow.on('close', function() {
      self.serialPortManager.closeConnection();
      this.hide(); // Pretend to be closed already
      this.close(true);
      self.serialWindow = null;
    });
    this.serialWindow.focus();
  };


  return ArduIDE;
});