'use strict';

window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
 
  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
 
  return t;
}(document, "script", "twitter-wjs"));

(function() {

var TWEET_SHOWTIME_MS = 8000;
var RANDOM_TOPICS = [
  'banff',
  'basketball',
  'google',
  'NASA',
  'nba',
  'news',
  'nfl',
  'pluto',
  'science',
  'space',
  'sports',
  'technology',
  'world',
  '#deepdream',
  '#newyorkcity',
  '#nyc',
  '#nba',
  '#science',
  '#SundayFunday',
  '#trump',
  '#yellowstone',
  '#yosemite',
  '@neiltyson',
];
var currentTweets = [];
var currentTweetIndex = -1;


/**
 * Helper function to make a request and return a Promise.
 * @param {string} url
 */
function makeRequest(url) {
  var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var results = xhr.responseText;
        resolve(JSON.parse(results));
      }
    };
    xhr.onerror = function() {
      reject(xhr.statusText);
    };
    xhr.send();
  });
  return promise;
}


/**
 * Searches twitter for the given query and then shows the tweets for
 * the results.
 * @param {string} query
 */
function searchTwitter(query) {
  var searchResults = makeRequest(
      '/twitter/search?q=' + encodeURIComponent(query));
  searchResults.then(function(results) {
    if (results && results.statuses) {
      currentTweets = results.statuses;
      currentTweetIndex = -1;
    }
    maybeShowNextTweet();
  });
}


/**
 * Show the tweet with the given ID on screen.
 * @param {string} id
 */
function showTweet(id) {
  var tweetContainer = document.getElementById('tweet-container');
  tweetContainer.innerHTML = '';
  var promise = twttr.widgets.createTweet(
      id,
      tweetContainer,
      {
        align: 'center',
        linkColor: '#55acee',
	theme: 'dark',
        width: 550
      });
  promise.then(function() {
    // Make sure the tweet is vertically centered.
    var heightPx = tweetContainer.offsetHeight;
    var containerHeightPx = tweetContainer.parentNode.offsetHeight;
    console.log('height px: ' + heightPx);
    console.log('container: ' + containerHeightPx);
    tweetContainer.style.paddingTop =
        ((containerHeightPx - heightPx) / 2) + 'px';
  });
}
window.showTweet = showTweet;


/**
 * Shows the next tweet if there's another one left in the current topic.
 * If the current topic has been exhausted, fetch a new random topic and
 * show the tweets for that topic.
 */
function maybeShowNextTweet() {
  if (currentTweetIndex < currentTweets.length && currentTweets.length > 0) {
    var tweet = currentTweets[++currentTweetIndex];
    if (!tweet || !tweet.id_str) {
      return;
    }
    if (isChromecastInitialized()) {
      sendChromecastMessage(JSON.stringify({
        id: tweet.id_str
      }));
    }
    showTweet(tweet.id_str);
  } else {
    var randomIndex = Math.floor(Math.random() * RANDOM_TOPICS.length);
    var newTopic = RANDOM_TOPICS[randomIndex];
    document.getElementById('twitter_query').value = newTopic;
    searchTwitter(newTopic);
  }
}
window.maybeShowNextTweet = maybeShowNextTweet;


/**
 * Sets up a timer that schedules the tweet to be rotated every so often.
 */
function scheduleTweetRotation() {
  window.setTimeout(function() {
    maybeShowNextTweet();
    scheduleTweetRotation();
  }, TWEET_SHOWTIME_MS);
}
window.scheduleTweetRotation = scheduleTweetRotation;

})();
