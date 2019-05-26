let staticCacheName = 'mws-restaurant-cache-v3';

let filesToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/register_sw.js',
    '/sw.js',
    '/offline.html',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
];


/* Add resources to cache */
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});


/* Remove old caches */

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('mws-restaurant-') &&
                        cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


/**
 * Hijact requests - offline first method used. Inspired by this post:
 * https://stackoverflow.com/questions/47160929/progressive-web-app-uncaught-in-promise-typeerror-failed-to-fetch
 * Serving proper error page if the user is trying to fetch the content that is not available offline. 
 *
 **/

addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response; 			// if valid response is found in cache return it
            } else {
                return fetch(event.request) // fetch from the internet
                    .then(function(res) {
                    	//console.log(res.status);
                        return caches.open(staticCacheName)
                            .then(function(cache) {
                                cache.put(event.request.url, res.clone()); // save the response for the future
                                return res; // return the fetched data
                            })
                    })
                    .catch(function(err) {  // fallback mechanism when trying to fetch the content not available offline
                        return caches.open(staticCacheName)
                            .then(function(cache) {
                                return cache.match('/offline.html');
                            });
                    });
            }
        })
    );
});
