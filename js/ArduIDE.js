/* global define, $, Mousetrap */
define(['utils/ConfigFile', 'ui/Layout'], function(ConfigFile, Layout) {

  var gui = require('nw.gui');
  var Window = gui.Window.get();

  /**
  * ArduIDE Application
  */
  var ArduIDE = function(argv) {
    this.version = '0.1.0a';
    this.config = new ConfigFile('config.json');
    this.layout = new Layout();
    this.initToolbarButtons();
    this.initSytemMenu();
    this.initKeyboardShortcuts();
    argv.forEach((function(file) {
      this.openFile(file);
    }).bind(this));
  };


  /**
  *
  */
  ArduIDE.prototype.initSytemMenu = function() {
    var menu = new gui.Menu({ type: 'menubar' });

    ///////////////////////////////////////////////////////////
    // Create FileMenu
    var fileMenu = new gui.Menu();

    // Create menu item
    fileMenu.append(new gui.MenuItem({
      label: 'Nouveau fichier',
      click: (function() {
        this.openFile();
      }).bind(this)
    }));
    // Bind keyboard event on previously created item
    Mousetrap.bind('ctrl+n', (function() {
      this.openFile();
    }).bind(this));

    fileMenu.append(new gui.MenuItem({
      label: 'Ouvrir...',
      click: (function() {
        this.chooseFile();
      }).bind(this)
    }));

    var openRecentMenu = new gui.Menu();
    openRecentMenu.append(new gui.MenuItem({
      label: 'Réouvrir le dernier fichier fermé',
      click: (function() {

      }).bind(this)
    }));
    fileMenu.append(new gui.MenuItem({
      label: 'Ouvrir récent',
      submenu: openRecentMenu
    }));

    //assign the menubar to window menu
    Window.menu = menu;
    menu.insert(new gui.MenuItem({ label: 'Fichier', submenu: fileMenu}), 1);
  };


  /**
  *
  */
  ArduIDE.prototype.initKeyboardShortcuts = function() {
    Mousetrap.bind('ctrl+w', (function(e) {
      e.preventDefault();
      this.closeActiveFile();
    }).bind(this));
  };


  /**
  *
  */
  ArduIDE.prototype.initToolbarButtons = function() {
    $('.open-file').click((function() {
      this.chooseFile((function(path) {
        this.openFile(path);
      }).bind(this));
    }).bind(this));
  };


  /**
  *
  */
  ArduIDE.prototype.openFile = function(file) {
    this.layout.editorsPanel.openFile(file);
  };


  ArduIDE.prototype.closeActiveFile = function() {
    this.layout.editorsPanel.closeActiveFile();
  };

  /**
  *
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


  return ArduIDE;
});