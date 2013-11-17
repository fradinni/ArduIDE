/* global define, console */

define([], function() {

  var fs = require('fs');
  var mime = require('mime');

  /**
  * ArduIDE Configuration file constructor
  * @param path {String} Config file path
  *
  */
  var SourceFile = function (path) {
    this.path = path;
    this.name = this.path ? path.substring(path.lastIndexOf('/')+1) : 'undefined';
    this.content = '';
    this.mimeType = 'text/x-c++src';


    // Load config file
    this._loadFile();
  };


  /**
  * Load config file from disk. If file doesn't existsn create it.
  */
  SourceFile.prototype._loadFile = function() {
    if( !fs.existsSync(this.path) ) {
      return '';
    }
    this.content = fs.readFileSync(this.path).toString();
  };


  /**
  *
  */
  SourceFile.prototype.getMIMEType = function() {
    var ext = this.name.substring(this.name.lastIndexOf('.')+1);
    if(ext === 'ino' || ext === 'pde') {
      return 'text/x-c++src';
    }
    var m = mime.lookup(ext);
    return m;
  };

  /**
  * Save config to disk
  */
  SourceFile.prototype.save = function() {
    fs.writeFileSync(this.path, this.content);
  };


  return SourceFile;
});