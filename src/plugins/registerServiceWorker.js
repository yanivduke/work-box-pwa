'use strict';
import { register } from 'register-service-worker'

const sendMsg = function(msg, handleChannelMessage) {
  console.log('before sending msssage.')
  navigator.serviceWorker.ready.then(function(reg) {
    // set up a message channel to communicate with the SW
    console.log(' sending msssage 1: ')
    var channel = new MessageChannel();
    console.log(' sending msssage 2: ')
    channel.port1.onmessage = function(e) {
      console.log(e);
      console.log(' sending msssage 3: ' + e)
      handleChannelMessage(e.data);
      console.log(' sending msssage 4: ' + e.data)
    }
    var mySW = reg.active;
    console.log(' sending msssage sucsses: ' + mySW)
    mySW.postMessage(msg, [channel.port2])
  });
}

const reg = function() {
  console.log('reg ervice worker starts.')
  
  register(`${process.env.BASE_URL}mysw.js`, {
    ready () {
      console.log('service worker ready.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
export {reg, sendMsg}