'use strict';

var logger = require('log4js').getLogger('Sensor');

function initDrivers() {
  var softDCSBaseActuator;
  var softDCSBaseSensor;
  var softDCSFeederSensor;

  try {
    softDCSBaseActuator = require('./driver/softDCSBaseActuator');
  } catch(e) {
    logger.error('Cannot load ./driver/softDCSBaseActuator', e);
  }

  try {
    softDCSBaseSensor = require('./driver/softDCSBaseSensor');
  } catch(e) {
    logger.error('Cannot load ./driver/softDCSBaseSensor', e);
  }

  try {
    softDCSFeederSensor = require('./driver/softDCSFeederSensor');
  } catch(e) {
    logger.error('Cannot load ./driver/softDCSFeederSensor', e);
  }

  return {
    softDCSBaseActuator: softDCSBaseActuator,
    softDCSBaseSensor: softDCSBaseSensor,
    softDCSFeederSensor: softDCSFeederSensor
  };
}

function initNetworks() {
  var network;

  try {
    network = require('./network/softdcs-pv');
  } catch (e) {
    logger.error('Cannot load ./network/softdcs-pv', e);
  }

  return {
    'softdcs-pv': network
  };
}

module.exports = {
  networks: ['softdcs-pv'],
  drivers: {
    softDCSBaseActuator: [
      'softDCSDemandReset'
   ],
    softDCSBaseSensor: [
      'softDCSBaseTemperature',
      'softDCSBaseFrequency',
      'softDCSBaseVoltage',
      'softDCSBaseVoltageUnbalance'
    ],
    softDCSFeederSensor: [
      'softDCSFeederType',
      'softDCSVoltage',
      'softDCSCurrent',
      'softDCSPower',
      'softDCSReactivePower',
      'softDCSApparentPower',
      'softDCSEnergy',
      'softDCSReactiveEnergy',
      'softDCSApparentEnergy',
      'softDCSPowerFactor',
      'softDCSLeakageCurrent',
      'softDCSVAR',
      'softDCSVA',
      'softDCSPFAverage',
      'softDCSCurrentUnbalance',
      'softDCSVoltageUnbalance',
      'softDCSTHDAverage',
      'softDCSPowerTHD',
      'softDCSPhase',
      'softDCSDemandCurrent',
      'softDCSDemandMaxCurrent',
      'softDCSDemandPower',
      'softDCSDemandMaxPower',
      'softDCSDemandPredictionPower'
    ]
  },
  initNetworks: initNetworks,
  initDrivers: initDrivers
};

