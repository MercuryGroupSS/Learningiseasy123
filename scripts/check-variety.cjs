const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');let seed=1701;const seededMath=Object.create(Math);seededMath.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const ctx=vm.createContext({Math:seededMath});vm.runInContext(html.slice(html.indexOf('const STAGES='),html.indexOf('const LESSON_SIZE='))+"const LESSON_SIZE=8;let progress={misses:{},recentQuestions:[],level:0,session:null};"+html.slice(html.indexOf('const rnd='),html.indexOf('function start(')),ctx);const run=s=>vm.runInContext(s,ctx);
let rounds=0;
for(let level=0;level<12;level++){
 run('progress.recentQuestions=[]');let previous=null;
 for(let i=0;i<200;i++){
  const round=run(`buildRound(${level})`);assert.equal(round.items.length,8);assert.equal(round.reviewCount,level===11?8:level?3:0);assert.equal(round.varietyVersion,1);
  if(level===0){const counts={};round.items.forEach(q=>counts[q.answer]=(counts[q.answer]||0)+1);assert.equal(Object.keys(counts).length,5);assert(Math.max(...Object.values(counts))<=2);assert.equal(new Set(round.items.slice(0,5).map(q=>q.answer)).size,5)}
  for(const q of round.items){assert.equal(q.answer,q.op==='+'?q.a+q.b:q.op==='−'?q.a-q.b:q.a);if(previous){ctx.prev=previous;ctx.current=q;const pool=run('questionPool(current.source)');if(pool.some(candidate=>candidate.answer!==previous.answer))assert.notEqual(q.answer,previous.answer,'consecutive repeated answer when alternatives exist');}previous=q;ctx.current=q;run('rememberQuestion(current)')}
  rounds++;
 }
}
// Number-bond rounds deliberately all total ten, but still use different pairs.
run('progress.recentQuestions=[]');const bond=run('variedQuestions(Array(8).fill(3))');assert.equal(new Set(bond.map(q=>q.id)).size,8);assert(bond.every(q=>q.answer===10));
// Existing saved lessons retain their current question and checked-answer count.
run("progress={level:0,misses:{},recentQuestions:[],session:{items:Array.from({length:8},()=>({...questionPool(0)[1]})),index:0,correct:0}};refreshPendingQuestions()");const repaired=run('progress.session');assert.equal(repaired.items[0].answer,2);assert.equal(repaired.index,0);assert.equal(repaired.correct,0);for(let i=1;i<8;i++)assert.notEqual(repaired.items[i].answer,repaired.items[i-1].answer);assert.equal(new Set(repaired.items.map(q=>q.answer)).size,5);assert.equal(repaired.varietyVersion,1);const snapshot=JSON.stringify(repaired);run('refreshPendingQuestions()');assert.equal(JSON.stringify(run('progress.session')),snapshot);
// History survives profile saves and does not leak into another player's game.
const storage={};const profileCtx=vm.createContext({window:{},Math,Date});vm.runInContext(fs.readFileSync(path.join(root,'player-profiles.js'),'utf8'),profileCtx);const profiles=profileCtx.window.NumberGardenProfiles.create({getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v});profiles.saveProgress({recentQuestions:[{id:'2=2',source:0,a:2,answer:2}]});profiles.add('Another player');assert.equal(profiles.current().progress.recentQuestions.length,0);profiles.select('player-1');assert.equal(profiles.current().progress.recentQuestions[0].answer,2);
console.log(`PASS: ${rounds} rounds / ${rounds*8} questions; balanced counting; no adjacent repeated answers where alternatives exist; review ratios; bond variety; saved-lesson repair; per-player history.`);
