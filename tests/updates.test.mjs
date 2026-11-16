import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,checkForUpdates} from '../dist/updates.js';
test('update check bypasses cached metadata, detects newer release and handles offline/errors',async()=>{
 const originalNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator'),originalFetch=globalThis.fetch,originalLocation=globalThis.location;
 try{Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});globalThis.location={href:'https://example.test/delivery-manager/?demo=1'};let options;
 globalThis.fetch=async(url,opts)=>{options=opts;assert.match(String(url),/delivery-manager\/version.json\?check=/);return {ok:true,json:async()=>({version:VERSION})};};
 assert.equal(await checkForUpdates(),false);assert.equal(options.cache,'no-store');
 globalThis.fetch=async()=>({ok:true,json:async()=>({version:'99.0.0'})});assert.equal(await checkForUpdates(),true);
 globalThis.fetch=async()=>({ok:false});await assert.rejects(checkForUpdates(),/Could not check/);
 globalThis.navigator.onLine=false;await assert.rejects(checkForUpdates(),/Connect to the internet/);
 }finally{if(originalNavigator)Object.defineProperty(globalThis,'navigator',originalNavigator);else delete globalThis.navigator;globalThis.fetch=originalFetch;globalThis.location=originalLocation;}
});
