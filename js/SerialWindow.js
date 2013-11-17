/* global define, process, $, console, alert */
define([], function() {

  var app = process.App;
  var serialPortManager = app.serialPortManager;

  // Open serial connection
  var port = app.getSelectedSerialPort();
  var speed = $('#baudRate').val();
  console.log('Open serial connection ', port, speed);

  var textarea = $('textarea');
  function onData(data) {
    textarea.text(textarea.html()+data);
  }

  serialPortManager.openConnection(port, speed, onData, function(err) {
    if(err) {
      alert('Unable to open serial port !');
    }
  });

});