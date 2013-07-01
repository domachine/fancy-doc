
/**
 * Module dependencies.
 */

var program = require('commander')
  , nconf = require('nconf');

// usage

program
  .version(require('./package').version)
  .option('-p, --port <port>', 'the port to listen to', 3000)
  .option(
    '-r, --root <project-root>',
    'path to the directory where the projects reside',
    '..'
  );

// parse command line

var args = process.argv.slice();
args[1] = 'fancy-doc';
program.parse(args);

// create configuration

nconf.set('port', program.port);
nconf.set('projects', program.root);

// instantiate application

var app = require('./index');
app.listen(program.port, function(){
  console.log('Express server listening on port ' + program.port);
});
