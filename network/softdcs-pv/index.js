'use strict';

var util = require('util');
var sensorDriver = require('../../index');
var Network = sensorDriver.Network;
var Sensor = sensorDriver.Sensor;

function SoftDCSPV(options) {
  Network.call(this, 'softdcs-pv', options);
}

util.inherits(SoftDCSPV, Network);

SoftDCSPV.prototype.discover = function(networkName, options, cb) {
  return cb && cb(new Error('Not supported'));
};

module.exports = new SoftDCSPV();
