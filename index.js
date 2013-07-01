
/**
 * Module dependencies.
 */

var fs = require('fs')
  , express = require('express')
  , Builder = require('component-builder')

  // symbol imports

  , writeFile = fs.writeFileSync;

// create application

var app = module.exports = express();
app.use(express.favicon());
app.use(require('project-view'));
app.use(build);
app.use(express.static('public'));

/**
 * Build the components.
 */

function build(req, res, next) {
  var builder = new Builder('.');
  builder.copyAssetsTo('public');
  builder.build(function(err, res){
    if (err) return next(err);
    writeFile('public/app.js', res.require + res.js);
    writeFile('public/app.css', res.css);
    next();
  });
}
