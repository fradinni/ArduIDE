/* global define, console, process */

/******************************************************************************
* ArduIDE - Main
* -----------------
* Author: Nicolas FRADIN
* Date: Nov. 2013
*
*/
define(['ArduIDE'], function(ArduIDE) {

  process.on('uncaughtException', function(err) { console.error('error: ' + err); });

  var gui = require('nw.gui');

  // Create new app
  process.App = new ArduIDE(gui.App.argv);

});