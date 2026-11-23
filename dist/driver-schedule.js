// Restaurant nights are evaluated in Seattle, regardless of the counter phone's time zone.
export function driverScheduleCheck(driverName,at=new Date()){
 const day=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'long'}).format(at);
 const usual=['Wednesday','Thursday','Friday'].includes(day)?'Tony':['Saturday','Sunday','Monday'].includes(day)?'Charlotte':null;
 const name=String(driverName||'').trim();
 const selected=/^tony(?:\b|$)/i.test(name)?'Tony':/^charlotte(?:\b|$)/i.test(name)?'Charlotte':null;
 return {day,usual,selected,mismatch:!!usual&&selected!==usual};
}
