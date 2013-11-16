/* global define, $ */

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
  new ArduIDE(gui.App.argv);

  // Hide splash screen
  setTimeout(function(){
    $('.splash-screen').fadeOut(1000);
  }, 1000);

});