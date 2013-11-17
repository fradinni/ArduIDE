/* global define, $, Mousetrap */
define(['utils/ConfigFile', 'ui/Layout'], function(ConfigFile, Layout) {

  var fs = require('fs');
  var gui = require('nw.gui');
  var Window = gui.Window.get();

  /**
  * ArduIDE Application
  */
  var ArduIDE = function(argv) {
    this.version = '0.1.0a';
    this.config = new ConfigFile('config.json');
    this.layout = new Layout(this);
    this.initToolbarButtons();
    this.initSytemMenu();
    this.initKeyboardShortcuts();
    argv.forEach((function(file) {
      if(file.indexOf('.ino') === file.length - 4) {
        this.openDirectory(file.substring(0, file.lastIndexOf('/')));
      }
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
    Mousetrap.bind('ctrl+o', (function() {
      this.chooseFile();
    }).bind(this));

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

    fileMenu.append(new gui.MenuItem({
      label: 'Ouvrir dossier...',
      click: (function() {
        this.chooseDirectory();
      }).bind(this)
    }));
    Mousetrap.bind('ctrl+shift+o', (function() {
      this.chooseDirectory();
    }).bind(this));


    fileMenu.append(new gui.MenuItem({ type: 'separator' }));


    fileMenu.append(new gui.MenuItem({
      label: 'Enregistrer',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('ctrl+s', (function() {

    }).bind(this));

    fileMenu.append(new gui.MenuItem({
      label: 'Enregistrer sous...',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('ctrl+shift+s', (function() {

    }).bind(this));

    fileMenu.append(new gui.MenuItem({
      label: 'Enregistrer tout les fichiers',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('alt+shift+s', (function() {

    }).bind(this));


    fileMenu.append(new gui.MenuItem({ type: 'separator' }));


    fileMenu.append(new gui.MenuItem({
      label: 'Fermer le fichier',
      click: (function() {
        this.closeActiveFile();
      }).bind(this)
    }));
    Mousetrap.bind('ctrl+shift+s', (function() {

    }).bind(this));

    fileMenu.append(new gui.MenuItem({
      label: 'Fermer tous les fichiers',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('ctrl+shift+s', (function() {

    }).bind(this));


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
    var sb = $('.status-bar');
    var sbText;

    // Compile
    $('.compile').click((function() {

    }).bind(this));

    $('.compile').hover(function() {
      sbText = sb.html();
      sb.text('Compiler le programme...');
    }, function() {
      sb.text(sbText);
    });

    // Upload
    $('.upload').click((function() {

    }).bind(this));

    $('.upload').hover(function() {
      sbText = sb.html();
      sb.text('Uploader le programme...');
    }, function() {
      sb.text(sbText);
    });

    // Serial Monitor
    $('.serial').click((function() {

    }).bind(this));

    $('.serial').hover(function() {
      sbText = sb.html();
      sb.text('Moniteur port série...');
    }, function() {
      sb.text(sbText);
    });
  };


  /**
  *
  */
  ArduIDE.prototype.openFile = function(file) {
    var self = this;
    if(file.indexOf(';') > 0) {
      file.split(';').forEach(function(f){
        self.layout.editorsPanel.openFile(f);
      });
    } else {
      this.layout.editorsPanel.openFile(file);
    }
  };

  ArduIDE.prototype.visuFile = function(file) {
    this.layout.editorsPanel.openFile(file, true);
  };


  ArduIDE.prototype.openDirectory = function(path) {
    this.layout.filesTree.addDirectory(path);
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

  ArduIDE.prototype.chooseDirectory = function(callback) {
    var self = this;
    $('#openDir').unbind('change');
    $('#openDir').bind('change',function() {
      if(callback) callback($(this).val());
      else self.openDirectory($(this).val());
    });
    $('#openDir').click();
  };


  return ArduIDE;
});