
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
  request
    .get('docs/' + path)
    .end(function(err, res){
      if (err) return alert(err);
      var oldReadme = query('#readme')
        , readme = new Readme(res.text);
      if (oldReadme) oldReadme.parentNode.removeChild(oldReadme);
      document.body.appendChild(readme.el);
    });
});

// initialize routing

request
  .get('')
  .set('Accept', 'application/json')
  .end(function(err, res){
    if (err) return alert(err);
    var index = new Index(res.body.components)
      , projectLink = document.createElement('a');
    projectLink.setAttribute('href', '#');
    classes(projectLink).add('project');
    projectLink.appendChild(document.createTextNode(res.body.project));
    index.el.insertBefore(projectLink, query('span', index.el));
    document.body.appendChild(index.el);
    router();
  });
