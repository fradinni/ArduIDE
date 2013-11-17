/* global define, console */
define([], function() {
  var _ =  require('underscore');
  var serialport = require('serialport');
  var SerialPort = serialport.SerialPort;

  /**
  *
  */
  var SerialPortManager = function(app) {
    this.app = app;
    this.serialPort = null;
    this.connected = false;
    this.serialPorts = [];
    this.serialPortsWatcher = setInterval((function(){
      this.listSerialPorts();
    }).bind(this), 1000);
  };

  /**
  *
  */
  SerialPortManager.prototype.listSerialPorts = function() {
    if(this.connected) return this.serialPorts;

    var self = this;
    var _ports = [];
    serialport.list(function (err, ports) {
      _ports = _.map(ports, function(p) { return p.comName; });

      var same = true;
      _ports.forEach(function(p) {
        if(!_.contains(self.serialPorts, p)) same = false;
      });
      if(!same) {
        self.serialPorts = _ports;
        self.app.updateSerialPortsSelect();
        return;
      }

      same = true;
      self.serialPorts.forEach(function(p) {
        if(!_.contains(_ports, p)) same = false;
      });
      if(!same) {
        self.serialPorts = _ports;
        self.app.updateSerialPortsSelect();
        return;
      }
    });
  };


  /**
  *
  */
  SerialPortManager.prototype.openConnection = function(port, speed, onData, callback) {
    var self = this;
    if(!_.contains(this.serialPorts, port)) return false;

    var serial = this.serialPort = new SerialPort(port, {
      baudrate: speed,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: false
    }, true, function(err) {
      if(err) {
        return callback(err);
      }
    });

    serial.on('open', function() {
      self.connected = true;
      serial.on('data', function(data) {
        onData(data);
      });
      callback(null);
    });

    serial.on('close', function() {
      self.connected = false;
      self.serialPort = null;
      console.log('Close serial connnection !');
    });
  };


  /**
  *
  */
  SerialPortManager.prototype.closeConnection = function() {
    if(this.serialPort) {
      try {
        this.serialPort.close();
      } catch(e){}
    }
  };

  SerialPortManager.prototype.println = function(value) {
    if(this.serialPort) {
      this.serialPort.write(value+'\n');
    }
  };


  return SerialPortManager;
});