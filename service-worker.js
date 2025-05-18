// 缓存名称和版本
const CACHE_NAME = 'caichan-cache-v1';

// 需要缓存的资源列表
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdn.jsdelivr.net/npm/alpinejs@3.13.0/dist/cdn.min.js',
    'https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// 安装Service Worker
self.addEventListener('install', event => {
    // 跳过等待，直接激活
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('缓存打开成功');
                return cache.addAll(CACHE_ASSETS);
            })
    );
});

// 激活Service Worker
self.addEventListener('activate', event => {
    // 立即接管所有客户端
    event.waitUntil(clients.claim());
    
    // 清理旧版本缓存
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    // 网络优先策略
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                // 网络请求失败时，从缓存中获取
                return caches.match(event.request);
            })
    );
});
