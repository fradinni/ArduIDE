/* global define, Mousetrap, process */
define([], function() {

  var gui = require('nw.gui');
  var Window = gui.Window.get();

  /**
  *
  */
  var SystemMenu = function(app) {
    this.app = app;
    this.menu = new gui.Menu({ type: 'menubar' });
    this.fileMenu = null;
    this.openRecentMenu = null;
    this.init();
  };


  /**
  * Init System Menu
  */
  SystemMenu.prototype.init = function() {

    //assign the menubar to window menu
    Window.menu = this.menu;

    // Init file menu
    this.initFileMenu();
  };


  /**
  * Initialize File Menu
  */
  SystemMenu.prototype.initFileMenu = function() {

    this.fileMenu = new gui.Menu();

    // New file
    this.fileMenu.append(new gui.MenuItem({
      label: 'Nouveau fichier',
      click: (function() {
        this.openFile();
      }).bind(this.app)
    }));
    Mousetrap.bind('command+n', (function() {
      this.openFile();
    }).bind(this.app));


    // Open file
    this.fileMenu.append(new gui.MenuItem({
      label: 'Ouvrir...',
      click: (function() {
        this.chooseFile();
      }).bind(this.app)
    }));
    Mousetrap.bind('command+o', (function() {
      this.chooseFile();
    }).bind(this.app));


    // Open recent menu
    this.openRecentMenu = new gui.Menu();
    this.openRecentMenu.append(new gui.MenuItem({
      label: 'Ouvrir le dernier fichier fermé...',
      click: (function() {
        this.openRecentFile();
      }).bind(this.app)
    }));
    Mousetrap.bind('command+shift+t', (function() {
      this.openRecentFile();
    }).bind(this.app));

    this.openRecentMenu.append(new gui.MenuItem({ type: 'separator' }));

    this.fileMenu.append(new gui.MenuItem({
      label: 'Ouvrir récent',
      submenu: this.openRecentMenu
    }));
    this.populateOpenRecentMenu();


    // Open folder
    this.fileMenu.append(new gui.MenuItem({
      label: 'Ouvrir dossier...',
      click: (function() {
        this.chooseDirectory();
      }).bind(this.app)
    }));
    Mousetrap.bind('command+shift+o', (function() {
      this.chooseDirectory();
    }).bind(this.app));


    // Separator
    this.fileMenu.append(new gui.MenuItem({ type: 'separator' }));


    // Save file
    this.fileMenu.append(new gui.MenuItem({
      label: 'Enregistrer',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('command+s', (function() {

    }).bind(this));


    // Save file as
    this.fileMenu.append(new gui.MenuItem({
      label: 'Enregistrer sous...',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('command+shift+s', (function() {

    }).bind(this));


    // Save all files
    this.fileMenu.append(new gui.MenuItem({
      label: 'Enregistrer tout les fichiers',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('alt+shift+s', (function() {

    }).bind(this));


    // Separator
    this.fileMenu.append(new gui.MenuItem({ type: 'separator' }));


    // Close file
    this.fileMenu.append(new gui.MenuItem({
      label: 'Fermer le fichier',
      click: (function() {
        this.app.closeActiveFile();
      }).bind(this)
    }));
    Mousetrap.bind('ctrl+w', (function() {
      this.app.closeActiveFile();
    }).bind(this));


    // Close all files
    this.fileMenu.append(new gui.MenuItem({
      label: 'Fermer tous les fichiers',
      click: (function() {

      }).bind(this)
    }));
    Mousetrap.bind('ctrl+shift+s', (function() {

    }).bind(this));


    // Insert file menu in System Menu
    this.menu.insert(new gui.MenuItem({ label: 'Fichier', submenu: this.fileMenu}), 1);
  };


  /**
  *
  */
  SystemMenu.prototype.populateOpenRecentMenu = function() {
    var self = this;

    function removeItems(callback) {
      setTimeout(function() {
        if(self.openRecentMenu.items.length > 2) {
          self.openRecentMenu.removeAt(self.openRecentMenu.items.length-1);
          return removeItems(callback);
        } else {
          return callback();
        }
      }, 50);
    }

    // Remove all item
    removeItems((function() {
      var config = this.app.config.get();
      // Load files
      config.recentFiles.forEach((function(file) {
        this.openRecentMenu.append(new gui.MenuItem({
          label: file,
          click: (function() {
            this.openFile(file.replace('~', process.env.HOME));
          }).bind(this.app)
        }));
      }).bind(this));

      this.openRecentMenu.append(new gui.MenuItem({ type: 'separator' }));

      // Load dirs
      config.recentDirs.forEach((function(dir) {
        this.openRecentMenu.append(new gui.MenuItem({
          label: dir,
          click: (function() {
            this.openDirectory(dir.replace('~', process.env.HOME));
          }).bind(this.app)
        }));
      }).bind(this));

    }).bind(this));

    /*
    this.openRecentMenu.append(new gui.MenuItem({ type: 'separator' }));

    config.recentDirs.forEach((function(dir) {
      this.openRecentMenu.append(new gui.MenuItem({
        label: dir,
        click: (function() {
          this.openDirectory(dir);
        }).bind(this.app)
      }));
    }).bind(this));
    */
  };


  return SystemMenu;

});