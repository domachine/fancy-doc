
/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , express = require('express')
  , nconf = require('nconf')
  , marked = require('marked')
  , projects = require('projects')
  , async = require('async')
  
  // symbol imports
  
  , exists = fs.existsSync
  , join = path.join
  , readFile = fs.readFile
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

app.get('/projects/:name', function(req, res, next){
  res.redirect('/projects/' + req.params.name + '/index');
});

/**
 * GET the documentation for the project or submodule.
 */

app.get('/projects/:name/:path([a-z0-9_/-]+)', function(req, res, next){
  var name = req.params.name
    , path = req.params.path;
  waterfall(
    [
      projects.get.bind(projects, name),
      function(project, next){
        project.doc(path, function(err, path, content){
          if (err) return next(err);
          next(null, project, marked(content));
        });
      },
      function(project, doc, next){
        project.modules(function(err, modules){
          if (err) next(err);
          next(null, project, doc, modules);
        });
      }
    ], function(err, project, doc, modules) {
      if (err) return next(err);
      if (path === 'index') {
        return res.render('index', {
          project: project.name,
          modules: modules,
          readme: doc
        });
      }
      res.render('module', {
        project: project.name,
        modules: modules,
        readme: doc
      });
    }
  );
});
