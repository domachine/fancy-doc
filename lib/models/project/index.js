
/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , async = require('async')
  
  // symbol imports

  , readFile = fs.readFile
  , readdir = fs.readdir
  , join = path.join
  , each = async.each;

/**
 * Module exports.
 */

module.exports = Project;

/**
 * Instantiate new project.
 *
 * @param {String} dir
 * @param {String} [path] module path if this is a submodule
 *
 * @api private
 */

function Project(dir, path) {
  this.dir = dir;
  this.path = path;
}

/**
 * Since the configuration is read asynchronously we need an asynchronously
 * initialization method.
 *
 * @api private
 */

Project.prototype.init = function(fn){
  var self = this;
  this.config(function(err, config){
    if (err) return fn(err);
    self.name = config.name;
    fn(null, self);
  });
};

/**
 * Retrieve documentation for specific module.
 *
 * @param {Function} fn function(err, path, content)
 */

Project.prototype.doc = function(path, fn){
  if (path === 'index') path = '.';
  path = join(this.dir, path, 'Readme.md');
  readFile(path, function(err, content){
    if (err) return fn(err);
    fn(null, path, content.toString());
  });
};

/**
 * Retrieve the modules included in this project.
 */

Project.prototype.modules = function(fn){
  var self = this;
  this.config(function(err, config){
    if (err) return fn(err);
    if (!config.paths) return fn(null, []);
    var modules = [];
    each(
      config.paths,
      function(path, next){
        var modulePath = join(self.dir, path);

        // traverse each path to find the submodules

        readdir(modulePath, function(err, dirs){
          if (err) return fn(err);
          each(
            dirs,
            function(dir, next){
              var project = new Project(join(modulePath, dir), path);
              project.init(function(err, project){

                // skip modules which cannot be parsed

                if (err) return next();
                modules.push(project);
                next();
              });
            },
            next
          );
        });
      },
      function(err){
        if (err) return fn(err);
        fn(null, modules);
      }
    );
  });
};

/**
 * Read the configuration of the project.
 *
 * @api private
 */

Project.prototype.config = function(fn){
  readFile(join(this.dir, 'component.json'), function(err, content){
    if (err) return fn(err);
    var config
      , modules;

    // parse content as JSON

    try {
      config = JSON.parse(content);
    } catch(x) {
      return fn(x);
    }
    fn(null, config);
  });
};
