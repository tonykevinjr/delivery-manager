export function shiftReminderAt(startedAt){
 const start=new Date(startedAt);if(!Number.isFinite(+start))throw Error('Invalid shift start.');
 const parts=d=>Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d).map(p=>[p.type,p.value]));
 const p=parts(start),target=Date.UTC(+p.year,+p.month-1,+p.day,21,['Fri','Sat'].includes(p.weekday)?30:0);
 let guess=target;for(let i=0;i<3;i++){const q=parts(new Date(guess)),local=Date.UTC(+q.year,+q.month-1,+q.day,+q.hour,+q.minute);guess+=target-local;}return guess;
}
export function desiredReminder(body,now=Date.now()){
 if(body.startedAt==null)return null;
 const start=Date.parse(body.startedAt);if(!Number.isFinite(start)||start>now+300000||start<now-7*86400000)throw Error('Shift date is outside the supported reminder window.');
 const cutoff=shiftReminderAt(body.startedAt),snooze=body.snoozeUntil?Date.parse(body.snoozeUntil):0;
 if(!Number.isFinite(snooze)||snooze>now+3600000)throw Error('Invalid snooze time.');
 return Math.max(cutoff,snooze,now+30000);
}
export function safeSubscription(value){
 const u=new URL(value?.endpoint);if(u.protocol!=='https:'||u.port||u.username||u.password||!['web.push.apple.com','fcm.googleapis.com','updates.push.services.mozilla.com'].includes(u.hostname)||u.href.length>2048)throw Error('Unsupported notification provider.');
 const decode=s=>{if(typeof s!=='string'||!/^[A-Za-z0-9_-]+$/.test(s))throw Error('Invalid notification key.');return atob(s.replaceAll('-','+').replaceAll('_','/'));};
 if(decode(value.keys?.p256dh).length!==65||decode(value.keys?.auth).length!==16)throw Error('Invalid notification keys.');
 return {endpoint:u.href,keys:{p256dh:value.keys.p256dh,auth:value.keys.auth}};
}

export const RUN_DELAYS=[10,25,45];
export function runReminderAt(completedAt,now=Date.now()){
 if(completedAt==null)return null;
 const t=Date.parse(completedAt);
 if(!Number.isFinite(t)||t>now+300000||t<now-2*3600000)throw Error('Run completion is outside the reminder window.');
 return Math.max(t+RUN_DELAYS[0]*60000,now+30000);
}
