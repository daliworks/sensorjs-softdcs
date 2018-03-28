'use strict';

var util = require('util');

var SensorLib = require('../index');
var Actuator = SensorLib.Actuator;
var _ = require('lodash');
var logger = Actuator.getLogger();
var SoftDCSBase = require('../softDCSBase');

function SoftDCSBaseActuator(sensorInfo, options) {
  var self = this;
  var tokens;

  Actuator.call(self, sensorInfo, options);

  tokens = self.id.split('-');
  self.address = tokens[1].split(':')[0];
  self.port = tokens[1].split(':')[1];
  self.field = tokens[2];
  self.lastTime = 0;
  
  if (sensorInfo.model) {
    self.model = sensorInfo.model;
  }

  self.dataType = SoftDCSBaseActuator.properties.dataTypes[self.model][0];
 
  try {
    self.parent = SoftDCSBase.create(self.address, self.port);
    self.parent.register(self);
  }
  catch(err) {
    logger.error(err);
  }
}

SoftDCSBaseActuator.properties = {
  supportedNetworks: ['softDCS-base-modbus-tcp'],
  dataTypes: {
    softDCSDemandReset: ['powerSwitch']
  },
  models: [
    'softDCSDemandReset'
  ],
  commands: {
    softDCSDemandReset: [ 'on', 'off' ]
  },
  discoverable: false,
  addressable: true,
  recommendedInterval: 60000,
  maxInstances: 1,
  maxRetries: 8,
  idTemplate: '{gatewayId}-{deviceAddress}-{sequence}',
  category: 'actuator'
};

util.inherits(SoftDCSBaseActuator, Actuator);

function sendCommand(actuator, cmd, options, cb) {
  if (_.isFunction(options)) {
    cb = options;
    options = null;
  }

  logger.trace('sendCommand : ', actuator.deviceAddress, actuator.sequence, cmd, options);
 
  try {
    var settings = JSON.parse(options.settings);
    logger.trace('Settings : ', settings);

    cb(undefined, 'Success!');
  }
  catch(err) {
    cb('Invalid JSON format', err);
  }
}

SoftDCSBaseActuator.prototype._set = function (cmd, options, cb) {
  var self = this;

  try{
    switch (self.field) {
    case 'demandReset' : self.parent.emit('demandReset', cb);
    }
  }
  catch(err) {
    return cb && cb(err);
  }

}

SoftDCSBaseActuator.prototype._get = function (cb) {
  var self = this;
  var result = {
    status: 'on',
    id: self.id,
    result: {},
    time: {}
  };

  logger.debug('Called _get():', self.id);

  result.result[self.dataType] = 'off';

  self.emit('data', result);
};

SoftDCSBaseActuator.prototype.getStatus = function () {
  var self = this;

  self.myStatus = 'on';

  return self.myStatus;
};

SoftDCSBaseActuator.prototype.connectListener = function () {
  var self = this;

  self.myStatus = 'on';
};

SoftDCSBaseActuator.prototype.disconnectListener = function () {
  var self = this;

  var rtn = {
    status: 'off',
    id: self.id,
    message: 'disconnected'
  };

  self.myStatus = 'off';
  self.emit('data', rtn);
};

module.exports = SoftDCSBaseActuator;
