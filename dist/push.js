// Notification credentials belong to this browser installation, never to portable data backups.
const API='https://delivery-manager-reminders.tonykevinjr.workers.dev';
const KEY='delivery-manager-push-v1';
let config=readConfig(),chain=Promise.resolve(),lastError='',lastTest=null;
function readConfig(){try{return JSON.parse(localStorage.getItem(KEY)||'null');}catch{return null;}}
function persist(){config?localStorage.setItem(KEY,JSON.stringify(config)):localStorage.removeItem(KEY);}
export function notificationSupport(){if(!('serviceWorker' in navigator)||!('PushManager' in globalThis)||!('Notification' in globalThis))return 'This browser cannot receive lock-screen reminders. On iPhone, open the app from its Home Screen icon.';if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&!navigator.standalone&&!matchMedia('(display-mode: standalone)').matches)return 'Add the app to your iPhone Home Screen, then open that icon to enable reminders.';return '';}
export function notificationStatus(){const unsupported=notificationSupport();return {enabled:!!config?.enabled,permission:'Notification' in globalThis?Notification.permission:'unavailable',unsupported,error:lastError,pending:!!config?.pending,connected:!!config?.lastSyncedAt,lastTest};}
const bytes=value=>Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
async function call(path,body={},token=config?.token){const response=await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body),keepalive:true,cache:'no-store',signal:AbortSignal.timeout(15000)});const value=await response.json();if(!response.ok)throw Error(value.error||'Reminder service unavailable.');return value;}
export async function enableNotifications(code,state){
 const unsupported=notificationSupport();if(unsupported)throw Error(unsupported);
 // Keep permission request directly in the driver's button gesture.
 const permission=await Notification.requestPermission();if(permission!=='granted')throw Error('Notifications were not allowed. Check iPhone Settings → Notifications.');
 const registration=await navigator.serviceWorker.ready;
 const response=await fetch(API+'/config',{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Could not connect to the reminder service.');const {publicKey}=await response.json();
 let subscription=await registration.pushManager.getSubscription();if(!subscription)subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes(publicKey)});
 const token=config?.token||Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
 await call('/register',{code,token,subscription:subscription.toJSON()},null);
 config={enabled:true,token,revision:config?.revision||0,lastSignature:null};lastError='';persist();await syncNotifications(state,true);
}
export function syncNotifications(state,force=false){
 if(!config)return Promise.resolve();
 const shift=state.shifts.find(s=>s.status==='active'),run=state.runs?.find(r=>r.shiftId===shift?.id&&r.status==='active'&&r.completionKind==='awaiting-return'),desired=config.enabled?{startedAt:shift?.startedAt||null,snoozeUntil:shift?.reminderAfter||null,runCompletedAt:run?.completedAt||null}:{disable:true},signature=JSON.stringify(desired);
 const wasWaiting=(()=>{try{return !!JSON.parse(config.lastSignature||'{}').runCompletedAt;}catch{return false;}})();
 if(signature!==config.lastSignature){config.revision=Math.max(Date.now(),(config.revision||0)+1);config.pending={...desired,revision:config.revision};config.lastSignature=signature;persist();}
 if(config.enabled&&wasWaiting&&!desired.runCompletedAt&&navigator.onLine){const urgent={completedAt:null,revision:config.revision};call('/run',urgent,config.token).catch(()=>{});}
 if(!config.pending&&!force)return chain;
 // Serialize saves and retries; each revision prevents an old request undoing shift cancellation.
 chain=chain.catch(()=>{}).then(async()=>{if(!config?.pending)return;const payload={...config.pending},token=config.token;if(!navigator.onLine){lastError='Waiting for internet to update the lock-screen reminder.';throw Error(lastError);}try{if(payload.disable){await call('/disable',{},token);if(config?.token===token){config=null;persist();}}else{const results=await Promise.allSettled([call('/run',{completedAt:payload.runCompletedAt||null,revision:payload.revision},token),call('/schedule',payload,token)]);const failed=results.find(r=>r.status==='rejected');if(failed)throw failed.reason;if(config?.pending?.revision===payload.revision){delete config.pending;config.lastSyncedAt=new Date().toISOString();persist();}}lastError='';}catch(e){lastError=e.message;throw e;}});
 return chain;
}
export async function disableNotifications(state){if(!config)return;config.enabled=false;config.lastSignature=null;persist();return syncNotifications(state,true);}
export async function testNotification(){lastTest={state:'sending',message:'Sending test notification…'};try{if(!config?.enabled)throw Error('Enable lock-screen reminders first.');await call('/test');lastTest={state:'accepted',message:'Your phone’s notification provider accepted the test. Check Notification Center or the Lock Screen; Focus settings can silence it.'};}catch(e){lastTest={state:'failed',message:e.message};throw e;}}

export function scannerDeviceToken(){return config?.enabled?config.token:null;}
