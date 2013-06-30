
// simple configuration object which seems to hard to do for nodejitsu

var config = {};

/**
 * Module exports.
 */

// retrieve a value from the configuration

exports.get = function(key){
  return config[key];
};

// set a value in the configuration

exports.set = function(key, value){
  return config[key] = value;
};
