
/**
 * Module dependencies.
 */

var marked = require('marked')
  , domify = require('domify');

/**
 * Module exports.
 */

module.exports = Readme;

/**
 * Initialize new readme.  Renders the content and attaches the
 * resulting element to `this.el`.
 */

function Readme(content) {
  var el = this.el = document.createElement('div');
  el.id = 'readme';
  el.appendChild(domify(marked(content) || '<p></p>'));
}
