
/**
 * Module dependencies.
 */

var express = require('express');

// create application

var app = module.exports = express();
app.use(express.favicon());

// mount boot component

app.use(require('boot'));
app.use(express.static('public'));
