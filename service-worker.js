var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-final-1';

var filesToCache = [
    '/forecast/',
    '/forecast/index.html',
    '/forecast/scripts/app.js',
    '/forecast/styles/inline.css',
    '/forecast/images/clear.png',
    '/forecast/images/cloudy-scattered-showers.png',
    '/forecast/images/cloudy.png',
    '/forecast/images/fog.png',
    '/forecast/images/ic_add_white_24px.svg',
    '/forecast/images/ic_refresh_white_24px.svg',
    '/forecast/images/partly-cloudy.png',
    '/forecast/images/rain.png',
    '/forecast/images/scattered-showers.png',
    '/forecast/images/sleet.png',
    '/forecast/images/snow.png',
    '/forecast/images/thunderstorm.png',
    '/forecast/images/wind.png'
];
self.addEventListener('install',function(e){
    console.log('[service worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[service worker] Caching app shell');
            return cache.addAll(filesToCache);
        })

    );
});
self.addEventListener('activate',function(e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if(key  !== cacheName && key !==dataCacheName){
                    console.log(' [ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});
self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] fetch ',e.request.url);
    var dataUrl='https://query.yahooapis.com/v1/public/yql';
    if(e.request.url.indexOf(dataUrl) > -1){
        e.respondWith(
            caches.open(dataCacheName).then(function(cache){
                return fetch(e.request).then(function(response){
                    cache.put(e.request.url,response.clone());
                    return response;
                });
            })
        );
    }else{
        e.respondWith(
            caches.match(e.request).then(function(response){
                return response || fetch(e.request);
            })
        );
    }
})
