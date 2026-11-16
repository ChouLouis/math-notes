"use strict";
function parseAnswer(raw) {
 const s=raw.trim(); if(!s) return {error:"先填入答案，再按檢查答案。"};
 const number=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/; let value;
 if(s.includes("/")) {
  const m=s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if(!m) return {error:"請輸入數值或分數，例如 2、0.5 或 1/2。"};
  const n=Number(m[1]),d=Number(m[2]);
  if(!Number.isFinite(n)||!Number.isFinite(d))return {error:"數值太大，請重新輸入。"};
  if(d===0)return {error:"分母不能是 0。"}; value=n/d;
 } else {if(!number.test(s))return {error:"請只填數值或分數，不要輸入變數或算式。"};value=Number(s);}
 if(!Number.isFinite(value))return {error:"請輸入有效且有限的數值。"};return {value};
}
function assessAnswer(raw,answer) {
 const p=parseAnswer(raw); if(p.error)return {state:"invalid",message:p.error};
 return Math.abs(p.value-answer)<1e-9?{state:"correct",message:"答對了！可以再展開詳解，核對自己的計算步驟。"}:{state:"wrong",message:"這個答案還不符合題目。先看提示，再試一次。"};
}
function circleState(k) {
 const distance=Math.abs(k)/5,delta=distance-5;
 return {distance,relation:Math.abs(delta)<1e-9?"相切，1 個交點":delta<0?"相交，2 個交點":"相離，0 個交點"};
}
function vectorState(b) {
 const a=[1,2,2],dot=a.reduce((sum,v,i)=>sum+v*b[i],0),length=Math.hypot(...b);
 return {dot,length,angle:length===0?null:Math.acos(Math.max(-1,Math.min(1,dot/(3*length))))*180/Math.PI};
}
function trigState(degrees) {
 const radians=degrees*Math.PI/180,sin=Math.sin(radians),cos=Math.cos(radians);
 return {sin,cos,tan:Math.abs(cos)<1e-12?null:sin/cos};
}
function fmt(value,digits=3){return (Math.abs(value)<1e-10?0:value).toFixed(digits);}
if(typeof document!=="undefined") {
 const search=document.querySelector("#lesson-search");
 if(search)search.addEventListener("input",()=>{let count=0;const q=search.value.trim().toLowerCase();document.querySelectorAll(".card[data-search]").forEach(card=>{card.hidden=!card.dataset.search.toLowerCase().includes(q);if(!card.hidden)count++;});document.querySelector("#search-status").textContent=`找到 ${count} 個單元`;document.querySelector("#empty").hidden=count!==0;});
 document.querySelectorAll(".quiz").forEach(form=>form.addEventListener("submit",event=>{event.preventDefault();const r=assessAnswer(form.elements.answer.value,Number(form.dataset.answer));const f=form.querySelector(".feedback");f.textContent=r.message;f.dataset.state=r.state;}));
 const kInput=document.querySelector("#line-k");
 if(kInput) {
  const update=()=>{const k=Number(kInput.value),r=circleState(k);document.querySelector("#k-value").textContent=k;document.querySelector("#distance").textContent=fmt(r.distance);document.querySelector("#relation").textContent=r.relation;const line=document.querySelector("#moving-line");line.setAttribute("x1","0");line.setAttribute("y1",String(160-20*(k+24)/4));line.setAttribute("x2","320");line.setAttribute("y2",String(160-20*(k-24)/4));document.querySelector("#circle-graph").setAttribute("aria-label",`圓 x 平方加 y 平方等於 25，與直線 3x 加 4y 等於 ${k}，${r.relation}`);};
  kInput.addEventListener("input",update);document.querySelectorAll("[data-circle-k]").forEach(button=>button.addEventListener("click",()=>{kInput.value=button.dataset.circleK;update();}));update();
 }
 const vectorInputs=Array.from(document.querySelectorAll(".vector-component"));
 if(vectorInputs.length) {
  const update=()=>{const b=vectorInputs.map(i=>Number(i.value)),r=vectorState(b);document.querySelector("#b-display").textContent=`b = (${b.join(", ")})`;vectorInputs.forEach((input,i)=>document.querySelector(`#${input.id}-value`).textContent=b[i]);document.querySelector("#dot-value").textContent=r.dot;document.querySelector("#b-length").textContent=fmt(r.length);document.querySelector("#angle-value").textContent=r.angle===null?"b 是零向量，夾角未定義":`${fmt(r.angle,1)}°`;};vectorInputs.forEach(input=>input.addEventListener("input",update));document.querySelector("#zero-vector").addEventListener("click",()=>{vectorInputs.forEach(i=>i.value="0");update();});update();
 }
 const angleInput=document.querySelector("#theta");
 if(angleInput) {
  const update=()=>{const degrees=Number(angleInput.value),r=trigState(degrees),x=160+110*r.cos,y=160-110*r.sin;document.querySelector("#theta-value").textContent=degrees;document.querySelector("#sin-value").textContent=fmt(r.sin);document.querySelector("#cos-value").textContent=fmt(r.cos);document.querySelector("#tan-value").textContent=r.tan===null?"未定義（cos θ = 0）":fmt(r.tan);document.querySelector("#point").setAttribute("cx",String(x));document.querySelector("#point").setAttribute("cy",String(y));document.querySelector("#radius-line").setAttribute("x2",String(x));document.querySelector("#radius-line").setAttribute("y2",String(y));document.querySelector("#unit-circle").setAttribute("aria-label",`單位圓，角度 ${degrees} 度，點座標約為 (${fmt(r.cos)}, ${fmt(r.sin)})`);};angleInput.addEventListener("input",update);document.querySelectorAll("[data-theta]").forEach(button=>button.addEventListener("click",()=>{angleInput.value=button.dataset.theta;update();}));update();
 }
}
