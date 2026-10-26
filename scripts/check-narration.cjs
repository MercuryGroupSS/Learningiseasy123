// Run with: node scripts/check-narration.cjs
// No dependencies: checks embedded MP3 bytes and their complete MPEG frame durations.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function mp3Duration(bytes){
 let offset=0,samples=0,rate=0,frames=0;
 if(bytes.toString('ascii',0,3)==='ID3')offset=10+((bytes[6]&127)<<21)+((bytes[7]&127)<<14)+((bytes[8]&127)<<7)+(bytes[9]&127);
 while(offset+4<=bytes.length){
  if(bytes[offset]!==255||(bytes[offset+1]&224)!==224){offset++;continue;}
  const version=(bytes[offset+1]>>3)&3,layer=(bytes[offset+1]>>1)&3,bi=bytes[offset+2]>>4,si=(bytes[offset+2]>>2)&3,pad=(bytes[offset+2]>>1)&1;
  if(version===1||layer!==1||bi===0||bi===15||si===3){offset++;continue;}
  const bitrate=(version===3?[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320]:[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160])[bi]*1000;
  const hz=[44100,48000,32000][si]/(version===3?1:version===2?2:4),length=Math.floor((version===3?144:72)*bitrate/hz)+pad;
  if(offset+length>bytes.length)break;
  assert(!rate||rate===hz,'Sample rate changed within clip');rate=hz;samples+=version===3?1152:576;frames++;offset+=length;
 }
 assert(frames>0,'No complete MP3 frames');return samples/rate;
}
const manifest=JSON.parse(fs.readFileSync(path.join(root,'bella-manifest.json'))),context=vm.createContext({window:{}});
for(let i=1;i<=4;i++)vm.runInContext(fs.readFileSync(path.join(root,`bella-recordings-${i}.js`),'utf8'),context);
const records=context.window.NumberGardenRecordings;assert.equal(Object.keys(manifest.clips).length,209);assert.equal(Object.keys(records).length,209);
const durations={};for(const [text,file] of Object.entries(manifest.clips)){
 const data=records[file];assert(data?.startsWith('data:audio/mpeg;base64,'),`Missing embedded recording: ${text}`);
 const bytes=Buffer.from(data.split(',')[1],'base64'),duration=mp3Duration(bytes);durations[text]=duration;
 assert(duration>.2,`Recording too short: ${text}`);
 if(text.length>=40)assert(duration>=text.length/35,`Possible truncated sentence: ${text} (${duration.toFixed(2)}s)`);
 const original=path.join(root,file);if(fs.existsSync(original))assert(bytes.equals(fs.readFileSync(original)),`Bundled audio differs: ${text}`);
}
for(const [text,min] of Object.entries({
 'Copy the example beside your writing pad. Then try it on your own':4,
 'Great effort! Here is your next puzzle':2,
 'That is how we learn! We will practice this idea again':3,
 'Amazing work! Your number garden grew. Ready for a new math skill':4
}))assert(durations[text]>=min,`Truncated narration: ${text}`);
console.log('PASS: 209 complete recordings; embedded MP3 frames; minimum sentence lengths; full-length regression fixtures.');
console.log(JSON.stringify(Object.fromEntries(['Copy the example beside your writing pad. Then try it on your own','Great effort! Here is your next puzzle','That is how we learn! We will practice this idea again'].map(k=>[k,Number(durations[k].toFixed(2))])),null,2));
