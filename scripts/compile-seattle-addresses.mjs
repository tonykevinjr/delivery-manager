// Compile public location data at build time, keeping phone startup work small.
import fs from 'node:fs';
import {addressIndex} from '../dist/local-route.js';
const path=new URL('../dist/data/seattle-addresses.json',import.meta.url);
const data=JSON.parse(fs.readFileSync(path,'utf8'));
data.rows=[...addressIndex(data)].map(([key,p])=>[key,Math.round(p.lat*data.coordinateScale),Math.round(p.lon*data.coordinateScale)]);
data.normalized=true;
data.sourceDisclaimer='Public City address locations may be missing, outdated or inaccurate. Verify destinations in Maps.';
fs.writeFileSync(path,JSON.stringify(data));
console.log('Compiled',data.rows.length,'unambiguous public address locations.');
