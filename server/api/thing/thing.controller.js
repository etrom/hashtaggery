/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
var api = require('instagram-node').instagram();
var instagramAPI = require('./instagramAuth');
var async = require('async');

// Get list of things
exports.index = function(req, res) {
  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};




//instagram-node code
api.use({
  client_id: instagramAPI.clientId,
  client_secret: instagramAPI.clientSecret
});

var redirect_uri = instagramAPI.redirectUri + 'api/things/handleauth';

exports.authorize_user = function(req, res) {
    res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body, 'rar');
      res.send("Didn't work");
    } else {
      // console.log('Yay! Access token is ' + result.access_token);
      // res.redirect('http://localhost:9000/?access_token='+result.access_token);
        res.redirect('/');

    }
  });
};

var results = [];
var pager = function(err, medias, pagination, remaining, limit) {
  console.log('in pager');
  results = results.concat(medias);
  console.log(results.length, 'outer');

  if (results.length >= 180){
    return results;
  }

  if (pagination.next) {
    pagination.next(pager);
  }
}


//search function
exports.search = function(req, res) {
  var search = req.params.hashtag;
  // make this async
  async.series([
    function(callback) {

      var boom = api.tag_media_recent(req.params.hashtag, pager);
      console.log(boom, 'boom')
      if(boom){
        callback(null, boom);
      }
    }
  ], function(results) {
    res.json(200, results);
  });

};

// var param1 = 'foobar'
// function withParams(param1, callback) {
//   console.log('withParams function called')
//   console.log(param1)
//   callback()
// }
// function withoutParams(callback) {
//   console.log('withoutParams function called')
//   callback()
// }
// async.series([
//   function(callback) {
//     withParams(param1, callback)
//   },
//   withoutParams
// ], function(err) {
//   console.log('all functions complete')
// })




function handleError(res, err) {
  return res.send(500, err);
}