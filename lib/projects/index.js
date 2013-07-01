
/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , nconf = require('nconf')
  , Project = require('models/project')
  
  // symbol imports
  
  , readdir = fs.readdir
  , join = path.join;

/**
 * Module exports.
 */

/**
 * Loads all project models.
 *
 * @param {Function} fn function(err, projects)
 */

exports.all = function(fn){
  var root = nconf.get('projects');
  readdir(root, function(err, dirs){
    if (err) return fn(err);
    var projects = [];

    // collect project information

    async.mapSeries(
      dirs.sort(),
      function(dir, next){
        new Project(dir).init(next);
      },
      function(err, projects){
        if (err) return fn(err);
        fn(null, projects);
      }
    );
  });
};

/**
 * Load the project `name`.
 */

exports.get = function(name, fn){
  var root = nconf.get('projects')
    , projectPath = join(root, name)
    , project = new Project(projectPath);
  project.init(fn);
};
