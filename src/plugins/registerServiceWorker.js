'use strict';
import { register } from 'register-service-worker'

const sendMsg = function(msg) {
  console.log('before sending msssage.')
  return new Promise(function(resolve, reject){
      // Create a Message Channel
      var msg_chan = new MessageChannel();
      console.log('inside promise.')
      // Handler for recieving message reply from service worker
      msg_chan.port1.onmessage = function(event){
          if(event.data.error){
              console.log(' sending msssage err: ' + event.data.error)
              reject(event.data.error);
          }else{
              console.log(' sending msssage sucsses: ' + event.data)
              resolve(event.data);
          }
      };

      // Send message to service worker along with port for reply
      navigator.serviceWorker.controller.postMessage(msg, [msg_chan.port2]);
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