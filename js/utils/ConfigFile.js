/* global define, console */

define([], function() {

  var fs = require('fs');

  /**
  * ArduIDE Configuration file constructor
  * @param path {String} Config file path
  *
  */
  var ConfigFile = function (path) {
    this.path = path;
    this.config = {};

    // Load config file
    this._loadFile();
  };


  /**
  * Load config file from disk. If file doesn't existsn create it.
  */
  ConfigFile.prototype._loadFile = function() {
    if( !fs.existsSync(this.path) ) {
      this.save();
    }
    var fileContent = fs.readFileSync(this.path);
    this.config = JSON.parse(fileContent);
  };


  /**
  * Save config to disk
  */
  ConfigFile.prototype.save = function() {
    fs.writeFileSync(this.path, JSON.stringify(this.config));
  };


  ConfigFile.prototype.toString = function() {
    return JSON.stringify(this.config);
  };


  return ConfigFile;
});