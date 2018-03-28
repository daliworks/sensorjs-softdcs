'use strict';

var util = require('util');

var SensorLib = require('../index');
var Sensor = SensorLib.Sensor;
var logger = Sensor.getLogger('Sensor');
var SoftDCSBase = require('../softDCSBase');

function SoftDCSBaseSensor(sensorInfo, options) {
  var self = this;
  var tokens;
  
  Sensor.call(self, sensorInfo, options);

  tokens = self.id.split('-');
  self.address = tokens[1].split(':')[0];
  self.port = tokens[1].split(':')[1];
  self.field = tokens[2];

  self.parent = SoftDCSBase.create(self.address, self.port);

  if (sensorInfo.model) {
    self.model = sensorInfo.model;
  }

  self.dataType = SoftDCSBaseSensor.properties.dataTypes[self.model][0];

   self.parent.register(self);
}

util.inherits(SoftDCSBaseSensor, Sensor);

SoftDCSBaseSensor.properties = {
  supportedNetworks: ['softdcs-pv'],
  dataTypes: {
    'softDCSBaseTemperature' : ['temperature'],
    'softDCSBaseFrequency' : ['frequency'],
    'softDCSBaseVoltage' : ['voltage'],
    'softDCSBaseVoltageUnbalance' : ['percent']
  },
  discoverable: false,
  addressable: true,
  recommendedInterval: 60000,
  maxInstances: 32,
  maxRetries: 8,
  idTemplate: '{gatewayId}-{deviceAddress}-{sequence}',
  models: [
    'softDCSBaseTemperature',
    'softDCSBaseFrequency',
    'softDCSBaseVoltage',
    'softDCSBaseVoltageUnbalance'
  ],
  category: 'sensor'
};


SoftDCSBaseSensor.prototype._get = function (cb) {
  var self = this;
  var result = {
    status: 'on',
    id: self.id,
    result: {},
    time: {}
  };

  logger.debug('Called _get():', self.id);

  result.result[self.dataType] = self.parent.getValue(self);

  self.emit('data', result);
};

SoftDCSBaseSensor.prototype._enableChange = function () {
};

SoftDCSBaseSensor.prototype._clear = function () {
};

module.exports = SoftDCSBaseSensor;
