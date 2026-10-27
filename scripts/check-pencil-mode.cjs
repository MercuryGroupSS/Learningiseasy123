const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function setup(saved,blocked=false){
 const handlers={},values={numberGardenWritingMode:saved},captures=new Set(),elements={writingMode:{value:'pen'},writingModeHint:{textContent:''},pad:{getContext(){return{}},setAttribute(){},getBoundingClientRect(){return{left:0,top:0}},setPointerCapture:id=>captures.add(id),hasPointerCapture:id=>captures.has(id),releasePointerCapture:id=>captures.delete(id),addEventListener:(name,fn)=>handlers[name]=fn}};
 const ctx=vm.createContext({$:id=>elements[id],window:{addEventListener(){}},localStorage:{getItem:k=>{if(blocked)throw Error('storage blocked');return values[k]},setItem:(k,v)=>{if(blocked)throw Error('storage blocked');values[k]=v}}});
 const source='let ink=[],drawing=false;function draw(){}function resize(){}'+html.slice(html.indexOf("const pad=$('pad')"),html.indexOf('const glyphs='))+html.slice(html.indexOf('function point('),html.indexOf('function enoughInk('));vm.runInContext(source,ctx);
 const read=s=>vm.runInContext(s,ctx),event=(type,id,x=0)=>({pointerType:type,pointerId:id,clientX:x,clientY:x,preventDefault(){}});
 return {read,elements,values,send:(name,type,id,x)=>handlers[name](event(type,id,x))};
}
const p=setup();assert.equal(p.read('writingMode'),'pen');
for(const type of ['touch','mouse','']){p.send('pointerdown',type,1);p.send('pointermove',type,1,50);p.send('pointerup',type,1)}assert.equal(p.read('ink.length'),0,'finger, palm, mouse, and unknown input rejected by default');
p.send('pointerdown','touch',8);p.send('pointerdown','pen',2);p.send('pointermove','pen',2,10);assert.equal(p.read('ink[0].length'),2);
p.send('pointerdown','touch',8);p.send('pointermove','touch',8,500);p.send('pointerup','touch',8);assert.equal(p.read('drawing'),true);assert.equal(p.read('ink.length'),1);assert.equal(p.read('ink[0].length'),2);
p.send('pointermove','pen',2,20);p.send('pointerdown','pen',3);p.send('pointermove','pen',3,900);assert.equal(p.read('ink[0].length'),3);assert.equal(p.read('ink.length'),1);p.send('pointerup','pen',2);assert.equal(p.read('drawing'),false);
p.send('pointerdown','pen',4);p.send('pointercancel','touch',8);assert(p.read('drawing'));p.send('pointercancel','pen',4);assert(!p.read('drawing'));p.send('pointermove','pen',4,30);assert.equal(p.read('ink[1].length'),1);
p.send('pointerdown','pen',5);p.send('lostpointercapture','pen',5);assert(!p.read('drawing'));
p.elements.writingMode.value='all';p.elements.writingMode.onchange();assert.equal(p.values.numberGardenWritingMode,'all');p.send('pointerdown','touch',7);p.send('pointermove','touch',7,40);p.send('pointerup','touch',7);assert.equal(p.read('ink.at(-1).length'),2);
p.send('pointerdown','mouse',10);assert(p.read('drawing'));p.elements.writingMode.value='pen';p.elements.writingMode.onchange();assert(!p.read('drawing'));const n=p.read('ink.length');p.send('pointermove','mouse',10,60);p.send('pointerdown','touch',9);assert.equal(p.read('ink.length'),n);assert.equal(p.values.numberGardenWritingMode,'pen');
assert.equal(setup('all').read('writingMode'),'all');assert.equal(setup('bogus').read('writingMode'),'pen');assert.equal(setup(undefined,true).read('writingMode'),'pen');
console.log('PASS: pen-only default; palm before/during pen stroke; unrelated pointer events; cancel/lost capture; one active stroke; finger/mouse opt-in; switching modes; saved preference and blocked storage.');
