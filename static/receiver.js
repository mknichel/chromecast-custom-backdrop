'use strict';

/**
 * @fileoverview JavaScript for the receiver page to handle incoming messages
 * from the sender page and then display the tweet on the screen.
 */


(function() {

window.onload = function() {
  cast.receiver.logger.setLevelValue(0);
  var castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  console.log('Starting Receiver Manager');

  castReceiverManager.onReady = function(event) {
    console.log('Received Ready event: ' + JSON.stringify(event.data));
    castReceiverManager.setApplicationState('Application status is ready...');
  };
      
  castReceiverManager.onSenderConnected = function(event) {
    console.log('Received Sender Connected event: ' + event.data);
    console.log(castReceiverManager.getSender(event.data).userAgent);
  };
      
  castReceiverManager.onSenderDisconnected = function(event) {
    console.log('Received Sender Disconnected event: ' + event.data);
    if (castReceiverManager.getSenders().length == 0) {
      window.close();
    }
  };

  // This message bus handles the interaction between the sender page and
  // this receiver page. The namespaces must match.
  var messageBus = castReceiverManager.getCastMessageBus(
      'urn:x-cast:mknichel.custom.backdrop');

  messageBus.onMessage = function(event) {
    console.log('Message [' + event.senderId + ']: ' + event.data);
    try {
      console.log('Tweet ID: ' + event.data);
      var data = JSON.parse(event.data);
      window.showTweet(data.id);
      // Inform all senders on the CastMessageBus of the incoming message event
      // sender message listener will be invoked
      messageBus.send(event.senderId, event.data);
      castReceiverManager.setApplicationState(event.data);
    } catch (e) {
      messageBus.send(event.senderId, 'Failure: ' + e);
    }
  }

  castReceiverManager.start({statusText: 'Application is starting'});
  console.log('Receiver Manager started');
};

})();
