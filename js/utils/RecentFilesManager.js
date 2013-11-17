/* global define, process */
define([], function() {

  var _ = require('underscore');


  /**
  *
  */
  var RecentFilesManager = function(app, max) {
    this.app = app;
    this.max = max || 8;
    this.recentFiles = [];
    this.recentDirs = [];

    // Load from config file
    this._loadRecentFiles();
  };


  /**
  *
  */
  RecentFilesManager.prototype._loadRecentFiles = function() {
    var appConfig = this.app.config.get();

    if(typeof(appConfig.recentFiles) === 'undefined') {
      appConfig.recentFiles = this.recentFiles;
    } else {
      this.recentFiles = appConfig.recentFiles;
    }

    if(typeof(appConfig.recentDirs) === 'undefined') {
      appConfig.recentDirs = this.recentDirs;
    } else {
      this.recentDirs = appConfig.recentDirs;
    }

    this.save();
  };


  /**
  *
  */
  RecentFilesManager.prototype.addFile = function(path) {
    if(!path) return;
    path = path.replace(process.env.HOME, '~');

    // Check if path already exists
    if(_.contains(this.recentFiles, path)) return;

    // If files count exceed authorized max length,
    // rmove first element (the oldest)
    if(this.recentFiles.length >= this.max) {
      this.recentFiles.pop();
    }
    // Push file
    this.recentFiles.unshift(path);
    this.save();
  };


  /**
  *
  */
  RecentFilesManager.prototype.addDirectory = function(path) {
    if(!path) return;
    path = path.replace(process.env.HOME, '~');

    // Check if path already exists
    if(_.contains(this.recentDirs, path)) return;

    // If files count exceed authorized max length,
    // rmove first element (the oldest)
    if(this.recentDirs.length >= this.max) {
      this.recentDirs.pop();
    }
    // Push file
    this.recentDirs.unshift(path);
    this.save();
  };


  /**
  *
  */
  RecentFilesManager.prototype.save = function() {
    this.app.config.save();
  };


  return RecentFilesManager;

});