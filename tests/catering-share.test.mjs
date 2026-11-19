import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shareCateringPhotos} from '../dist/catering-share.js';

const photo=data=>({data:'data:image/jpeg;base64,'+Buffer.from(data).toString('base64'),type:'image/jpeg'});
const order=()=>({id:'test-order',isCatering:true,cateringPhotos:{setup:photo('setup photo'),receipt:photo('receipt photo')}});

test('sample catering can open sharing with both saved photos and an explicit test label; no recipient is selected',async()=>{
 let payload;const status=[];
 await shareCateringPhotos(order(),{sample:true,platform:{canShare:({files})=>files.length===2,share:async data=>{payload=data;}},onStatus:(...value)=>status.push(value)});
 assert.equal(payload.files.length,2);assert.equal(await payload.files[0].text(),'setup photo');assert.equal(await payload.files[1].text(),'receipt photo');
 assert.ok(payload.files.every(f=>f.type==='image/jpeg'&&f.name.endsWith('.jpg')));assert.match(payload.title,/TEST/);assert.match(payload.text,/TEST/);
 assert.deepEqual(Object.keys(payload).sort(),['files','text','title']);assert.match(status.at(-1)[0],/cannot confirm whether a message was sent/);
});
test('real catering shares both attachments without the sample label',async()=>{
 let payload;await shareCateringPhotos(order(),{platform:{canShare:()=>true,share:async data=>{payload=data;}}});assert.equal(payload.files.length,2);assert.doesNotMatch(payload.text,/TEST/);
});
test('missing photos and unsupported sharing produce visible callback errors without invoking sharing',async()=>{
 for(const delivery of [{...order(),cateringPhotos:{setup:photo('one')}},order()]){
  let shared=false;const status=[];await shareCateringPhotos(delivery,{platform:{canShare:()=>false,share:async()=>{shared=true;}},onStatus:(...v)=>status.push(v)});
  assert.equal(shared,false);assert.equal(status.at(-1)[1],true);assert.match(status.at(-1)[0],/both|unavailable/);
 }
});
test('native sharing errors including cancel are surfaced inside the dialog without claiming delivery',async()=>{
 for(const name of ['AbortError','NotAllowedError','InvalidStateError','DataError']){
  const status=[];await shareCateringPhotos(order(),{platform:{canShare:()=>true,share:async()=>{throw Object.assign(Error('native error'),{name});}},onStatus:(...v)=>status.push(v)});
  assert.equal(status.at(-1)[1],true);assert.doesNotMatch(status.at(-1)[0],/native error/);assert.match(status.at(-1)[0],/sharing|share|Share|photos/);
 }
});
