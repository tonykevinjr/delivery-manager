import test from 'node:test';
import assert from 'node:assert/strict';
import {driverScheduleCheck} from '../dist/driver-schedule.js';
test('usual restaurant nights and coverage warnings',()=>{
 for(const [date,usual] of [['2026-11-18','Tony'],['2026-11-19','Tony'],['2026-11-20','Tony'],['2026-11-21','Charlotte'],['2026-11-22','Charlotte'],['2026-11-23','Charlotte']]){
  const at=new Date(date+'T20:00:00-08:00');
  assert.equal(driverScheduleCheck(usual,at).mismatch,false);
  assert.equal(driverScheduleCheck(usual==='Tony'?'Charlotte':'Tony',at).mismatch,true);
 }
});
test('Seattle calendar, unspecified Tuesday, and saved pairing names',()=>{
 assert.equal(driverScheduleCheck('Tony',new Date('2026-11-22T03:00:00Z')).day,'Saturday');
 assert.equal(driverScheduleCheck('Charlotte Test',new Date('2026-11-22T03:00:00Z')).mismatch,false);
 assert.equal(driverScheduleCheck('Tony',new Date('2026-11-25T03:00:00Z')).mismatch,false);
 assert.equal(driverScheduleCheck('Unrecognized driver',new Date('2026-11-22T03:00:00Z')).mismatch,true);
});
