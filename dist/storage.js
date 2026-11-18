import {DEFAULT_SETTINGS} from './config.js?v=0.6.0';
let db;
export async function openDB(name='delivery-manager'){return new Promise((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>{db=r.result;resolve();};r.onerror=()=>reject(r.error);});}
export const initial=()=>({settings:{...DEFAULT_SETTINGS},shifts:[],deliveries:[],runs:[],customers:[],audit:[]});
export async function read(){return new Promise((resolve,reject)=>{const r=db.transaction('state').objectStore('state').get('current');r.onsuccess=()=>resolve(r.result||initial());r.onerror=()=>reject(r.error);});}
export async function save(value){return new Promise((resolve,reject)=>{const t=db.transaction('state','readwrite');t.objectStore('state').put(value,'current');t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Save interrupted'));});}
