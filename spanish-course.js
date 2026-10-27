/* Original beginner Spanish exercises for Number Garden. */
(function(root){'use strict';
 const raw=[
 ['greetings','👋','Hello, Spanish','Start with a greeting. Buenos días means good morning; buenas noches is used for good evening or good night.',[
 ['hola','Hola','hello','👋'],['adios','Adiós','goodbye','🌅'],['dias','Buenos días','good morning','☀️'],['noches','Buenas noches','good night','🌙']]],
 ['polite','🌷','Kind words','Little phrases make a big difference. Por favor means please, and de nada is a reply to gracias.',[
 ['gracias','Gracias','thank you','🌷'],['favor','Por favor','please','🙏'],['nada','De nada',"you’re welcome",'😊'],['siento','Lo siento',"I’m sorry",'💛']]],
 ['people','🧑‍🤝‍🧑','People around you','Tú is an informal way to say you to one person. Mi means my. Amigo is masculine and amiga is feminine.',[
 ['yo','Yo','I','🙋'],['tu','Tú','you (one person)','🫵'],['mama','Mi mamá','my mom','👩'],['papa','Mi papá','my dad','👨'],['amigo','Un amigo','a male friend','🧑'],['amiga','Una amiga','a female friend','👩']]],
 ['numbers','🔢','Count to five','Listen to each number, then try saying the numbers in order: uno, dos, tres, cuatro, cinco.',[
 ['uno','Uno','one','1️⃣'],['dos','Dos','two','2️⃣'],['tres','Tres','three','3️⃣'],['cuatro','Cuatro','four','4️⃣'],['cinco','Cinco','five','5️⃣']]],
 ['colours','🎨','Colourful words','These are basic colour forms. Some colours change their ending to match the noun; we will learn that in later lessons.',[
 ['rojo','Rojo','red','🔴'],['azul','Azul','blue','🔵'],['verde','Verde','green','🟢'],['amarillo','Amarillo','yellow','🟡']]],
 ['animals','🐾','Animal friends','Un means a before these masculine animal words. Keep it with the animal name as you practise.',[
 ['gato','Un gato','a cat','🐈'],['perro','Un perro','a dog','🐕'],['pez','Un pez','a fish','🐟'],['pajaro','Un pájaro','a bird','🐦']]],
 ['food','🍎','A little snack','Una means a or an before a feminine noun, such as una manzana. Practise the whole phrase together.',[
 ['agua','Agua','water','💧'],['pan','Pan','bread','🍞'],['leche','Leche','milk','🥛'],['manzana','Una manzana','an apple','🍎']]],
 ['sentences','💬','My first sentences','Quiero means I want. Spanish can leave out yo because the verb already tells us who is speaking.',[
 ['hello-friend','Hola, amigo.','Hello, friend.','👋'],['want-bread','Yo quiero pan.','I want bread.','🍞'],['want-water','Quiero agua.','I want water.','💧'],['want-apple','Quiero una manzana.','I want an apple.','🍎'],['thanks-mom','Gracias, mamá.','Thank you, Mom.','🌷']]]
 ];
 const units=raw.map((u,index)=>({id:u[0],icon:u[1],name:u[2],note:u[3],items:u[4].map(x=>x[0]),index}));
 const items=Object.fromEntries(raw.flatMap((u,unit)=>u[4].map(x=>[x[0],{id:x[0],es:x[1],en:x[2],emoji:x[3],unit}])));
 root.NumberGardenSpanishCourse={version:1,units,items};
})(typeof window==='undefined'?globalThis:window);
