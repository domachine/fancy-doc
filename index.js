
/**
 * Module dependencies.
 */

var express = require('express');

// create application

var app = module.exports = express();
app.use(require('project-view'));
app.use(express.static('public'));
