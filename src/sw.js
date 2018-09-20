console.log("my service worker")

importScripts('/js/idb.js');
importScripts('/js/axios.min.js');

self.addEventListener('message', (event) => {
  if (!event.data){
    return;
  }

  switch (event.data) {
    case 'startSync':
      console.log('message accepted on SW!');
      event.ports[0].postMessage("SW Says 'Hello back!'");
      break;
    default:
      // NOOP
      break;
  }
});


workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.networkFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'static',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Day
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  new RegExp('/'),
  workbox.strategies.cacheFirst({
    cacheName: 'html',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Day
      }),
    ],
  }),
);

workbox.routing.registerRoute(/.*(?:googleapis)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'googleapis-cache'
  })
);

workbox.routing.registerRoute(/.*(?:gstatic)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'gstatic-cache'
  })
);


const idbKeyVal = {

  get(dbObjectStore, key) {
    return idb.open('uis-db22', 1).then(db => {
      return db.transaction(dbObjectStore)
        .objectStore(dbObjectStore).get(key);
    })
    .catch(err => {
      console.log('err on get: ' + err)
      return
    });
  },
  set(dbObjectStore, key, val) {
    return idb.open('uis-db22', 1).then(db => {
      const tx = db.transaction(dbObjectStore, 'readwrite');
      tx.objectStore(dbObjectStore).put(val, key);
      return tx.complete;
    }).catch(err => {
      console.log('err on set: ' + err)
      return
    });
  },
  delete(dbObjectStore, key) {
    return idb.open('uis-db22', 1).then(db => {
      const tx = db.transaction(dbObjectStore, 'readwrite');
      tx.objectStore(dbObjectStore).delete(key);
      return tx.complete;
    }).catch(err => {
      console.log('err on delete: ' + err)
      return
    });
  },
  clear(dbObjectStore) {
    return idb.open('uis-db22', 1).then(db => {
      const tx = db.transaction(dbObjectStore, 'readwrite');
      tx.objectStore(dbObjectStore).clear();
      return tx.complete;
    }).catch(err => {
      console.log('err on clear: ' + err)
      return
    });
  },
  keys(dbObjectStore) {
    return idb.open('uis-db22', 1).then(db => {
      const tx = db.transaction(dbObjectStore);
      const keys = [];
      const store = tx.objectStore(dbObjectStore);

      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
}