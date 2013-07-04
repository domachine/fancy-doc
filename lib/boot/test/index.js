
/**
 * Module dependencies.
 */

var supertest = require('supertest')
  , should = require('should')
  , sinon = require('sinon')
  , Project = require('project')
  , nconf = require('nconf')
  , app = require('..')

  // symbol imports

  , stub = sinon.stub;

/**
 * Tests.
 */

describe('Boot', function(){
  before(function(){
    nconf.set('project', 'testdir');
    Project.prototype.config = stub().callsArgWith(0, null, {
      name: 'test'
    });
    Project.prototype.modules = function(done){
      return done(null, [
        { name: 'mod1', path: 'lib' },
        { name: 'mod2', path: 'lib/modules' }
      ]);
    };
    Project.prototype.doc = function(path, done){
      return done(null, path, 'My *test* /doc/');
    };
  });
  describe('GET /modules', function(){
    it('should render the corresponding modules', function(done){
      supertest(app)
        .get('/modules')
        .expect(
          {
            'lib': [
              { name: 'mod1', path: 'lib' }
            ],
            'lib/modules': [
              { name: 'mod2', path: 'lib/modules' }
            ]
          },
          done
        );
    });
  });
  describe('GET /docs/:path', function(){
    it('should send the readme content', function(done){
      supertest(app)
        .get('/docs/index')
        .expect(
          'My *test* /doc/',
          done
        );
    });
  });
});
