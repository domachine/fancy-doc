
/**
 * Module dependencies.
 */

var Index = require('index');

// create index

var index = new Index({
  'lib': [
    { name: 'component-1' },
    { name: 'component-2' }
  ]
});
document.body.appendChild(index.el);
