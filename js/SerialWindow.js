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
    textarea.append(data.toString());
    setTimeout(function(){
      textarea.scrollTop(textarea[0].scrollHeight);
    }, 100);
  }

  serialPortManager.openConnection(port, speed, onData, function(err) {
    if(err) {
      $('.status').text('Unable to open serial port !');
    } else {
      $('.status').text('Connected.');
    }
  });

});