const CACHE='delivery-manager-v0.20.8';
const ASSETS=['./driver-schedule.js?v=0.20.8','./manager-drivers.js?v=0.20.8','./dispatch.js?v=0.20.8','./manager.js?v=0.20.8','./manager.html','./shift-tools.js?v=0.20.8','./oil.js?v=0.20.8','./batch-priority.js?v=0.20.8','./workflow.js?v=0.20.8','./local-route.js?v=0.20.8','./catering-share.js?v=0.20.8','./cloud-scan.js?v=0.20.8','./field-tools.js?v=0.20.8','./photo-tools.js?v=0.20.8','./scanner-ui.js?v=0.20.8','./business-model.js?v=0.20.8','./business-report.js?v=0.20.8','./cost-model.js?v=0.20.8','./cost-lab.js?v=0.20.8','./','./index.html','./style.css?v=0.20.8','./app.js?v=0.20.8','./domain.js?v=0.20.8','./demo.js?v=0.20.8','./storage.js?v=0.20.8','./updates.js?v=0.20.8','./config.js?v=0.20.8','./icon.svg','./bag-icon-180-v2.png','./bag-icon-192-v2.png','./bag-icon-512-v2.png','./manifest.webmanifest','./scan.js?v=0.20.8','./push.js?v=0.20.8','./analytics.js?v=0.20.8','./report-charts.js?v=0.20.8'];
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
 let data;try{data=event.data?.json()||{};}catch{data={};}
 const test=!!data.test,run=data.kind==='run',dispatch=data.kind==='dispatch',mode=dispatch&&data.url?.includes('demo=1')?'test':'live';
 await self.registration.showNotification(dispatch?(mode==='test'?'Test dispatch update from Mike':'Dispatch update from Mike'):test?'Delivery Manager test':run?'Back at the restaurant?':'Remember to finish your shift',{
 body:dispatch?'Open Delivery Manager to receive Mike’s update.':test?'Lock-screen reminders are connected.':run?'Your deliveries are complete. When you’re back, open Delivery Manager and tap End Run.':'Record your ending mileage and prepare Mike’s report. Still working? Open the app to snooze.',
 icon:new URL('bag-icon-192-v2.png',self.registration.scope).href,badge:new URL('bag-icon-192-v2.png',self.registration.scope).href,
 tag:dispatch?'delivery-manager-dispatch-'+mode:test?'delivery-manager-test':run?'delivery-manager-run':'delivery-manager-eos',
 data:{url:new URL(dispatch?(mode==='test'?'?demo=1&notification=dispatch':'?notification=dispatch'):run?'?notification=run':'?notification=eos',self.registration.scope).href,kind:dispatch?'dispatch':run?'run':'eos',mode}});
})()));
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{
 const data=event.notification.data||{},windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of windows)if(client.url.startsWith(self.registration.scope)){if(data.kind==='dispatch'&&(new URL(client.url).searchParams.get('demo')==='1')!==(data.mode==='test'))continue;await client.focus();client.postMessage({type:data.kind==='dispatch'?'open-dispatch':data.kind==='run'?'open-run':'open-eos',mode:data.mode});return;}
 await self.clients.openWindow(data.url||new URL('?notification=eos',self.registration.scope).href);
})());});
