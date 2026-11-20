import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activeRunForShift,assignOrders,detachBatchOrder,finishRunEarly,normalizeRunKinds,confirmPhotoException,deliveryNotes,annotateFieldTest,directionsURL,FIELD_TEST_NOTE} from '../dist/workflow.js';
import {completeRuns,awaitingReturn,validateBackup,mikeReport} from '../dist/domain.js';
import {requireCateringPhotos,detailCSVRows} from '../dist/field-tools.js';
import {deliveryTimings} from '../dist/analytics.js';
import {streetKey,addressIndex,locationFor,distanceMiles,nearbyPairs,suggestedOrder} from '../dist/local-route.js';
const at='2026-11-20T03:00:00Z';
const state=()=>({settings:{restaurant:'Restaurant',mike:'2065550100'},shifts:[{id:'s',status:'active',startedAt:'2026-11-20T00:00:00Z',startOdometer:100}],runs:[],customers:[],audit:[],deliveries:['a','b','c'].map((id,i)=>({id,shiftId:'s',status:'ready',name:'Test',phone:'',address:`${100+i} Test St`,ticket:String(i+1)}))});
test('one-order batch, bulk add, and detaching the only member preserve each order once',()=>{
 const s=state();assignOrders(s,'s',['a'],'batch');assert.equal(s.deliveries[0].batchId,'batch');assignOrders(s,'s',['b','c'],'batch');assert.equal(s.deliveries.filter(d=>d.batchId==='batch').length,3);assert.throws(()=>assignOrders(s,'s',['a'],'other'));
 for(const d of s.deliveries)detachBatchOrder(s,d.id);assert.equal(s.deliveries.length,3);assert.ok(s.deliveries.every(d=>!d.batchId&&d.deliveryMode==='single'));assert.throws(()=>assignOrders(s,'s',[],'batch'));
});
test('bulk joining an active batch updates its ready membership and clears a stale return reminder',()=>{
 const s=state();Object.assign(s.deliveries[0],{batchId:'batch',status:'delivered',completedAt:at});s.runs.push({id:'r',shiftId:'s',batchId:'batch',status:'active',deliveryIds:['a'],startedAt:'2026-11-20T02:00:00Z',completedAt:at,completionKind:'awaiting-return'});
 // A completed batch cannot receive orders through bulk assignment.
 assert.throws(()=>assignOrders(s,'s',['b'],'batch'));s.deliveries[0].status='active';assignOrders(s,'s',['b','c'],'batch');assert.equal(s.runs[0].deliveryIds.length,3);assert.ok(s.deliveries.every(d=>d.status==='active'));assert.equal(s.runs[0].completedAt,undefined);
});
test('active detachment keeps run accounting and does not report return while detached delivery is unfinished',()=>{
 const s=state();assignOrders(s,'s',['a','b'],'batch');for(const d of s.deliveries.slice(0,2))d.status='active';s.runs.push({id:'r',shiftId:'s',status:'active',batchId:'batch',deliveryIds:['a','b'],startedAt:'2026-11-20T02:00:00Z'});detachBatchOrder(s,'b');Object.assign(s.deliveries[0],{status:'delivered',completedAt:at});completeRuns(s);assert.equal(awaitingReturn(s),undefined);Object.assign(s.deliveries[1],{status:'delivered',completedAt:at});completeRuns(s);assert.ok(awaitingReturn(s));assert.equal(s.runs[0].kind,'batch');
});
test('a completed one-stop batch is a single in reporting even when old kind says batch',()=>{
 const s=state();assignOrders(s,'s',['a'],'batch');s.deliveries[0].status='delivered';s.deliveries[0].completedAt=at;s.runs=[{id:'r',shiftId:'s',batchId:'batch',kind:'batch',status:'active',startedAt:'2026-11-20T02:00:00Z',deliveryIds:['a']}];completeRuns(s);assert.equal(s.runs[0].kind,'single');assert.equal(s.deliveries[0].deliveryMode,'single');s.runs[0].status='returned';normalizeRunKinds(s);assert.equal(s.runs[0].kind,'single');
});
test('ending a run early records explicit return, retains completed orders and returns unfinished work to Ready',()=>{
 const s=state();s.deliveries[0].status='delivered';s.deliveries[0].completedAt=at;s.deliveries[1].status='active';s.deliveries[1].departedAt=at;s.runs=[{id:'r',shiftId:'s',status:'active',startedAt:at,deliveryIds:['a','b']}];finishRunEarly(s,'r','2026-11-20T03:10:00Z');assert.equal(s.runs[0].status,'returned');assert.equal(s.runs[0].kind,'single');assert.equal(s.deliveries[1].status,'ready');assert.equal(s.deliveries[0].status,'delivered');assert.deepEqual(s.runs[0].unfinishedDeliveryIds,['b']);assert.equal(s.deliveries.length,3);s.deliveries[1].status='delivered';s.deliveries[1].completedAt='2026-11-20T04:00:00Z';normalizeRunKinds(s);assert.equal(s.runs[0].kind,'single');assert.deepEqual(s.runs[0].completedDeliveryIds,['a']);assert.throws(()=>finishRunEarly(s,'r',at));
});
test('photo override must be explicit; sharing still requires two photos; notes and exception survive export and backup',()=>{
 const s=state(),d=s.deliveries[0];d.isCatering=true;assert.throws(()=>requireCateringPhotos(d,{allowException:true}));confirmPhotoException(d,at);assert.doesNotThrow(()=>requireCateringPhotos(d,{allowException:true}));assert.throws(()=>requireCateringPhotos(d));deliveryNotes(d,' Leave at side door. ');assert.equal(d.notes,'Leave at side door.');assert.throws(()=>deliveryNotes(d,'x'.repeat(4001)));const rows=detailCSVRows(s,s.shifts),note=rows[0].indexOf('delivery_notes'),exception=rows[0].indexOf('catering_photo_exception_confirmed_at');assert.equal(rows[2][note],d.notes);assert.equal(rows[2][exception],at);assert.equal(validateBackup({format:'delivery-manager',version:1,data:s}).deliveries[0].notes,d.notes);
});
test('November 19 quality note is opt-in per selected local shift, preserves mileage and suppresses untrusted trip timing',()=>{
 const s=state();s.shifts.push({...s.shifts[0],id:'other'});assert.equal(annotateFieldTest(s),false);assert.equal(annotateFieldTest(s,['s']),true);assert.equal(s.shifts[0].fieldTestNote,FIELD_TEST_NOTE);assert.equal(s.shifts[1].fieldTestNote,undefined);assert.equal(s.shifts[0].startOdometer,100);Object.assign(s.deliveries[0],{departedAt:'2026-11-20T02:00:00Z',completedAt:at});assert.equal(deliveryTimings(s,s.deliveries[0]).departureToDelivery,null);s.shifts[0].endedAt=at;s.shifts[0].endOdometer=110;assert.match(mikeReport(s.shifts[0],s.deliveries,s.runs),/Run data is not accurate/);
});
test('map provider URLs preserve explicit full addresses and waypoint order; mobile Google limit is explicit',()=>{
 const stops=['100 Example Ave SW, Seattle, WA','200 Example St, Seattle, WA'];const a=new URL(directionsURL(stops,{mapsProvider:'apple'}));assert.equal(a.searchParams.get('destination'),stops[1]);assert.deepEqual(a.searchParams.getAll('waypoint'),[stops[0]]);const g=new URL(directionsURL(stops,{mapsProvider:'google'}));assert.equal(g.searchParams.get('api'),'1');assert.equal(g.searchParams.get('waypoints'),stops[0]);assert.equal(g.searchParams.get('destination'),stops[1]);assert.throws(()=>directionsURL(Array(5).fill('Example'),{mapsProvider:'google'}));
});
test('local lookup normalizes street suffixes and units, but never guesses unknown house numbers or ambiguous locations',()=>{
 const index=addressIndex({coordinateScale:100000,rows:[['100 TEST AVE SW',4758000,-12238000],['200 TEST AVE SW',4758000,-12238000],['200 TEST AVE SW',4768000,-12238000]]});assert.equal(streetKey('100 Test Avenue SW Apt 2, Seattle, WA 98116'),'100 TEST AVE SW');assert.ok(locationFor('100 Test Ave SW #3',index));assert.equal(locationFor('101 Test Ave SW',index),null);assert.equal(locationFor('200 Test Ave SW',index),null);
});
test('nearby alerts distinguish known quarter-mile pairs; ordering honors scheduled times then tickets with nearby exception',()=>{
 const lookup=new Map([['100 A ST',{lat:47.58,lon:-122.38}],['100 B ST',{lat:47.5801,lon:-122.38}],['100 C ST',{lat:47.64,lon:-122.38}]]),orders=[{id:'a',address:'100 A St',ticket:'1',status:'ready'},{id:'b',address:'100 B St',ticket:'3',status:'pending'},{id:'c',address:'100 C St',ticket:'2',status:'ready'}];assert.equal(nearbyPairs(orders,lookup).length,1);assert.deepEqual(suggestedOrder(orders,lookup).stops.map(d=>d.id),['a','b','c']);orders[2].scheduledAt=at;assert.equal(suggestedOrder(orders,lookup).stops[0].id,'c');assert.equal(distanceMiles(lookup.get('100 A ST'),lookup.get('100 B ST'))<.25,true);assert.deepEqual(suggestedOrder([{id:'x',address:'unknown'}],lookup).unlocated,['x']);
});
test('bundled public Seattle locations include both restaurant defaults without customer queries',()=>{
 const data=JSON.parse(readFileSync(new URL('../dist/data/seattle-addresses.json',import.meta.url))),index=addressIndex(data);assert.ok(locationFor('3247 California Ave SW, Seattle, WA 98116',index));assert.ok(locationFor('45 S Spokane St, Seattle, WA 98134',index));assert.ok(index.size>100000);assert.match(data.source,/City of Seattle/);
});

test('nearby groups of more than two stay together even when an older distant ticket is waiting',()=>{const lookup=new Map([['100 A ST',{lat:47.58,lon:-122.38}],['100 B ST',{lat:47.583,lon:-122.38}],['100 C ST',{lat:47.577,lon:-122.38}],['100 D ST',{lat:47.65,lon:-122.38}]]),orders=['a','d','b','c'].map((id,i)=>({id,ticket:String(i+1),address:'100 '+id.toUpperCase()+' St'})),result=suggestedOrder(orders,lookup).stops;assert.equal(result[0].id,'a');assert.equal(result.at(-1).id,'d');assert.deepEqual(new Set(result.slice(0,3).map(d=>d.id)),new Set(['a','b','c']));assert.deepEqual(orders.map(d=>d.id),['a','d','b','c']);});

test('stale active runs from older shifts cannot occupy the current shift',()=>{const s=state();s.runs=[{id:'old',shiftId:'old-shift',status:'active'}];assert.equal(activeRunForShift(s,'s'),undefined);s.runs.push({id:'new',shiftId:'s',status:'active'});assert.equal(activeRunForShift(s,'s').id,'new');});
