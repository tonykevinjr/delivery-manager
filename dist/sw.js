const CACHE='delivery-manager-v0.12.0';
const ASSETS=['./batch-priority.js?v=0.12.0','./workflow.js?v=0.12.0','./local-route.js?v=0.12.0','./catering-share.js?v=0.12.0','./cloud-scan.js?v=0.12.0','./field-tools.js?v=0.12.0','./photo-tools.js?v=0.12.0','./scanner-ui.js?v=0.12.0','./business-model.js?v=0.12.0','./business-report.js?v=0.12.0','./cost-model.js?v=0.12.0','./cost-lab.js?v=0.12.0','./','./index.html','./style.css?v=0.12.0','./app.js?v=0.12.0','./domain.js?v=0.12.0','./demo.js?v=0.12.0','./storage.js?v=0.12.0','./updates.js?v=0.12.0','./config.js?v=0.12.0','./icon.svg','./bag-icon-180-v2.png','./bag-icon-192-v2.png','./bag-icon-512-v2.png','./manifest.webmanifest','./scan.js?v=0.12.0','./push.js?v=0.12.0','./analytics.js?v=0.12.0','./report-charts.js?v=0.12.0'];
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
  if((url.pathname.includes('/vendor/ocr/')||url.pathname.endsWith('/data/seattle-addresses.json'))){const cached=await caches.match(request);if(cached)return cached;}
  try{const response=await fetch(request,{cache:'no-store'});if(response.ok){if((url.pathname.includes('/vendor/ocr/')||url.pathname.endsWith('/data/seattle-addresses.json'))){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}return response;}}catch{}
  const cache=await caches.open(CACHE),cached=await cache.match(request);
  if(cached)return cached;
  if(request.mode==='navigate')return await cache.match(new URL('index.html',self.registration.scope));
  const previous=await caches.match(request);return previous||Response.error();
 })());
});

self.addEventListener('push',event=>event.waitUntil((async()=>{
 let test=false,run=false;try{const data=event.data?.json();test=data?.test===true;run=data?.kind==='run';}catch{}
 await self.registration.showNotification(test?'Delivery Manager test':run?'Back at the restaurant?':'Remember to finish your shift',{
  body:test?'Lock-screen reminders are connected.':run?'Your deliveries are complete. When you’re back, open Delivery Manager and tap End Run.':'Record your ending mileage and prepare Mike’s report. Still working? Open the app to snooze.',
  icon:new URL('bag-icon-192-v2.png',self.registration.scope).href,
  badge:new URL('bag-icon-192-v2.png',self.registration.scope).href,
  tag:test?'delivery-manager-test':run?'delivery-manager-run':'delivery-manager-eos',
  data:{url:new URL(run?'?notification=run':'?notification=eos',self.registration.scope).href,kind:run?'run':'eos'}
 });
})()));
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{
 const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of windows)if(client.url.startsWith(self.registration.scope)){await client.focus();client.postMessage({type:event.notification.data?.kind==='run'?'open-run':'open-eos'});return;}
 await self.clients.openWindow(event.notification.data?.url||new URL('?notification=eos',self.registration.scope).href);
})());});
