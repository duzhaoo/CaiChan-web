// 缓存名称和版本
const CACHE_NAME = 'caichan-cache-v1';

// 需要缓存的资源列表
const CACHE_ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './manifest.json',
    './icons/icon192.png',
    './icons/icon512.png',
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
    // 缓存优先策略，适合移动设备
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // 如果在缓存中找到响应，则返回缓存的响应
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // 否则尝试从网络获取
                return fetch(event.request)
                    .then(response => {
                        // 检查是否收到有效响应
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // 克隆响应，因为响应是流，只能使用一次
                        const responseToCache = response.clone();
                        
                        // 将新响应添加到缓存
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                            
                        return response;
                    });
            })
    );
});
