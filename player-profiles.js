/* Named saves stay in this browser. No names or game progress are transmitted. */
(function(root){'use strict';
 const KEY='numberGardenPlayersV1',LEGACY='numberGardenProgressV4';
 const clone=value=>JSON.parse(JSON.stringify(value));
 const integer=(v,max=Number.MAX_SAFE_INTEGER)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
 function cleanProgress(value){const p=value&&typeof value==='object'?value:{};const unlocked=integer(p.unlocked,11);const result={unlocked,level:Math.min(integer(p.level,11),unlocked),stars:integer(p.stars),done:integer(p.done),records:{},misses:{},session:null};
  for(let i=0;i<12;i++){if(p.records?.[i]!==undefined)result.records[i]=integer(p.records[i],8);if(p.misses?.[i]!==undefined)result.misses[i]=integer(p.misses[i],6)}
  const s=p.session;if(s&&Array.isArray(s.items)&&s.items.length===8&&Number.isInteger(s.index)&&s.index>=0&&s.index<=8&&Number.isInteger(s.correct)&&s.correct>=0&&s.correct<=s.index&&s.items.every(q=>q&&Number.isInteger(q.a)&&q.a>=0&&q.a<=160&&Number.isInteger(q.b)&&q.b>=0&&q.b<=160&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<=160&&['','+','−'].includes(q.op)&&q.answer===(q.op==='+'?q.a+q.b:q.op==='−'?q.a-q.b:q.a)&&Number.isInteger(q.source)&&q.source>=0&&q.source<=11))result.session=clone(s);
  result.subject=p.subject==='spanish'?'spanish':'math';result.spanish=p.spanish&&typeof p.spanish==='object'&&!Array.isArray(p.spanish)?clone(p.spanish):{};
  result.recentQuestions=Array.isArray(p.recentQuestions)?p.recentQuestions.filter(q=>q&&typeof q.id==='string'&&q.id.length<60&&Number.isInteger(q.source)&&q.source>=0&&q.source<=11&&Number.isInteger(q.a)&&q.a>=0&&q.a<=160&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<=160).slice(-12).map(q=>({id:q.id,source:q.source,a:q.a,answer:q.answer})):[];
  const ui=p.ui||{};result.ui={phase:integer(ui.phase,3),traceIndex:integer(ui.traceIndex,2),hintStep:integer(ui.hintStep,4),checking:ui.checking===true,ink:Array.isArray(ui.ink)?ui.ink.slice(0,100).filter(Array.isArray).map(stroke=>stroke.slice(0,2000).filter(pt=>Number.isFinite(pt?.x)&&Number.isFinite(pt?.y)).map(pt=>({x:pt.x,y:pt.y}))):[]};return result;
 }
 function create(storage){let persistent=true,state;const read=key=>{try{return JSON.parse(storage.getItem(key)||'null')}catch{return null}};
  const saved=read(KEY);if(saved?.schema===1&&Array.isArray(saved.players)){
   const ids=new Set();const players=saved.players.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string'&&p.name.trim()&&!ids.has(p.id)&&ids.add(p.id)).map(p=>({id:p.id,name:p.name.trim().slice(0,40),progress:cleanProgress(p.progress)}));
   if(players.length)state={schema:1,activeId:players.some(p=>p.id===saved.activeId)?saved.activeId:players[0].id,players};
  }
  if(!state)state={schema:1,activeId:'player-1',players:[{id:'player-1',name:'Player 1',progress:cleanProgress(read(LEGACY))}]};
  function persist(){try{storage.setItem(KEY,JSON.stringify(state));persistent=true}catch{persistent=false}return persistent}
  function active(){return state.players.find(p=>p.id===state.activeId)}
  function nameFor(value,except){const name=String(value||'').normalize('NFKC').trim().replace(/\s+/g,' ');if(!name)throw Error('Please enter a player name.');if(name.length>40)throw Error('Please use a name with 40 characters or fewer.');if(state.players.some(p=>p.id!==except&&p.name.toLowerCase()===name.toLowerCase()))throw Error('That name is already in the player list. Choose it there or use another name.');return name}
  return {list:()=>state.players.map(p=>({id:p.id,name:p.name})),current:()=>clone(active()),isPersistent:()=>persistent,
   saveProgress(progress){active().progress=cleanProgress(progress);return persist()},
   select(id){if(!state.players.some(p=>p.id===id))throw Error('Choose a player from the list.');state.activeId=id;persist();return clone(active())},
   add(value){const name=nameFor(value);let id;do{id=root.crypto?.randomUUID?.()||'player-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}while(state.players.some(p=>p.id===id));state.players.push({id,name,progress:cleanProgress({})});state.activeId=id;persist();return clone(active())},
   rename(value){active().name=nameFor(value,active().id);persist();return clone(active())}
  };
 }
 root.NumberGardenProfiles={create,cleanProgress};
})(window);
