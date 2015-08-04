"use strict";

/**
 * @fileoverview Functions to interact with the Chromecast API.
 */

(function() {

var applicationID = '6FCF64A8';
var namespace = 'urn:x-cast:mknichel.custom.backdrop';
var session = null;
var castInitialized = false;

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}


/**
 * Initialize the Chromecast API and request a session. This will cause the
 * dialog to appear from the Chromecast extension.
 */
function initializeCastApi() {
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

/**
 * On initialization success,
 */
function onInitSuccess() {
  console.log('Chromecast Initialized!');
  castInitialized = true;
}


/**
 * Returns whether the Chromecast is initialized and ready to use.
 */
function isChromecastInitialized() {
  return castInitialized;
}
window.isChromecastInitialized = isChromecastInitialized;


/**
 * Generic onError callback that logs the message but does nothing else.
 */
function onError(message) {
  console.log(message);
}

/**
 * Generic success callback that logs the message.
 */
function onSuccess(message) {
  console.log(message);
}

/**
 * 
 */
function sessionListener(e) {
  session = e;
  session.addUpdateListener(sessionUpdateListener);  
  session.addMessageListener(namespace, receiverMessage);
}


/**
 * Function that listens for changes to the session and updates internal
 * state accordingly.
 */
function sessionUpdateListener(isAlive) {
  if (!isAlive) {
    session = null;
  }
};


/**
 * Utility function to log messages from the receiver.
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message) {
  console.log('Receiver: ' + namespace + message);
};


/**
 * Function that listens to changes in status of the receiver.
 */
function receiverListener(e) {
  console.log('Receiver: ' + e);
}


/**
 * Send a message to the receiver.
 * @param {string} message A message string
 */
function sendMessage(message) {
  if (session != null) {
    session.sendMessage(
        namespace, message,
        onSuccess.bind(this, "Message sent: " + message), onError);
  } else {
    chrome.cast.requestSession(function(e) {
      session = e;
      session.sendMessage(
          namespace, message,
          onSuccess.bind(this, "Message sent: " + message), onError);
    }, onError);
  }
}
window.sendChromecastMessage = sendMessage;

})();
