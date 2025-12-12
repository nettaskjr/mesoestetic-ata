(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=i(e);fetch(e.href,n)}})();async function a(){try{let t=await fetch("data.json");return(!t.ok||(await t.clone().text()).length===0)&&(console.warn("data.json empty or missing, falling back to mock_data.json"),t=await fetch("mock_data.json")),await t.json()}catch(t){return console.error("Error fetching data:",t),(await fetch("mock_data.json")).json()}}function c(t){if(!t)return"";const o=["strengths","weaknesses","opportunities","threats"],i={strengths:"Forças",weaknesses:"Fraquezas",opportunities:"Oportunidades",threats:"Ameaças"};return`
    <div class="swot-grid">
      ${o.map(s=>`
        <div class="swot-sector">
          <h3>${i[s]}</h3>
          <ul class="swot-list">
            ${(t[s]||[]).map(e=>`<li>${e}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  `}function l(t){return t?`
    <div class="objectives-list">
      ${t.map(o=>`
        <div class="objective-item">
          <span class="objective-goal">${o.goal}</span>
          <div class="objective-meta">
            <span>Meta: ${o.target}</span> • 
            <span>Prazo: ${o.deadline}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `:""}function d(t){const o=document.getElementById("dashboard"),i=t.map((s,e)=>{let n="";return s.content&&s.content.swot?n=c(s.content.swot):s.items?n=l(s.items):s.events?n=`<ul class="swot-list">${s.events.map(r=>`<li><b>${r.date}</b>: ${r.event}</li>`).join("")}</ul>`:s.kpis?n=`
        <div class="swot-grid">
          ${s.kpis.map(r=>`
            <div class="swot-sector" style="text-align: center;">
              <h3>${r.name}</h3>
              <div style="font-size: 2rem; font-weight: 700;">${r.value}</div>
            </div>
          `).join("")}
        </div>
      `:typeof s.content=="string"&&(n=`<p>${s.content}</p>`),`
      <section class="card fade-in" style="animation-delay: ${e*.1}s">
        <h2>${s.title}</h2>
        ${n}
      </section>
    `}).join("");o.innerHTML=i}async function f(){const t=await a();t.sections&&d(t.sections)}f();
