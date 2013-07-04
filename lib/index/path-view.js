
/**
 * Module dependencies.
 */

var domify = require('domify')
  , query = require('query')
  , reactive = require('reactive')
  , each = require('each')
  , template = require('./template');

/**
 * Module exports.
 */

module.exports = PathView;

/**
 * Initialize new path view.
 */

function PathView(path, components) {
  var self = true
    , el = this.el = domify(template)
    , li = query('li', el)
    , span = query('span', el)
    , ul = query('ul', el);

  // remove template from actual list

  ul.removeChild(li);
  reactive(span, { path: path });
  each(components, function(component){
    var template = li.cloneNode(true);
    ul.appendChild(template);
    reactive(template, component);
  });
}
