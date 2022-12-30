const cache_version = 'v0.1.0'
assets = [
//TODO : all what you need
    "/",
    "/Registed.html",
    "/Registeration.html",
    "/Session.html",
    "/index.html",
    "/app.js",
    "/face-api.min.js",
    "/models/face_landmark_68_model-shard1",
    "/models/face_landmark_68_model-weights_manifest.json",
    "/models/face_recognition_model-shard1",
    "/models/face_recognition_model-shard2",
    "/models/face_recognition_model-weights_manifest.json",
    "/models/ssd_mobilenetv1_model-shard1",
    "/models/ssd_mobilenetv1_model-shard2",
    "/models/ssd_mobilenetv1_model-weights_manifest.json",
    "/models/mtcnn_model-shard1",
    "/models/mtcnn_model-weights_manifest.json",
    "/models/tiny_face_detector_model-shard1",
    "/models/tiny_face_detector_model-weights_manifest.json",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
    "https://code.jquery.com/jquery-3.1.1.js",
    "https://cdn.jsdelivr.net/npm/idb@7/build/umd.js",
    "/favicon.ico",


]

self.addEventListener('install',
    (event) => {
        console.log('install event')
        event.waitUntil(
            caches.open(cache_version).then(
                async cache => {
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
                        keys.filter(key => key !== cache_version).map(
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