
/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , express = require('express')
  , nconf = require('nconf')
  , async = require('async')
  , groupBy = require('group-by')
  , Project = require('project')

  // symbol imports

  , waterfall = async.waterfall
  , parallel = async.parallel;

/**
 * Module exports.
 */

// create application.

var app = module.exports = express();
app.set('view engine', 'jade');
app.set('views', __dirname);

/**
 * GET the info of the project.
 */

app.get('/', function(req, res, next){
  if (req.accepts('text, json') === 'text') return next();
  var root = nconf.get('project')
  , project = new Project(root);
  project.init(function(err, project){
    if (err) return next(err);
    project.modules(function(err, modules){
      if (err) next(err);
      if (err) return next(err);
      modules = groupBy(modules, 'path');
      return res.send({
        components: modules,
        project: project.name
      });
    });
  });
});

/**
 * GET the root readme.
 */

app.get('/', function(req, res, next){
  res.render('index');
});

/**
 * GET the documentation for the project or submodule.
 */

app.get('/docs/:path([a-z0-9_/-]+)', function(req, res, next){
  var path = req.params.path
    , root = nconf.get('project')
    , project = new Project(root);
  project.init(function(err, project){
    if (err) return next(err);
    project.doc(path, function(err, path, content){
      if (err) content = null;
      return res.send(content);
    });
  });
});
