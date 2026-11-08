// Shared backup format for manual expenses. Existing financial-input keys are unchanged.
(()=>{
 const key='otium-expenses-v1';
 function validate(value){
  if(!Array.isArray(value)||value.length>100000)throw Error('Invalid expense records.');
  const ids=new Set();
  return value.map(e=>{
   if(!e||typeof e.id!=='string'||!e.id||ids.has(e.id)||typeof e.category!=='string'||!e.category||typeof e.retailer!=='string'||!e.retailer.trim()||e.retailer.length>120||typeof e.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!Number.isSafeInteger(e.pence)||e.pence<=0||e.pence>100000000)throw Error('Invalid expense record.');
   const d=new Date(e.date+'T12:00:00');if(isNaN(d.getTime())||d.getFullYear()!==Number(e.date.slice(0,4))||d.getMonth()+1!==Number(e.date.slice(5,7))||d.getDate()!==Number(e.date.slice(8,10)))throw Error('Invalid expense date.');
   ids.add(e.id);return{id:e.id,category:e.category,retailer:e.retailer,date:e.date,pence:e.pence,created:Number.isFinite(e.created)?e.created:0};
  });
 }
 function read(){try{return validate(JSON.parse(previewStorage.getItem(key))||[])}catch{return []}}
 function preserveCategoryIds(incoming,previous){return Object.fromEntries(Object.entries(incoming).map(([year,b])=>[year,{...b,rows:b.rows.map((r,i)=>{const old=previous[year]?.rows||[];return[r[0],r[1],r[2]||old.find(p=>p[0]===r[0])?.[2]||old[i]?.[2]||crypto.randomUUID()]})}]))}
 window.OtiumExpenseStore=Object.freeze({key,validate,read,preserveCategoryIds});
})();
