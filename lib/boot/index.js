
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
 * GET the root readme.
 */

app.get('/', function(req, res, next){
  res.render('index');
});

/**
 * GET the modules of the project.
 */

app.get('/modules', function(req, res, next){
  waterfall(
    [
      function(next){
        var root = nconf.get('project')
          , project = new Project(root);
        project.init(next);
      },
      function(project, next){
        project.modules(function(err, modules){
          if (err) next(err);
          next(null, modules);
        });
      }
    ], function(err, modules) {
      if (err) return next(err);
      modules = groupBy(modules, 'path');
      return res.send(modules);
    }
  );
});

/**
 * GET the documentation for the project or submodule.
 */

app.get('/docs/:path([a-z0-9_/-]+)', function(req, res, next){
  var path = req.params.path;
  waterfall(
    [
      function(next){
        var root = nconf.get('project')
          , project = new Project(root);
        project.init(next);
      },
      function(project, next){
        project.doc(path, function(err, path, content){
          if (err) content = null;
          next(null, content);
        });
      }
    ], function(err, doc) {
      if (err) return next(err);
      return res.send(doc);
    }
  );
});
