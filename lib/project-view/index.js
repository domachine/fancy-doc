
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
  , groupBy = require('group-by')
  
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
  res.redirect('/projects/' + req.params.name + '/docs/index');
});

/**
 * GET the documentation for the project or submodule.
 */

app.get('/projects/:name/docs/:path([a-z0-9_/-]+)', function(req, res, next){
  var name = req.params.name
    , path = req.params.path;
  waterfall(
    [
      projects.get.bind(projects, name),
      function(project, next){
        project.doc(path, function(err, path, content){
          if (err) content = null;
          else content = marked(content);
          next(null, project, content);
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
      var ctx;
      modules = groupBy(modules, 'path');
      ctx = {
        project: project,
        modules: modules,
        readme: doc
      };
      return res.render('index', ctx);
    }
  );
});
