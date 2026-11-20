"""Download public City of Seattle MAF address points; never queries customer data."""
import json, urllib.request, urllib.parse, concurrent.futures, datetime
from pathlib import Path
BASE='https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/TRANSPO_MAFDAP_PV/FeatureServer/0/query?'
def query(params):
 with urllib.request.urlopen(BASE+urllib.parse.urlencode({'f':'json',**params}),timeout=90) as r:
  j=json.load(r)
 if 'error' in j:raise RuntimeError(j['error'].get('message','City data unavailable'))
 return j
where="DCLUSTAT NOT IN ('CANCELED','RETIRED') OR DCLUSTAT IS NULL"
count=query({'where':where,'returnCountOnly':'true'})['count']
def page(offset):
 return query({'where':where,'outFields':'MAF_ADDRESS','outSR':4326,'orderByFields':'OBJECTID','resultOffset':offset,'resultRecordCount':2000})['features']
rows=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for i,features in enumerate(pool.map(page,range(0,count,2000))):
  for f in features:
   a=f.get('attributes',{}).get('MAF_ADDRESS');g=f.get('geometry')
   if a and g and -123<g['x']<-122 and 47<g['y']<49:rows.append([a,round(g['y']*100000),round(g['x']*100000)])
  if i%20==0:print('Public address pages:',i+1,flush=True)
value={'source':'City of Seattle, Enterprise Data — Addresses (MAF)','sourceURL':BASE.split('/query?')[0],'built':datetime.date.today().isoformat(),'coordinateScale':100000,'rows':rows}
p=Path(__file__).resolve().parents[1]/'dist/data/seattle-addresses.json';p.write_text(json.dumps(value,separators=(',',':')))
print('Saved',len(rows),'public points;',p.stat().st_size,'bytes',flush=True)

import subprocess
subprocess.run(["node",str(Path(__file__).with_name("compile-seattle-addresses.mjs"))],check=True)
