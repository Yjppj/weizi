(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const G="modulepreload",U=function(e,t){return new URL(e,t).href},F={},Y=function(t,n,i){if(!n||n.length===0)return t();const r=document.getElementsByTagName("link");return Promise.all(n.map(s=>{if(s=U(s,i),s in F)return;F[s]=!0;const a=s.endsWith(".css"),d=a?'[rel="stylesheet"]':"";if(!!i)for(let m=r.length-1;m>=0;m--){const b=r[m];if(b.href===s&&(!a||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${d}`))return;const l=document.createElement("link");if(l.rel=a?"stylesheet":G,a||(l.as="script",l.crossOrigin=""),l.href=s,document.head.appendChild(l),a)return new Promise((m,b)=>{l.addEventListener("load",m),l.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>t())},J=6e3,W=200,X=500,N="weizi.selectedTableId",h={Checking:"checking",Connected:"connected",Disconnected:"disconnected",PermissionDenied:"permission",Error:"error"};function Z(e,t,n){let i;const r=new Promise((s,a)=>{i=window.setTimeout(()=>a(new Error(n)),t)});return Promise.race([e,r]).finally(()=>window.clearTimeout(i))}function Q(e){const t=String((e==null?void 0:e.message)||e||""),n=t.toLowerCase();return n.includes("permission")||t.includes("\u6743\u9650")||t.includes("\u6CA1\u6709\u6743\u9650")||t.includes("\u65E0\u6743\u9650")?h.PermissionDenied:t.includes("\u8D85\u65F6")||n.includes("timeout")||n.includes("not in")||n.includes("bridge")?h.Disconnected:h.Error}function q(){try{return window.self!==window.top}catch{return!0}}async function ee(){var e;try{const{bitable:t,DashboardState:n}=await Y(()=>import("./index.39ff328f.js").then(u=>u.i),[],import.meta.url),i=await Z(t.base.getSelection(),J,"SDK \u63E1\u624B\u8D85\u65F6\uFF0C\u672A\u8FDE\u63A5\u5230\u98DE\u4E66\u63D2\u4EF6\u73AF\u5883"),[r,s,a,d]=await Promise.all([t.base.getTableMetaList(),M(()=>t.bridge.getTheme()),M(()=>{var u,l;return(l=(u=t.bridge).getEnv)==null?void 0:l.call(u)}),M(()=>{var u,l;return(l=(u=t.bridge).getInstanceId)==null?void 0:l.call(u)})]);return{state:h.Connected,bitable:t,DashboardState:n,selection:i,tableMetaList:Array.isArray(r)?r:[],theme:s||"LIGHT",env:a,instanceId:d,dashboardState:((e=t.dashboard)==null?void 0:e.state)||null}}catch(t){const n=Q(t),i=q()?te(t,n):"\u672A\u8FDE\u63A5\u98DE\u4E66\u63D2\u4EF6\u73AF\u5883\u3002\u5F53\u524D\u662F\u666E\u901A\u6D4F\u89C8\u5668\u9875\u9762\u3002\u8BF7\u628A\u670D\u52A1\u5730\u5740\u586B\u5230\u98DE\u4E66\u300C\u5E94\u7528\u6A21\u5F0F \u2192 \u6DFB\u52A0\u7EC4\u4EF6 \u2192 \u63D2\u4EF6 \u2192 \u6DFB\u52A0\u81EA\u5B9A\u4E49\u63D2\u4EF6\u300D\u4E2D\u6253\u5F00\u3002";return{state:n===h.Error&&!q()?h.Disconnected:n,reason:i,error:t}}}async function M(e){try{const t=e();return t==null?null:await t}catch{return null}}function te(e,t){return t===h.PermissionDenied?"\u5F53\u524D\u8D26\u53F7\u6CA1\u6709\u8BFB\u53D6\u8FD9\u5F20\u591A\u7EF4\u8868\u683C\u7684\u6743\u9650\u3002\u8BF7\u786E\u8BA4\u6587\u6863\u6743\u9650\u6216\u9AD8\u7EA7\u6743\u9650\u914D\u7F6E\u3002":t===h.Disconnected?"\u672A\u8FDE\u63A5\u98DE\u4E66\u63D2\u4EF6\u73AF\u5883\u3002\u8BF7\u5728\u98DE\u4E66\u591A\u7EF4\u8868\u683C\u5E94\u7528\u6A21\u5F0F\u4E2D\u901A\u8FC7\u81EA\u5B9A\u4E49\u63D2\u4EF6\u6253\u5F00\u672C\u9875\u9762\u3002":String((e==null?void 0:e.message)||e||"\u8BFB\u53D6\u5931\u8D25")}async function ne(e,t){const n=await e.base.getTableById(t),[i,r]=await Promise.all([n.getName(),n.getFieldMetaList()]),s=await re(n);return{table:n,tableId:n.id||t,name:i,fields:(r||[]).map(ie),records:s}}async function re(e){const t=[];let n,i=!0,r=0;const s=e.getRecordsByPage?a=>e.getRecordsByPage(a):a=>e.getRecords(a);for(;i&&r<X;){r+=1;const a=await s({pageSize:W,pageToken:n});t.push(...a.records||[]),i=Boolean(a.hasMore),n=a.pageToken,(n==null||n==="")&&(i=!1)}return t}function ie(e){return{id:e.id,name:e.name,type:e.type,isPrimary:Boolean(e.isPrimary),property:e.property||null}}function se(e,t){const n=[],i=["onRecordAdd","onRecordModify","onRecordDelete","onFieldAdd","onFieldModify","onFieldDelete"];for(const r of i)typeof e[r]=="function"&&n.push(e[r](()=>t(r)));return()=>{n.forEach(r=>{try{r==null||r()}catch{}})}}function oe(e,t){var i,r;const n=[];return typeof e.base.onTableAdd=="function"&&n.push(e.base.onTableAdd(()=>t("onTableAdd"))),typeof e.base.onTableDelete=="function"&&n.push(e.base.onTableDelete(()=>t("onTableDelete"))),typeof((i=e.dashboard)==null?void 0:i.onDataChange)=="function"&&n.push(e.dashboard.onDataChange(()=>t("onDashboardDataChange"))),typeof((r=e.dashboard)==null?void 0:r.onConfigChange)=="function"&&n.push(e.dashboard.onConfigChange(()=>t("onDashboardConfigChange"))),()=>n.forEach(s=>s==null?void 0:s())}async function ae(e){const t=await e.base.getTableMetaList();return Array.isArray(t)?t:[]}function ce(e){try{sessionStorage.setItem(N,e)}catch{}}function le(){try{return sessionStorage.getItem(N)}catch{return null}}async function _(e){var t,n;try{await((n=(t=e.dashboard)==null?void 0:t.setRendered)==null?void 0:n.call(t))}catch{}}async function de(e,t){const n=e.dashboard;if(!n||typeof n.saveConfig!="function")return{saved:!1};const i=n.state;if(!(i==="Config"||i==="Create"))return{saved:!1,state:i};try{return await n.saveConfig({dataConditions:t?[{tableId:t,series:"COUNTA"}]:[],customConfig:{workbench:!0}}),{saved:!0,state:i}}catch(s){return{saved:!1,state:i,error:s}}}const ue={1:"\u591A\u884C\u6587\u672C",2:"\u6570\u5B57",3:"\u5355\u9009",4:"\u591A\u9009",5:"\u65E5\u671F",7:"\u590D\u9009\u6846",11:"\u4EBA\u5458",13:"\u7535\u8BDD",15:"\u8D85\u94FE\u63A5",17:"\u9644\u4EF6",18:"\u5355\u5411\u5173\u8054",19:"\u67E5\u627E\u5F15\u7528",20:"\u516C\u5F0F",21:"\u53CC\u5411\u5173\u8054",22:"\u5730\u7406\u4F4D\u7F6E",23:"\u7FA4\u804A",1001:"\u521B\u5EFA\u65F6\u95F4",1002:"\u4FEE\u6539\u65F6\u95F4",1003:"\u521B\u5EFA\u4EBA",1004:"\u4FEE\u6539\u4EBA",1005:"\u81EA\u52A8\u7F16\u53F7",99001:"\u6761\u7801",99002:"\u8FDB\u5EA6",99003:"\u8D27\u5E01",99004:"\u8BC4\u5206",99005:"\u90AE\u7BB1"};function x(e){return ue[e]||`\u672A\u77E5\u7C7B\u578B(${e})`}function fe(e,t){return t.map(n=>he(e,n))}function he(e,t){var r;const n={},i={};for(const s of e){const a=(r=t.fields)==null?void 0:r[s.id];n[s.id]=a!=null?a:null,i[s.id]=pe(a,s)}return{recordId:t.recordId,values:n,display:i,searchText:Object.values(i).join(" ").toLowerCase()}}function pe(e,t){if(e==null||e==="")return"";const n=t==null?void 0:t.type;if(n===5||n===1001||n===1002)return me(e);if(n===7)return e===!0||e===1?"\u662F":"\u5426";if(n===99002){const i=typeof e=="number"?e:Number(e);return Number.isFinite(i)?`${Math.round(i*100)}%`:String(e)}return E(e)}function E(e){if(e==null||e==="")return"";if(typeof e=="string")return e;if(typeof e=="number")return P(e);if(typeof e=="boolean")return e?"\u662F":"\u5426";if(Array.isArray(e))return e.map(t=>E(t)).filter(Boolean).join(", ");if(typeof e=="object"){if(typeof e.text=="string")return e.text;if(typeof e.name=="string")return e.name;if(typeof e.fullName=="string")return e.fullName;if(typeof e.en_name=="string")return e.en_name;if(typeof e.link=="string")return e.text||e.link;if(typeof e.url=="string")return e.text||e.url;if(typeof e.address=="string")return e.address;if(typeof e.fullAddress=="string")return e.fullAddress;if(typeof e.email=="string")return e.email;if(typeof e.phone=="string")return e.phone;if(typeof e.token=="string")return e.name||e.token;if(typeof e.id=="string"&&typeof e.name=="string")return e.name;if(typeof e.value=="number")return P(e.value);try{return JSON.stringify(e)}catch{return String(e)}}return String(e)}function P(e){return!Number.isFinite(e)||Number.isInteger(e)?String(e):String(Math.round(e*1e3)/1e3)}function me(e){const t=typeof e=="number"?e:Date.parse(e);if(!Number.isFinite(t))return E(e);const n=new Date(t),i=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),s=String(n.getDate()).padStart(2,"0"),a=String(n.getHours()).padStart(2,"0"),d=String(n.getMinutes()).padStart(2,"0");return a==="00"&&d==="00"?`${i}-${r}-${s}`:`${i}-${r}-${s} ${a}:${d}`}function be(e,t){const n={};for(const d of e){const u=x(d.type);n[u]=(n[u]||0)+1}const i=e.find(d=>d.type===3||d.type===4),r={};if(i)for(const d of t){const l=(d.display[i.id]||"\u672A\u586B\u5199").split(", ").filter(Boolean),m=l.length?l:["\u672A\u586B\u5199"];for(const b of m)r[b]=(r[b]||0)+1}const s=t.reduce((d,u)=>d+e.filter(l=>u.display[l.id]).length,0),a=Math.max(e.length*t.length,1);return{recordCount:t.length,fieldCount:e.length,fillRate:Math.round(s/a*100),typeCounts:n,categoryField:i?i.name:null,categoryCounts:r}}function ye(e,t,n){const i=t.trim().toLowerCase();return!i&&!n?e:e.filter(r=>{if(n){const s=(r.display[n]||"").toLowerCase();return i?s.includes(i):Boolean(s)}return r.searchText.includes(i)})}function j(e){return e.find(t=>t.isPrimary)||e[0]||null}const g={table:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 9h18M9 9v11M15 9v11" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',refresh:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.2-5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M20 5v5h-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l9 16H3L12 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="17.5" r="0.9" fill="currentColor"/></svg>',plug:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V3M16 7V3M7 7h10v5a5 5 0 0 1-10 0V7zM12 17v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',lock:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',empty:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10h8M8 14h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'};function ge(e){return e.innerHTML=`
    <div class="app">
      <header class="topbar">
        <div class="brand">
          <span class="mark"></span>
          <div>
            <p class="kicker">Feishu Base Plugin</p>
            <h1>\u6570\u636E\u5DE5\u4F5C\u53F0</h1>
          </div>
        </div>
        <div class="topbar-actions">
          <div id="status-chip" class="status-chip is-checking">
            <span class="dot"></span>
            <span id="status-text">\u6B63\u5728\u8FDE\u63A5\u98DE\u4E66\u63D2\u4EF6\u73AF\u5883</span>
          </div>
          <button id="refresh-btn" class="btn" type="button" disabled>
            ${g.refresh}
            <span>\u5237\u65B0</span>
          </button>
        </div>
      </header>

      <aside class="sidebar">
        <div class="sidebar-head">
          <span>\u6570\u636E\u8868</span>
          <strong id="table-count">0</strong>
        </div>
        <nav id="table-nav" class="table-nav"></nav>
      </aside>

      <main class="main">
        <section class="overview">
          <article class="metric">
            <p>\u8BB0\u5F55\u603B\u91CF</p>
            <strong id="metric-records">\u2014</strong>
          </article>
          <article class="metric">
            <p>\u5B57\u6BB5\u6570\u91CF</p>
            <strong id="metric-fields">\u2014</strong>
          </article>
          <article class="metric">
            <p>\u586B\u5199\u5B8C\u6574\u5EA6</p>
            <strong id="metric-fill">\u2014</strong>
          </article>
          <article class="metric metric-wide">
            <p id="chart-title">\u5B57\u6BB5\u7C7B\u578B\u5206\u5E03</p>
            <div id="chart" class="chart"></div>
          </article>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2 id="table-title">\u8BB0\u5F55\u5217\u8868</h2>
              <p id="table-subtitle" class="muted">\u7B49\u5F85\u8FDE\u63A5\u540E\u8BFB\u53D6\u771F\u5B9E\u6570\u636E</p>
            </div>
            <div class="toolbar">
              <label class="search">
                ${g.search}
                <input id="search-input" type="search" placeholder="\u641C\u7D22\u8BB0\u5F55" autocomplete="off" />
              </label>
              <select id="field-filter"></select>
            </div>
          </div>
          <div id="content" class="content"></div>
        </section>
      </main>
    </div>

    <aside id="detail" class="detail" hidden>
      <div class="detail-head">
        <div>
          <p class="kicker">\u8BB0\u5F55\u8BE6\u60C5</p>
          <h2 id="detail-title">\u672A\u9009\u62E9\u8BB0\u5F55</h2>
        </div>
        <button id="detail-close" class="icon-btn" type="button" aria-label="\u5173\u95ED\u8BE6\u60C5">
          ${g.close}
        </button>
      </div>
      <dl id="detail-body" class="detail-body"></dl>
    </aside>
  `,{statusChip:e.querySelector("#status-chip"),statusText:e.querySelector("#status-text"),refreshBtn:e.querySelector("#refresh-btn"),tableCount:e.querySelector("#table-count"),tableNav:e.querySelector("#table-nav"),metricRecords:e.querySelector("#metric-records"),metricFields:e.querySelector("#metric-fields"),metricFill:e.querySelector("#metric-fill"),chartTitle:e.querySelector("#chart-title"),chart:e.querySelector("#chart"),tableTitle:e.querySelector("#table-title"),tableSubtitle:e.querySelector("#table-subtitle"),searchInput:e.querySelector("#search-input"),fieldFilter:e.querySelector("#field-filter"),content:e.querySelector("#content"),detail:e.querySelector("#detail"),detailTitle:e.querySelector("#detail-title"),detailBody:e.querySelector("#detail-body"),detailClose:e.querySelector("#detail-close")}}function Ce(e){document.documentElement.dataset.theme=String(e||"LIGHT").toLowerCase()}function w(e,t,n){e.statusChip.className=`status-chip is-${t}`,e.statusText.textContent=n,e.refreshBtn.disabled=t===h.Checking}function S(e,t,n,i){if(e.tableCount.textContent=String(t.length),!t.length){e.tableNav.innerHTML='<p class="nav-empty">\u6682\u65E0\u53EF\u7528\u6570\u636E\u8868</p>';return}e.tableNav.innerHTML=t.map(r=>`
        <button class="nav-item ${r.id===n?"is-active":""}" data-id="${v(r.id)}" type="button">
          ${g.table}
          <span>${f(r.name||r.id)}</span>
        </button>
      `).join(""),e.tableNav.querySelectorAll(".nav-item").forEach(r=>{r.addEventListener("click",()=>i(r.dataset.id))})}function C(e,t,n,i="plug"){Le(e),e.chart.innerHTML="",e.tableTitle.textContent="\u8BB0\u5F55\u5217\u8868",e.tableSubtitle.textContent=t,e.content.innerHTML=$(i,t,n)}function we(e,t){e.content.innerHTML=`
    <div class="skeleton-list">
      <p class="muted">${f(t)}</p>
      ${Array.from({length:6},()=>'<div class="skeleton-row"></div>').join("")}
    </div>
  `}function Te(e,t,n,i,r){const{name:s,tableId:a,fields:d,records:u,stats:l}=t,m=ye(u,n,i),b=j(d),B=d.slice(0,6);if(e.metricRecords.textContent=R(l.recordCount),e.metricFields.textContent=R(l.fieldCount),e.metricFill.textContent=`${l.fillRate}%`,e.tableTitle.textContent=s,e.tableSubtitle.textContent=`${l.recordCount} \u6761\u771F\u5B9E\u8BB0\u5F55 \xB7 ${l.fieldCount} \u4E2A\u5B57\u6BB5 \xB7 ${a}`,Se(e,d,i),ve(e,l),!u.length){e.content.innerHTML=$("empty","\u8FD9\u5F20\u8868\u6CA1\u6709\u8BB0\u5F55","\u5B57\u6BB5\u4FE1\u606F\u5DF2\u8BFB\u53D6\u6210\u529F\uFF0C\u4F46\u5F53\u524D\u8868\u4E2D\u6CA1\u6709\u53EF\u5C55\u793A\u7684\u884C\u3002");return}if(!m.length){e.content.innerHTML=$("search","\u6CA1\u6709\u5339\u914D\u7684\u8BB0\u5F55","\u8BF7\u8C03\u6574\u641C\u7D22\u5173\u952E\u8BCD\u6216\u7B5B\u9009\u5B57\u6BB5\u3002");return}e.content.innerHTML=`
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${B.map(p=>`<th>${f(p.name)}<small>${f(x(p.type))}</small></th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${m.map(p=>{const k=b&&p.display[b.id]||p.recordId;return`
                <tr data-id="${v(p.recordId)}" tabindex="0">
                  ${B.map((y,L)=>{const A=p.display[y.id]||"\u2014";return`<td data-label="${v(y.name)}">${L===0?`<strong>${f(A||k)}</strong>`:f(A)}</td>`}).join("")}
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </div>
  `,e.content.querySelectorAll("tr[data-id]").forEach(p=>{const k=()=>{const y=m.find(L=>L.recordId===p.dataset.id);y&&r(y,d,s)};p.addEventListener("click",k),p.addEventListener("keydown",y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),k())})})}function ke(e,t,n,i){const r=j(n);e.detail.hidden=!1,e.detail.classList.add("is-open"),e.detailTitle.textContent=r&&t.display[r.id]||t.recordId,e.detailBody.innerHTML=`
    <div class="detail-meta">
      <span>${f(i)}</span>
      <span>${f(t.recordId)}</span>
    </div>
    ${n.map(s=>`
          <div class="detail-row">
            <dt>
              ${f(s.name)}
              <small>${f(x(s.type))} \xB7 ${f(s.id)}</small>
            </dt>
            <dd>${f(t.display[s.id]||"\u7A7A")}</dd>
          </div>
        `).join("")}
  `}function H(e){e.detail.classList.remove("is-open"),window.setTimeout(()=>{e.detail.classList.contains("is-open")||(e.detail.hidden=!0)},220)}function Se(e,t,n){const i=n||"";e.fieldFilter.innerHTML=`
    <option value="">\u5168\u90E8\u5B57\u6BB5</option>
    ${t.map(r=>`<option value="${v(r.id)}">${f(r.name)}</option>`).join("")}
  `,e.fieldFilter.value=i}function ve(e,t){const n=t.categoryField&&Object.keys(t.categoryCounts).length?t.categoryCounts:t.typeCounts;e.chartTitle.textContent=t.categoryField?`${t.categoryField} \u5206\u5E03`:"\u5B57\u6BB5\u7C7B\u578B\u5206\u5E03";const i=Object.entries(n).sort((s,a)=>a[1]-s[1]).slice(0,6),r=Math.max(...i.map(s=>s[1]),1);if(!i.length){e.chart.innerHTML='<p class="muted">\u6682\u65E0\u53EF\u89C6\u5316\u6570\u636E</p>';return}e.chart.innerHTML=i.map(([s,a])=>{const d=Math.max(a/r*100,6);return`
        <div class="bar">
          <span>${f(s)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${d}%"></div></div>
          <em>${a}</em>
        </div>
      `}).join("")}function Le(e){e.metricRecords.textContent="\u2014",e.metricFields.textContent="\u2014",e.metricFill.textContent="\u2014"}function $(e,t,n){return`
    <div class="state-card">
      <span class="state-icon">${g[e]||g.warning}</span>
      <h3>${f(t)}</h3>
      <p>${f(n)}</p>
    </div>
  `}function R(e){return new Intl.NumberFormat("zh-CN").format(e)}function f(e){return String(e!=null?e:"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function v(e){return f(e).replaceAll("'","&#39;")}const Me=document.querySelector("#app"),c=ge(Me),o={session:null,tables:[],activeTableId:null,payload:null,query:"",fieldId:"",unsubTable:null,unsubBase:null,reloadTimer:null};c.refreshBtn.addEventListener("click",()=>{var e;if(!((e=o.session)!=null&&e.bitable)){D();return}V()});c.searchInput.addEventListener("input",()=>{o.query=c.searchInput.value,I()});c.fieldFilter.addEventListener("change",()=>{o.fieldId=c.fieldFilter.value,I()});c.detailClose.addEventListener("click",()=>H(c));D();async function D(){w(c,h.Checking,"\u6B63\u5728\u8FDE\u63A5\u98DE\u4E66\u63D2\u4EF6\u73AF\u5883"),C(c,"\u6B63\u5728\u8FDE\u63A5","\u6B63\u5728\u4E0E\u98DE\u4E66\u591A\u7EF4\u8868\u683C JS SDK \u63E1\u624B\uFF0C\u4E0D\u4F1A\u5C55\u793A\u6F14\u793A\u6570\u636E\u3002"),$e();const e=await ee();if(o.session=e,e.state!==h.Connected){const i=e.state===h.PermissionDenied?"\u6743\u9650\u4E0D\u8DB3":"\u672A\u8FDE\u63A5\u98DE\u4E66\u63D2\u4EF6\u73AF\u5883";w(c,e.state,i),C(c,i,e.reason,e.state===h.PermissionDenied?"lock":"plug"),c.refreshBtn.disabled=!1;return}if(Ce(e.theme),o.tables=e.tableMetaList,w(c,h.Connected,K(e)),c.refreshBtn.disabled=!1,!o.tables.length){S(c,[],null,T),C(c,"\u6CA1\u6709\u53EF\u8BBF\u95EE\u7684\u6570\u636E\u8868","SDK \u5DF2\u8FDE\u63A5\uFF0C\u4F46\u5F53\u524D\u6587\u6863\u4E0B\u6CA1\u6709\u53EF\u8BFB\u53D6\u7684\u6570\u636E\u8868\u3002"),await _(e.bitable);return}const t=le(),n=o.tables.some(i=>i.id===t)?t:o.tables[0].id;S(c,o.tables,n,T),o.unsubBase=oe(e.bitable,()=>z()),await T(n)}async function T(e){var t;!((t=o.session)!=null&&t.bitable)||(o.activeTableId=e,ce(e),S(c,o.tables,e,T),await O())}async function O(){var i;const{bitable:e}=o.session,t=o.activeTableId,n=o.tables.find(r=>r.id===t);c.tableTitle.textContent=(n==null?void 0:n.name)||"\u6B63\u5728\u8BFB\u53D6",c.tableSubtitle.textContent="\u6B63\u5728\u901A\u8FC7 getRecordsByPage \u5206\u9875\u8BFB\u53D6\u771F\u5B9E\u8BB0\u5F55",we(c,"\u6B63\u5728\u8BFB\u53D6\u5B57\u6BB5\u548C\u8BB0\u5F55\uFF0C\u8D85\u8FC7 200 \u6761\u4F1A\u81EA\u52A8\u7FFB\u9875\u3002"),H(c);try{const r=await ne(e,t),s=fe(r.fields,r.records);o.payload={...r,records:s,stats:be(r.fields,s)},(i=o.unsubTable)==null||i.call(o),o.unsubTable=se(r.table,()=>z("table")),await de(e,t),I(),await _(e),w(c,h.Connected,K(o.session,o.payload))}catch(r){const s=String((r==null?void 0:r.message)||r),a=/permission|权限/.test(s.toLowerCase())||s.includes("\u6743\u9650");w(c,a?h.PermissionDenied:h.Error,a?"\u6743\u9650\u4E0D\u8DB3":"\u8BFB\u53D6\u5931\u8D25"),C(c,a?"\u6743\u9650\u4E0D\u8DB3":"\u8BFB\u53D6\u5931\u8D25",a?"\u5F53\u524D\u8D26\u53F7\u65E0\u6743\u8BFB\u53D6\u8FD9\u5F20\u6570\u636E\u8868\u7684\u5B57\u6BB5\u6216\u8BB0\u5F55\u3002":s,a?"lock":"warning")}}function I(){!o.payload||Te(c,o.payload,o.query,o.fieldId,(e,t,n)=>{ke(c,e,t,n)})}async function V(){var e,t;if(!((e=o.session)!=null&&e.bitable)){D();return}try{o.tables=await ae(o.session.bitable),o.tables.some(n=>n.id===o.activeTableId)||(o.activeTableId=((t=o.tables[0])==null?void 0:t.id)||null),S(c,o.tables,o.activeTableId,T),o.activeTableId?await O():C(c,"\u6CA1\u6709\u53EF\u8BBF\u95EE\u7684\u6570\u636E\u8868","SDK \u5DF2\u8FDE\u63A5\uFF0C\u4F46\u5F53\u524D\u6587\u6863\u4E0B\u6CA1\u6709\u53EF\u8BFB\u53D6\u7684\u6570\u636E\u8868\u3002")}catch(n){C(c,"\u5237\u65B0\u5931\u8D25",String((n==null?void 0:n.message)||n),"warning")}}function z(){window.clearTimeout(o.reloadTimer),o.reloadTimer=window.setTimeout(()=>V(),400)}function $e(){var e,t;(e=o.unsubTable)==null||e.call(o),(t=o.unsubBase)==null||t.call(o),o.unsubTable=null,o.unsubBase=null,o.payload=null}function K(e,t){const n=["\u5DF2\u8FDE\u63A5\u98DE\u4E66"];return e.dashboardState&&n.push(String(e.dashboardState)),t&&n.push(`${t.stats.recordCount} \u6761\u771F\u5B9E\u8BB0\u5F55`),n.join(" \xB7 ")}export{Y as _};
