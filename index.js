/**
 * @fileoverview This file runs the main server for the custom Chromecast
 * backdrop.
 */

// Initialize the application and load all the given modules.
var express = require('express');
var OAuth2 = require('oauth').OAuth2; 
var Twitter = require('twitter-node-client').Twitter;
var https = require('https');
var app = express();
var config = require('./secret');
var twitter = new Twitter(config);
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Server running on port ' + port);
});

// Grab a Twitter authentication token using the provided consumer application
// key and secret. This is an "application token" and will be used on all
// requests, but does not grant any priveleges to fetch user data.
var token = null;
var oauth2 = new OAuth2(
    config.consumerKey,
    config.consumerSecret,
    'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
  'grant_type': 'client_credentials'
}, function (e, access_token) {
  token = access_token;
});


// Initialize the server end points.
app.use(express.static('static'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/chromecast-backdrop.html');
});

app.get('/receiver.html', function(req, res) {
  res.sendFile(__dirname + '/receiver.html');
});

app.get('/twitter/search', function (req, res) {
  console.log('Query: ' + req.query.q);
  var options = {
    hostname: 'api.twitter.com',
    path: '/1.1/search/tweets.json?result_type=popular&count=5&q=' + encodeURIComponent(req.query.q),
    headers: {
      Authorization: 'Bearer ' + token
    }
  };

  https.get(options, function(result){
    var buffer = '';
    result.setEncoding('utf8');
    result.on('data', function(data){
      buffer += data;
    });
    result.on('end', function(){
      var tweets = JSON.parse(buffer);
      res.send(tweets);
    });
  });
});
