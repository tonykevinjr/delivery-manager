import {cateringFiles} from './photo-tools.js?v=0.24.0';
import {requireCateringPhotos} from './field-tools.js?v=0.24.0';

export async function shareCateringPhotos(delivery,{sample=false,platform=globalThis.navigator,onStatus=()=>{}}={}){
 try{
  if(!delivery?.isCatering)throw Error('This catering order is no longer available.');
  requireCateringPhotos(delivery);
  const files=cateringFiles(delivery);
  if(typeof platform?.share!=='function'||!platform.canShare?.({files}))throw Error('Photo sharing is unavailable in this browser. Open the app on your iPhone to share these saved photos.');
  onStatus('Opening photo sharing… Choose Messages, then select Mike. Nothing is sent automatically.');
  // Call directly from the tap; do not await a save or another API before share().
  await platform.share({files,title:sample?'TEST — Catering delivery photos':'Catering delivery photos',text:sample?'TEST — Sample catering delivery photos. Set-up and receipt photos.':'Catering delivery completed. Set-up and receipt photos.'});
  onStatus('Share sheet closed. Your photos are still saved here. The app cannot confirm whether a message was sent.');
 }catch(e){
  const message=e.name==='AbortError'?'Photo sharing closed without confirmation. Your photos are still saved; you can try again.':e.name==='NotAllowedError'?'Your phone could not open photo sharing. Tap Share again. If it keeps happening, reopen this app in Safari.':e.name==='InvalidStateError'?'Another share sheet may already be open. Close it, then tap Share again.':e.name==='DataError'?'Your phone could not attach the photos. They are still saved here; tap Share to try again.':e.message||'Could not open photo sharing. Your photos are still saved here.';
  onStatus(message,true);
 }
}
