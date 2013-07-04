
/**
 * Module dependencies.
 */

var domify = require('domify')
  , each = require('each')
  , PathView = require('./path-view');

/**
 * Module exports.
 */

module.exports = Index;

/**
 * Initialize new index.
 */

function Index(components) {
  var el = this.el = document.createElement('div');
  each(components, function(path, components){
    var view = new PathView(path, components);
    el.appendChild(view.el);
  });
}
