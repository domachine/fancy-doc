
/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , Batch = require('batch')
  
  // symbol imports

  , readFile = fs.readFile
  , readdir = fs.readdir
  , join = path.join
  , resolve = path.resolve
  , basename = path.basename;

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
  this.dir = resolve(dir);
  this.basename = basename(dir);
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
    self.paths = config.paths;
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
  if (!this.paths) return fn(null, []);
  var batch = new Batch()
    , components = [];
  batch.concurrency(2);
  this.paths.forEach(function(path){
    batch.push(function(next){
      var modulePath = join(self.dir, path);
      readdir(modulePath, function(err, dirs){
        if (err) return next(err);
        var batch = new Batch();
        batch.concurrency(4);
        dirs.forEach(function(dir){
          batch.push(function(next){

            // skip directories contained in the paths array

            if (self.pathsContain(join(path, dir))) return next();
            var project = new Project(join(modulePath, dir), path);
            project.init(function(err, project){

              // skip modules which cannot be parsed

              if (err) return next();
              next(null, project);
            });
          });
        });
        batch.end(next);
      });
    });
  });
  batch.end(function(err, components){
    if (err) return fn(err);

    // the array must be flattened.

    components = components.reduce(function(memo, x){
      return memo.concat(x.filter(function(a){ return !!a; }));
    }, []);
    fn(null, components);
  });
};

/**
 * Read the configuration of the project.
 *
 * @api private
 */

Project.prototype.config = function(fn){
  var self = this;
  async.detect(
    [
      join(this.dir, 'component.json'),
      join(this.dir, 'package.json')
    ],
    fs.exists,
    function(configFile){
      var basename;
      basename = path.basename(self.dir);
      if (!configFile) {

        // if there is no configuration file we use the directory name as
        // module name

        if (basename.substr(-3) !== '.js') {
          return fn(null, { name: basename });
        } else {
          return fn(new Error('Not a module: ' + self.dir));
        }
      }
      readFile(configFile, function(err, content){
        if (err) return fn(err);
        parseJSON(content, function(err, config){
          if (err) return fn(err);
          if (!config.name) config.name = basename;
          fn(null, config);
        });
      });
    }
  );
};

/**
 * Check if the project paths contain `path`.
 *
 * @api private
 */

Project.prototype.pathsContain = function(path){
  var abs
    , dir = this.dir;
  abs = this.paths.map(function(path){
    return resolve(dir, path);
  });
  return abs.indexOf(resolve(dir, path)) !== -1;
};

/**
 * Parse json `content` asynchronously.
 *
 * @api private
 */

function parseJSON(content, fn) {
  var config;

  // parse content as JSON

  try {
    config = JSON.parse(content);
  } catch(x) {
    return fn(x);
  }
  fn(null, config);
}
