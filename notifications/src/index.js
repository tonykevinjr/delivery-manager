import {dispatchRoute,processDispatch} from './dispatch.js';
import {oilRoute,processOilReminders} from './oil.js';
import {scanRoute} from './scanner.js';
import {buildPushPayload} from '@block65/webcrypto-web-push';
import {desiredReminder,safeSubscription,runReminderAt,RUN_DELAYS} from './schedule.js';
const APP='https://tonykevinjr.github.io/delivery-manager/';
const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function sendPush(row,env,test=false){
 const subscription=JSON.parse(row.subscription),payload=await buildPushPayload({data:JSON.stringify(row.dispatch?{kind:'dispatch',title:row.notice==='ready'?'An order is ready':'Dispatch update from Mike',body:row.notice==='ready'?'An order has been marked ready. Open Convey to check it.':'Open Convey to receive Mike’s update.',url:APP+(row.mode==='test'?'?demo=1&notification=dispatch':'?notification=dispatch'),test:false}: {kind:row.runReminder?'run':'eos',title:test?'Convey test':row.runReminder?'Back at the restaurant?':'Remember to finish your shift',body:test?'Lock-screen reminders are connected.':row.runReminder?'Your deliveries are complete. When you’re back, open Convey and tap End Run.':'Record your ending mileage and prepare Mike’s report. Still working? Open the app to snooze.',url:APP+'?notification='+(row.runReminder?'run':'eos'),test}),options:{ttl:row.runReminder?60:900}},subscription,{subject:APP,publicKey:env.VAPID_PUBLIC_KEY,privateKey:env.VAPID_PRIVATE_KEY});
 const response=await fetch(subscription.endpoint,{...payload,redirect:'manual',signal:AbortSignal.timeout(15000)});return response.status;
}
export async function scheduled(env,at=Date.now(),sender=sendPush){
 // The tiny Free-plan service has a hard 10-device enrollment cap and processes at most 3 shift and 3 return reminders per minute.
 await env.DB.prepare('DELETE FROM devices WHERE updated_at < ?').bind(at-90*86400000).run();
 await env.DB.prepare('UPDATE devices SET due_at=NULL WHERE expires_at < ?').bind(at).run();
 const {results}=await env.DB.prepare('SELECT * FROM devices WHERE due_at <= ? AND expires_at >= ? ORDER BY due_at LIMIT 3').bind(at,at).all();
 for(const row of results){
  // Claim only this revision; cancellations/new schedules invalidate a stale queued send.
  const claim=await env.DB.prepare('UPDATE devices SET due_at=? WHERE id=? AND revision=? AND due_at=?').bind(at+120000,row.id,row.revision,row.due_at).run();if(!claim.meta.changes)continue;
  const fresh=await env.DB.prepare('SELECT revision,due_at FROM devices WHERE id=?').bind(row.id).first();if(!fresh||fresh.revision!==row.revision||fresh.due_at!==at+120000)continue;
  let status;try{status=await sender(row,env);}catch{status=503;}
  if(status===404||status===410){await env.DB.prepare('DELETE FROM devices WHERE id=? AND revision=?').bind(row.id,row.revision).run();continue;}
  if(status>=200&&status<300||row.attempts>=4){await env.DB.prepare('UPDATE devices SET due_at=NULL,attempts=0 WHERE id=? AND revision=?').bind(row.id,row.revision).run();}
  else await env.DB.prepare('UPDATE devices SET due_at=?,attempts=attempts+1 WHERE id=? AND revision=?').bind(at+Math.min(15,2**row.attempts)*60000,row.id,row.revision).run();
 }
 // Independent queue: a return reminder must never replace the end-of-shift reminder.
 await env.DB.prepare('UPDATE devices SET run_due_at=NULL WHERE run_completed_at < ?').bind(at-2*3600000).run();
 const pending=await env.DB.prepare('SELECT * FROM devices WHERE run_due_at <= ? ORDER BY run_due_at LIMIT 3').bind(at).all();
 for(const row of pending.results){
  const claim=await env.DB.prepare('UPDATE devices SET run_due_at=? WHERE id=? AND run_revision=? AND run_due_at=?').bind(at+120000,row.id,row.run_revision,row.run_due_at).run();if(!claim.meta.changes)continue;
  const fresh=await env.DB.prepare('SELECT run_revision,run_due_at FROM devices WHERE id=?').bind(row.id).first();if(!fresh||fresh.run_revision!==row.run_revision||fresh.run_due_at!==at+120000)continue;
  let status;try{status=await sender({...row,runReminder:true},env);}catch{status=503;}
  if(status===404||status===410){await env.DB.prepare('DELETE FROM devices WHERE id=? AND run_revision=?').bind(row.id,row.run_revision).run();continue;}
  if(status>=200&&status<300){const count=row.run_count+1,next=RUN_DELAYS[count];await env.DB.prepare('UPDATE devices SET run_count=?,run_attempts=0,run_due_at=? WHERE id=? AND run_revision=?').bind(count,next?Math.max(at+60000,row.run_completed_at+next*60000):null,row.id,row.run_revision).run();}
  else await env.DB.prepare('UPDATE devices SET run_due_at=?,run_attempts=run_attempts+1 WHERE id=? AND run_revision=?').bind(row.run_attempts>=4?null:at+Math.min(15,2**row.run_attempts)*60000,row.id,row.run_revision).run();
 }
 await processOilReminders(env,at);
 await processDispatch(env,at,sender);
}
export async function route(request,env){
 const url=new URL(request.url),origin=request.headers.get('Origin'),origins=(env.ALLOWED_ORIGINS||'').split(',');
 if(request.method==='GET'&&url.pathname==='/health')return json({ok:true,service:'delivery-manager-reminders',plan:'free-only'});
 if(!origin||!origins.includes(origin))return json({error:'Origin not allowed.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204});
 if(request.method==='GET'&&url.pathname==='/config')return json({publicKey:env.VAPID_PUBLIC_KEY});
 if(request.method!=='POST')return json({error:'Not found.'},404);
 if(url.pathname.startsWith('/dispatch/'))return dispatchRoute(request,env);
 if(url.pathname.startsWith('/oil/'))return oilRoute(request,env);
 if(url.pathname.startsWith('/scan'))return scanRoute(request,env);
 if(request.headers.get('Content-Type')?.split(';')[0]!=='application/json')return json({error:'JSON required.'},415);
 const raw=await request.text();if(raw.length>8192)return json({error:'Request too large.'},413);
 const body=JSON.parse(raw),at=Date.now();
 if(url.pathname==='/register'){
  const code=String(body.code||'').replaceAll('-','').trim();if(!env.ENROLLMENT_CODE||await hash(code)!==await hash(env.ENROLLMENT_CODE))return json({error:'Check the driver setup code.'},401);
  if(!/^[a-f0-9]{64}$/.test(body.token||''))return json({error:'Invalid device token.'},400);
  const subscription=safeSubscription(body.subscription),tokenHash=await hash(body.token),existing=await env.DB.prepare('SELECT id FROM devices WHERE token_hash=?').bind(tokenHash).first();
  if(!existing){const count=await env.DB.prepare('SELECT count(*) AS n FROM devices').first();if(count.n>=10)return json({error:'Device limit reached. Ask Tony for help.'},429);}
  await env.DB.prepare('INSERT INTO devices(id,token_hash,subscription,updated_at) VALUES(?,?,?,?) ON CONFLICT(token_hash) DO UPDATE SET subscription=excluded.subscription,updated_at=excluded.updated_at').bind(existing?.id||crypto.randomUUID(),tokenHash,JSON.stringify(subscription),at).run();return json({ok:true});
 }
 const token=request.headers.get('Authorization')?.replace(/^Bearer /,'');if(!/^[a-f0-9]{64}$/.test(token||''))return json({error:'Enable notifications again in Settings.'},401);
 const row=await env.DB.prepare('SELECT * FROM devices WHERE token_hash=?').bind(await hash(token)).first();if(!row)return json({error:'Enable notifications again in Settings.'},401);
 if(url.pathname==='/disable'){await env.DB.prepare('DELETE FROM devices WHERE id=?').bind(row.id).run();return json({ok:true});}
 if(url.pathname==='/run'){
  if(!Number.isSafeInteger(body.revision)||body.revision<1)return json({error:'Invalid run revision.'},400);
  if(body.revision<=row.run_revision)return json({ok:true,stale:true});
  // An old overdue local run stays blocking in the app, but does not generate overnight pushes.
  const expired=body.completedAt&&Date.parse(body.completedAt)<at-2*3600000;
  const due=expired?null:runReminderAt(body.completedAt,at),completed=due?Date.parse(body.completedAt):null;
  if(completed!==null&&completed===row.run_completed_at){await env.DB.prepare('UPDATE devices SET run_revision=?,updated_at=? WHERE id=? AND run_revision<?').bind(body.revision,at,row.id,body.revision).run();return json({ok:true,dueAt:row.run_due_at});}
  await env.DB.prepare('UPDATE devices SET run_revision=?,run_completed_at=?,run_due_at=?,run_count=0,run_attempts=0,updated_at=? WHERE id=? AND run_revision<?').bind(body.revision,completed,due,at,row.id,body.revision).run();return json({ok:true,dueAt:due});
 }
 if(url.pathname==='/schedule'){
  if(!Number.isSafeInteger(body.revision)||body.revision<1)return json({error:'Invalid schedule revision.'},400);
  if(body.revision<=row.revision)return json({ok:true,stale:true});
  const due=desiredReminder(body,at);await env.DB.prepare('UPDATE devices SET revision=?,due_at=?,expires_at=?,attempts=0,updated_at=? WHERE id=? AND revision<?').bind(body.revision,due,due?due+2*3600000:null,at,row.id,body.revision).run();return json({ok:true,dueAt:due});
 }
 if(url.pathname==='/test'){
  if(at-row.last_test<60000)return json({error:'Wait one minute before sending another test.'},429);
  await env.DB.prepare('UPDATE devices SET last_test=? WHERE id=?').bind(at,row.id).run();let status;try{status=await sendPush(row,env,true);}catch{return json({error:'Could not contact the notification provider. Please try again shortly.'},502);}
  if(status===404||status===410){await env.DB.prepare('DELETE FROM devices WHERE id=?').bind(row.id).run();return json({error:'This notification connection expired. Disable and enable notifications again.'},410);}
  return status>=200&&status<300?json({ok:true}):json({error:`The phone’s notification service did not accept the test (status ${status}). Try again later.`},502);
 }
 return json({error:'Not found.'},404);
}
export default {
 async fetch(request,env,ctx){const origin=request.headers.get('Origin'),allowed=(env.ALLOWED_ORIGINS||'').split(',').includes(origin);let response;try{response=await route(request,env);}catch{response=json({error:'Could not process the reminder request. Check the connection and try again.'},400);}if(response.ok&&new URL(request.url).pathname==='/dispatch/send'&&ctx?.waitUntil)ctx.waitUntil(processDispatch(env,Date.now(),sendPush));const headers=new Headers(response.headers);if(allowed){headers.set('Access-Control-Allow-Origin',origin);headers.set('Access-Control-Allow-Methods','GET,POST,OPTIONS');headers.set('Access-Control-Allow-Headers','Content-Type,Authorization');headers.set('Vary','Origin');}return new Response(response.body,{status:response.status,headers});},
 async scheduled(event,env,ctx){ctx.waitUntil(scheduled(env,event.scheduledTime));}
};
