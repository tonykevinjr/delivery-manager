const CACHE='delivery-manager-v0.4.8';
const ASSETS=['./','./index.html','./style.css?v=0.4.8','./app.js?v=0.4.8','./domain.js?v=0.4.8','./demo.js?v=0.4.8','./storage.js?v=0.4.8','./updates.js?v=0.4.8','./icon.svg','./bag-icon-180-v2.png','./bag-icon-192-v2.png','./bag-icon-512-v2.png','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 for(const path of ASSETS){const request=new Request(new URL(path,self.registration.scope),{cache:'reload'}),response=await fetch(request);if(!response.ok)throw Error('App download failed');await cache.put(request,response);}
 // All app data is persisted independently. Take over requests without reloading any open form.
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 // Retain the previous app caches for older open pages. Never touch IndexedDB.
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith((async()=>{
  try{const response=await fetch(request,{cache:'no-store'});if(response.ok)return response;}catch{}
  const cache=await caches.open(CACHE),cached=await cache.match(request);
  if(cached)return cached;
  if(request.mode==='navigate')return await cache.match(new URL('index.html',self.registration.scope));
  const previous=await caches.match(request);return previous||Response.error();
 })());
});
