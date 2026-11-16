// Synthetic records only. Stored in a separate IndexedDB database.
export function createDemoData(anchor=new Date()){
 const data={settings:{restaurant:'Sample restaurant, Seattle, WA',mike:'',rate:.73},shifts:[],deliveries:[],runs:[],customers:[],audit:[],demoSeedVersion:1};
 const end=new Date(anchor);end.setHours(0,0,0,0);const start=new Date(end);start.setMonth(start.getMonth()-3);let odo=52000,index=0;
 for(let day=new Date(start);day<end;day.setDate(day.getDate()+1)){
  if(![3,4,5].includes(day.getDay()))continue;
  const at=(hour,minute=0)=>{const d=new Date(day);d.setHours(hour,minute,0,0);return d.toISOString();};
  const shiftId=`demo-shift-${index}`,distance=+(18.4+(index*17%290)/10).toFixed(1),count=5+index%9;
  data.shifts.push({id:shiftId,status:'finalized',startedAt:at(16,index%3*5),endedAt:at(22,index%4*10),startOdometer:+odo.toFixed(1),endOdometer:+(odo+distance).toFixed(1),rate:.73,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,demo:true});
  let n=0,runIndex=0;
  while(n<count){const size=runIndex%2===0?1:Math.min(3,count-n),batchId=size>1?`demo-batch-${index}-${runIndex}`:null,ids=[];
   for(let j=0;j<size;j++,n++){const deliveryId=`demo-delivery-${index}-${n}`,scheduled=n%3===0,hour=17+Math.floor(n/3),minute=(n%3)*15;ids.push(deliveryId);data.deliveries.push({id:deliveryId,shiftId,customerId:null,name:`Sample customer ${n+1}`,address:`${100+n*10} Example Street`,phone:'',ticket:`SAMPLE-${index}-${n}`,status:'delivered',enteredAt:at(16,15),scheduledAt:scheduled?at(hour,minute):null,completedAt:at(hour,minute+[-5,0,8,14][(index+n)%4]),deliveryMode:batchId?'batch':'single',batchId,demo:true});}
   data.runs.push({id:`demo-run-${index}-${runIndex}`,shiftId,deliveryIds:ids,kind:batchId?'batch':'single',batchId,status:'returned',startedAt:new Date(Date.parse(data.deliveries.find(d=>d.id===ids[0]).completedAt)-15*60000).toISOString(),returnedAt:new Date(Date.parse(data.deliveries.find(d=>d.id===ids.at(-1)).completedAt)+20*60000).toISOString(),estimateStatus:'unavailable',demo:true});runIndex++;
  }
  odo+=distance+4+index%12;index++;
 }
 return data;
}
export function ensureDemoCurrentShift(data,anchor=new Date()){
 if(data.demoCurrentSeedVersion)return false;
 let shift=data.shifts.find(s=>s.status==='active');
 if(!shift){const previous=data.shifts.filter(s=>s.status==='finalized').sort((a,b)=>Date.parse(b.endedAt)-Date.parse(a.endedAt))[0];shift={id:'demo-current-shift',status:'active',startedAt:new Date(+anchor-3*3600000).toISOString(),startOdometer:+((previous?.endOdometer||52000)+12).toFixed(1),rate:.73,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,demo:true};data.shifts.push(shift);}
 const start=Date.parse(shift.startedAt),span=Math.max(0,+anchor-start),at=f=>new Date(start+span*f).toISOString();
 for(let r=0;r<3;r++){const count=r===1?3:1,batchId=count>1?'demo-preview-batch':null,ids=[];for(let j=0;j<count;j++){const id=`demo-preview-delivery-${r}-${j}`;ids.push(id);data.deliveries.push({id,shiftId:shift.id,customerId:null,name:`Sample completed ${r+1}.${j+1}`,address:`${600+r*10+j} Example Street`,phone:'',ticket:String(900+r*10+j),status:'delivered',enteredAt:at(.01),completedAt:at(.12+r*.22+j*.025),scheduledAt:r===1&&j===0?at(.35):null,deliveryMode:batchId?'batch':'single',batchId,demo:true});}data.runs.push({id:`demo-preview-run-${r}`,shiftId:shift.id,deliveryIds:ids,kind:batchId?'batch':'single',batchId,status:'returned',startedAt:at(.06+r*.22),returnedAt:at(.21+r*.22),estimateStatus:'unavailable',demo:true});}
 data.demoCurrentSeedVersion=1;return true;
}
