/* global define, global */

/******************************************************************************
* ArduIDE - Main
* -----------------
* Author: Nicolas FRADIN
* Date: Nov. 2013
*
*/
define(['ArduIDE'], function(ArduIDE) {

  var gui = require('nw.gui');

  // Create new app
  process.App = new ArduIDE(gui.App.argv);

});