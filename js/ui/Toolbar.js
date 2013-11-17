/* global define, $ */
define([], function() {

  /**
  * ArduIDE Toolbar
  */
  var Toolbar = function(app) {
    this.app = app;
    this.el = $('.toolbar');
    this.initToolbarButtons();
  };


  /**
  * Init Buttons
  */
  Toolbar.prototype.initToolbarButtons = function() {
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

  return Toolbar;
});