
/**
 * Module dependencies.
 */

var request = require('superagent')
  , query = require('query')
  , router = require('hash-router')
  , classes = require('classes')
  , Index = require('index')
  , Readme = require('readme');

// build routing table

router.get('', function(path){
  router.dispatch('index');
});
router.get('*', function(path){
  if (!path) path = 'index';
  console.log('request');
  request
    .get('docs/' + path)
    .end(function(err, res){
      if (err) return alert(err);
      var oldReadme = query('#readme')
        , readme = new Readme(res.text);
      if (oldReadme) oldReadme.parentNode.removeChild(oldReadme);
      readme.el.id = 'readme';
      document.body.appendChild(readme.el);
    });
});

// initialize routing

request
  .get('modules')
  .end(function(err, res){
    if (err) return alert(err);
    var index = new Index(res.body);
    index.el.id = 'index';
    document.body.appendChild(index.el);
    router();
  });
