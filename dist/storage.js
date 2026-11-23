import {DEFAULT_SETTINGS} from './config.js?v=0.20.4';
let db;
export async function openDB(name='delivery-manager'){return new Promise((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>{db=r.result;resolve();};r.onerror=()=>reject(r.error);});}
export const initial=()=>({settings:{...DEFAULT_SETTINGS},shifts:[],deliveries:[],runs:[],customers:[],audit:[]});
export async function read(){return new Promise((resolve,reject)=>{const r=db.transaction('state').objectStore('state').get('current');r.onsuccess=()=>resolve(r.result||initial());r.onerror=()=>reject(r.error);});}
export async function save(value){return new Promise((resolve,reject)=>{const t=db.transaction('state','readwrite');t.objectStore('state').put(value,'current');t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Save interrupted'));});}

// Read/modify/write in one transaction prevents duplicate dispatch imports across tabs.
export async function updateStored(change){return new Promise((resolve,reject)=>{const t=db.transaction('state','readwrite'),store=t.objectStore('state'),r=store.get('current');let value,failure;r.onsuccess=()=>{try{value=r.result||initial();change(value);store.put(value,'current');}catch(e){failure=e;t.abort();}};t.oncomplete=()=>resolve(value);t.onerror=()=>reject(failure||t.error);t.onabort=()=>reject(failure||t.error||Error('Save interrupted'));});}
