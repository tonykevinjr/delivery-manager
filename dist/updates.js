export const VERSION='0.7.1';
export async function checkForUpdates(){
 if(!navigator.onLine)throw Error('Connect to the internet to check for updates.');
 const response=await fetch(new URL(`version.json?check=${Date.now()}`,location.href),{cache:'no-store'});
 if(!response.ok)throw Error('Could not check the published version. Try again shortly.');
 const latest=await response.json();
 if(latest.version===VERSION)return false;
 // Check before reloading; application records remain in IndexedDB.
 if('serviceWorker' in navigator){const registration=await navigator.serviceWorker.getRegistration();if(registration)await registration.update();}
 return true;
}
export function reloadLatest(){const url=new URL(location.href);url.searchParams.set('release',Date.now());location.replace(url.href);}
export async function registerUpdates(){
 if(!('serviceWorker' in navigator))return;
 const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
 registration.update().catch(()=>{});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&navigator.onLine)registration.update().catch(()=>{});});
}
