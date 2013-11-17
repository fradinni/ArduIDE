/* global define, $ */
define([], function() {

  /**
  * ArduIDE Toolbar
  */
  var Toolbar = function(app) {
    this.app = app;
    this.el = $('.toolbar');
    this.initToolbarButtons();
    this.initToolbarEvent();
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


  Toolbar.prototype.initToolbarEvent = function() {
    var self = this;
    $('.serial').unbind('click');
    $('.serial').bind('click', function() {
      self.app.openSerialWindow();
    });
  };


  /**
  * Update serial ports list select
  */
  Toolbar.prototype.updateSerialPortsSelect = function(ports) {
    var select = $('#serialPorts');
    select.html('');
    ports.forEach(function(p, index) {
      var item = $('<option></option>');
      item.attr('value', index);
      item.html(p);
      select.append(item);
    });
  };


  Toolbar.prototype.getSelectedSerialPort = function() {
    return $('#serialPorts').val();
  };


  return Toolbar;
});