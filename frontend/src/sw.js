const CACHE_NAME = "laundry-booking-v1"

const CACHED_FILES = ["/frontend/index.html", "/manifest.json"]

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME)).then((cache) => {
        cache.addAll(CACHED_FILES)
    })
})

self.addEventListener('activate', (e) => {
    caches.keys().then((cacheNames) => {
        cacheNames.forEach((name) => {
            if(name !== CACHE_NAME) {
                caches.delete(name)
            }
        })
    })
})

self.addEventListener('fetch', async (e) => {
    const {request} = e

    try{
        const networkResponse = await fetch(request)
        if(networkResponse.ok) {
            return networkResponse
        }
    } catch(err) {
        const cachedReponse = await caches.match(request)
        if(cachedReponse) {
            return cachedReponse
        }
    }
})
