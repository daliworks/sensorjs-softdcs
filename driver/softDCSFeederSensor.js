'use strict';

var util = require('util');

var SensorLib = require('../index');
var Sensor = SensorLib.Sensor;
var logger = Sensor.getLogger('Sensor');
var SoftDCSFeeder = require('../softDCSFeeder');

function SoftDCSFeederSensor(sensorInfo, options) {
  var self = this;
  var tokens;

  Sensor.call(self, sensorInfo, options);

  tokens = self.id.split('-');
  self.address = tokens[1].split(':')[0];
  self.port = tokens[1].split(':')[1];
  self.feedId = tokens[1].split(':')[2]
  self.field = tokens[2];

  self.parent = SoftDCSFeeder.create(self.address, self.port, self.feedId);

  if (sensorInfo.model) {
    self.model = sensorInfo.model;
  }

  self.dataType = SoftDCSFeederSensor.properties.dataTypes[self.model][0];

  self.parent.registerField(self);
}
util.inherits(SoftDCSFeederSensor, Sensor);

SoftDCSFeederSensor.properties = {
  supportedNetworks: ['softdcs-pv'],
  dataTypes: {
    'softDCSFeederType' : ['string'],
    'softDCSVoltage' : ['voltage'],
    'softDCSCurrent' : ['current'],
    'softDCSPower' : ['electricPower'],
    'softDCSReactivePower' : ['electricPower'],
    'softDCSApparentPower' : ['electricPower'],
    'softDCSEnergy' : ['electricEnergy'],
    'softDCSReactiveEnergy' : ['electricEnergy'],
    'softDCSApparentEnergy' : ['electricEnergy'],
    'softDCSPowerFactor' : ['powerFactor'],
    'softDCSLeakageCurrent' : ['current'],
    "softDCSPFAverage" : ['powerFactor'],
    "softDCSVoltageUnbalance" : ['percent'],
    "softDCSCurrentUnbalance" : ['percent'],
    "softDCSTHDAverage" : ['percent'],
    "softDCSPowerTHD" : ['percent'],
    "softDCSPhase"  : ['number']  ,
    "softDCSDemandCurrent" : ['current'],
    "softDCSDemandMaxCurrent" : ['current'],
    "softDCSDemandPower" : ['electricPower'],
    "softDCSDemandMaxPower" : ['electricPower'],
    "softDCSDemandPredictionPower" : ['electricPower']
  },
  discoverable: false,
  addressable: true,
  recommendedInterval: 60000,
  maxInstances: 32,
  maxRetries: 8,
  idTemplate: '{gatewayId}-{deviceAddress}-{sequence}',
  models: [
    'softDCSFeederType',
    'softDCSVoltage',
    'softDCSCurrent',
    'softDCSEnergy',
    'softDCSReactiveEnergy',
    'softDCSApparentEnergy',
    'softDCSPower',
    'softDCSReactivePower',
    'softDCSApparentPower',
    'softDCSPowerFactor',
    'softDCSLeakageCurrent',
    'softDCSPFAverage',
    'softDCSVoltageUnbalance',
    'softDCSCurrentUnbalance',
    'softDCSTHDAverage',
    'softDCSPowerTHD',
    'softDCSPhase',
    'softDCSDemandCurrent',
    'softDCSDemandMaxCurrent',
    'softDCSDemandPower',
    'softDCSDemandMaxPower',
    'softDCSDemandPredictionPower'
  ],
  category: 'sensor'
};


SoftDCSFeederSensor.prototype._get = function (cb) {
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

SoftDCSFeederSensor.prototype._enableChange = function () {
};

SoftDCSFeederSensor.prototype._clear = function () {
};

module.exports = SoftDCSFeederSensor;
