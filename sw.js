const shell_cache = 'shell_cache'
assets = [
    // all what you need
]

self.addEventListener('install',
    (event) => {
        console.log('install event')
        event.waitUntil(
            caches.open(shell_cache).then(
                cache => {
                    console.log("caching all assets ")
                    cache.addAll(assets)
                    console.log("assets cached")
                }
            )
        )
    }
)

self.addEventListener("activate",
    (event) => {
        console.log("activate event")
        event.waitUntil(
            caches.keys().then(
                (keys) => {
                    return Promise.all(
                        keys.filter(key => key !== shell_cache).map(
                            key => caches.delete(key)
                        )
                    )
                }
            )
        )
    }
)

self.addEventListener('fetch',
    (event) => {
        console.log('fetch event')
        event.respondWith(
            caches.match(event.request).then(
                (cache_match_result) => {
                    return cache_match_result || fetch(event.request)
                }
            )
        )
    }
)

self.addEventListener("Registe",
    (event)=>{
        console.log(event)
    }
)


console.log(self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }))