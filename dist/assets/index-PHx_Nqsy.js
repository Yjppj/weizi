(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const K="modulepreload",G=function(e,t){return new URL(e,t).href},A={},U=function(t,n,i){let r=Promise.resolve();if(n&&n.length>0){let a=function(f){return Promise.all(f.map(y=>Promise.resolve(y).then(C=>({status:"fulfilled",value:C}),C=>({status:"rejected",reason:C}))))};const c=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),u=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));r=a(n.map(f=>{if(f=G(f,i),f in A)return;A[f]=!0;const y=f.endsWith(".css"),C=y?'[rel="stylesheet"]':"";if(!!i)for(let b=c.length-1;b>=0;b--){const w=c[b];if(w.href===f&&(!y||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${f}"]${C}`))return;const m=document.createElement("link");if(m.rel=y?"stylesheet":K,y||(m.as="script"),m.crossOrigin="",m.href=f,u&&m.setAttribute("nonce",u),document.head.appendChild(m),y)return new Promise((b,w)=>{m.addEventListener("load",b),m.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${f}`)))})}))}function s(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return r.then(a=>{for(const c of a||[])c.status==="rejected"&&s(c.reason);return t().catch(s)})},Y=6e3,J=200,W=500,R="weizi.selectedTableId",p={Checking:"checking",Connected:"connected",Disconnected:"disconnected",PermissionDenied:"permission",Error:"error"};function X(e,t,n){let i;const r=new Promise((s,a)=>{i=window.setTimeout(()=>a(new Error(n)),t)});return Promise.race([e,r]).finally(()=>window.clearTimeout(i))}function Z(e){const t=String((e==null?void 0:e.message)||e||""),n=t.toLowerCase();return n.includes("permission")||t.includes("权限")||t.includes("没有权限")||t.includes("无权限")?p.PermissionDenied:t.includes("超时")||n.includes("timeout")||n.includes("not in")||n.includes("bridge")?p.Disconnected:p.Error}function P(){try{return window.self!==window.top}catch{return!0}}async function Q(){var e;try{const{bitable:t,DashboardState:n}=await U(async()=>{const{bitable:d,DashboardState:u}=await import("./index-D2yDDnn-.js").then(f=>f.i);return{bitable:d,DashboardState:u}},[],import.meta.url),i=await X(t.base.getSelection(),Y,"SDK 握手超时，未连接到飞书插件环境"),[r,s,a,c]=await Promise.all([t.base.getTableMetaList(),x(()=>t.bridge.getTheme()),x(()=>{var d,u;return(u=(d=t.bridge).getEnv)==null?void 0:u.call(d)}),x(()=>{var d,u;return(u=(d=t.bridge).getInstanceId)==null?void 0:u.call(d)})]);return{state:p.Connected,bitable:t,DashboardState:n,selection:i,tableMetaList:Array.isArray(r)?r:[],theme:s||"LIGHT",env:a,instanceId:c,dashboardState:((e=t.dashboard)==null?void 0:e.state)||null}}catch(t){const n=Z(t),i=P()?ee(t,n):"未连接飞书插件环境。当前是普通浏览器页面。请把服务地址填到飞书「应用模式 → 添加组件 → 插件 → 添加自定义插件」中打开。";return{state:n===p.Error&&!P()?p.Disconnected:n,reason:i,error:t}}}async function x(e){try{const t=e();return t==null?null:await t}catch{return null}}function ee(e,t){return t===p.PermissionDenied?"当前账号没有读取这张多维表格的权限。请确认文档权限或高级权限配置。":t===p.Disconnected?"未连接飞书插件环境。请在飞书多维表格应用模式中通过自定义插件打开本页面。":String((e==null?void 0:e.message)||e||"读取失败")}async function te(e,t){const n=await e.base.getTableById(t),[i,r]=await Promise.all([n.getName(),n.getFieldMetaList()]),s=await ne(n);return{table:n,tableId:n.id||t,name:i,fields:(r||[]).map(re),records:s}}async function ne(e){const t=[];let n,i=!0,r=0;const s=e.getRecordsByPage?a=>e.getRecordsByPage(a):a=>e.getRecords(a);for(;i&&r<W;){r+=1;const a=await s({pageSize:J,pageToken:n});t.push(...a.records||[]),i=!!a.hasMore,n=a.pageToken,(n==null||n==="")&&(i=!1)}return t}function re(e){return{id:e.id,name:e.name,type:e.type,isPrimary:!!e.isPrimary,property:e.property||null}}function ie(e,t){const n=[],i=["onRecordAdd","onRecordModify","onRecordDelete","onFieldAdd","onFieldModify","onFieldDelete"];for(const r of i)typeof e[r]=="function"&&n.push(e[r](()=>t(r)));return()=>{n.forEach(r=>{try{r==null||r()}catch{}})}}function se(e,t){var i,r;const n=[];return typeof e.base.onTableAdd=="function"&&n.push(e.base.onTableAdd(()=>t("onTableAdd"))),typeof e.base.onTableDelete=="function"&&n.push(e.base.onTableDelete(()=>t("onTableDelete"))),typeof((i=e.dashboard)==null?void 0:i.onDataChange)=="function"&&n.push(e.dashboard.onDataChange(()=>t("onDashboardDataChange"))),typeof((r=e.dashboard)==null?void 0:r.onConfigChange)=="function"&&n.push(e.dashboard.onConfigChange(()=>t("onDashboardConfigChange"))),()=>n.forEach(s=>s==null?void 0:s())}async function oe(e){const t=await e.base.getTableMetaList();return Array.isArray(t)?t:[]}function ae(e){try{sessionStorage.setItem(R,e)}catch{}}function ce(){try{return sessionStorage.getItem(R)}catch{return null}}async function N(e){var t,n;try{await((n=(t=e.dashboard)==null?void 0:t.setRendered)==null?void 0:n.call(t))}catch{}}async function le(e,t){const n=e.dashboard;if(!n||typeof n.saveConfig!="function")return{saved:!1};const i=n.state;if(!(i==="Config"||i==="Create"))return{saved:!1,state:i};try{return await n.saveConfig({dataConditions:t?[{tableId:t,series:"COUNTA"}]:[],customConfig:{workbench:!0}}),{saved:!0,state:i}}catch(s){return{saved:!1,state:i,error:s}}}const de={1:"多行文本",2:"数字",3:"单选",4:"多选",5:"日期",7:"复选框",11:"人员",13:"电话",15:"超链接",17:"附件",18:"单向关联",19:"查找引用",20:"公式",21:"双向关联",22:"地理位置",23:"群聊",1001:"创建时间",1002:"修改时间",1003:"创建人",1004:"修改人",1005:"自动编号",99001:"条码",99002:"进度",99003:"货币",99004:"评分",99005:"邮箱"};function E(e){return de[e]||`未知类型(${e})`}function ue(e,t){return t.map(n=>fe(e,n))}function fe(e,t){var r;const n={},i={};for(const s of e){const a=(r=t.fields)==null?void 0:r[s.id];n[s.id]=a??null,i[s.id]=he(a,s)}return{recordId:t.recordId,values:n,display:i,searchText:Object.values(i).join(" ").toLowerCase()}}function he(e,t){if(e==null||e==="")return"";const n=t==null?void 0:t.type;if(n===5||n===1001||n===1002)return pe(e);if(n===7)return e===!0||e===1?"是":"否";if(n===99002){const i=typeof e=="number"?e:Number(e);return Number.isFinite(i)?`${Math.round(i*100)}%`:String(e)}return D(e)}function D(e){if(e==null||e==="")return"";if(typeof e=="string")return e;if(typeof e=="number")return F(e);if(typeof e=="boolean")return e?"是":"否";if(Array.isArray(e))return e.map(t=>D(t)).filter(Boolean).join(", ");if(typeof e=="object"){if(typeof e.text=="string")return e.text;if(typeof e.name=="string")return e.name;if(typeof e.fullName=="string")return e.fullName;if(typeof e.en_name=="string")return e.en_name;if(typeof e.link=="string")return e.text||e.link;if(typeof e.url=="string")return e.text||e.url;if(typeof e.address=="string")return e.address;if(typeof e.fullAddress=="string")return e.fullAddress;if(typeof e.email=="string")return e.email;if(typeof e.phone=="string")return e.phone;if(typeof e.token=="string")return e.name||e.token;if(typeof e.id=="string"&&typeof e.name=="string")return e.name;if(typeof e.value=="number")return F(e.value);try{return JSON.stringify(e)}catch{return String(e)}}return String(e)}function F(e){return!Number.isFinite(e)||Number.isInteger(e)?String(e):String(Math.round(e*1e3)/1e3)}function pe(e){const t=typeof e=="number"?e:Date.parse(e);if(!Number.isFinite(t))return D(e);const n=new Date(t),i=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),s=String(n.getDate()).padStart(2,"0"),a=String(n.getHours()).padStart(2,"0"),c=String(n.getMinutes()).padStart(2,"0");return a==="00"&&c==="00"?`${i}-${r}-${s}`:`${i}-${r}-${s} ${a}:${c}`}function me(e,t){const n={};for(const c of e){const d=E(c.type);n[d]=(n[d]||0)+1}const i=e.find(c=>c.type===3||c.type===4),r={};if(i)for(const c of t){const u=(c.display[i.id]||"未填写").split(", ").filter(Boolean),f=u.length?u:["未填写"];for(const y of f)r[y]=(r[y]||0)+1}const s=t.reduce((c,d)=>c+e.filter(u=>d.display[u.id]).length,0),a=Math.max(e.length*t.length,1);return{recordCount:t.length,fieldCount:e.length,fillRate:Math.round(s/a*100),typeCounts:n,categoryField:i?i.name:null,categoryCounts:r}}function be(e,t,n){const i=t.trim().toLowerCase();return!i&&!n?e:e.filter(r=>{if(n){const s=(r.display[n]||"").toLowerCase();return i?s.includes(i):!!s}return r.searchText.includes(i)})}function j(e){return e.find(t=>t.isPrimary)||e[0]||null}const T={table:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 9h18M9 9v11M15 9v11" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',refresh:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.2-5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M20 5v5h-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l9 16H3L12 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="17.5" r="0.9" fill="currentColor"/></svg>',plug:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V3M16 7V3M7 7h10v5a5 5 0 0 1-10 0V7zM12 17v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',lock:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',empty:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10h8M8 14h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'};function ye(e){return e.innerHTML=`
    <div class="app">
      <header class="topbar">
        <div class="brand">
          <span class="mark"></span>
          <div>
            <p class="kicker">Feishu Base Plugin</p>
            <h1>数据工作台</h1>
          </div>
        </div>
        <div class="topbar-actions">
          <div id="status-chip" class="status-chip is-checking">
            <span class="dot"></span>
            <span id="status-text">正在连接飞书插件环境</span>
          </div>
          <button id="refresh-btn" class="btn" type="button" disabled>
            ${T.refresh}
            <span>刷新</span>
          </button>
        </div>
      </header>

      <aside class="sidebar">
        <div class="sidebar-head">
          <span>数据表</span>
          <strong id="table-count">0</strong>
        </div>
        <nav id="table-nav" class="table-nav"></nav>
      </aside>

      <main class="main">
        <section class="overview">
          <article class="metric">
            <p>记录总量</p>
            <strong id="metric-records">—</strong>
          </article>
          <article class="metric">
            <p>字段数量</p>
            <strong id="metric-fields">—</strong>
          </article>
          <article class="metric">
            <p>填写完整度</p>
            <strong id="metric-fill">—</strong>
          </article>
          <article class="metric metric-wide">
            <p id="chart-title">字段类型分布</p>
            <div id="chart" class="chart"></div>
          </article>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2 id="table-title">记录列表</h2>
              <p id="table-subtitle" class="muted">等待连接后读取真实数据</p>
            </div>
            <div class="toolbar">
              <label class="search">
                ${T.search}
                <input id="search-input" type="search" placeholder="搜索记录" autocomplete="off" />
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
          <p class="kicker">记录详情</p>
          <h2 id="detail-title">未选择记录</h2>
        </div>
        <button id="detail-close" class="icon-btn" type="button" aria-label="关闭详情">
          ${T.close}
        </button>
      </div>
      <dl id="detail-body" class="detail-body"></dl>
    </aside>
  `,{statusChip:e.querySelector("#status-chip"),statusText:e.querySelector("#status-text"),refreshBtn:e.querySelector("#refresh-btn"),tableCount:e.querySelector("#table-count"),tableNav:e.querySelector("#table-nav"),metricRecords:e.querySelector("#metric-records"),metricFields:e.querySelector("#metric-fields"),metricFill:e.querySelector("#metric-fill"),chartTitle:e.querySelector("#chart-title"),chart:e.querySelector("#chart"),tableTitle:e.querySelector("#table-title"),tableSubtitle:e.querySelector("#table-subtitle"),searchInput:e.querySelector("#search-input"),fieldFilter:e.querySelector("#field-filter"),content:e.querySelector("#content"),detail:e.querySelector("#detail"),detailTitle:e.querySelector("#detail-title"),detailBody:e.querySelector("#detail-body"),detailClose:e.querySelector("#detail-close")}}function ge(e){document.documentElement.dataset.theme=String(e||"LIGHT").toLowerCase()}function S(e,t,n){e.statusChip.className=`status-chip is-${t}`,e.statusText.textContent=n,e.refreshBtn.disabled=t===p.Checking}function L(e,t,n,i){if(e.tableCount.textContent=String(t.length),!t.length){e.tableNav.innerHTML='<p class="nav-empty">暂无可用数据表</p>';return}e.tableNav.innerHTML=t.map(r=>`
        <button class="nav-item ${r.id===n?"is-active":""}" data-id="${$(r.id)}" type="button">
          ${T.table}
          <span>${h(r.name||r.id)}</span>
        </button>
      `).join(""),e.tableNav.querySelectorAll(".nav-item").forEach(r=>{r.addEventListener("click",()=>i(r.dataset.id))})}function v(e,t,n,i="plug"){ke(e),e.chart.innerHTML="",e.tableTitle.textContent="记录列表",e.tableSubtitle.textContent=t,e.content.innerHTML=M(i,t,n)}function we(e,t){e.content.innerHTML=`
    <div class="skeleton-list">
      <p class="muted">${h(t)}</p>
      ${Array.from({length:6},()=>'<div class="skeleton-row"></div>').join("")}
    </div>
  `}function Ce(e,t,n,i,r){const{name:s,tableId:a,fields:c,records:d,stats:u}=t,f=be(d,n,i),y=j(c),C=c.slice(0,6);if(e.metricRecords.textContent=q(u.recordCount),e.metricFields.textContent=q(u.fieldCount),e.metricFill.textContent=`${u.fillRate}%`,e.tableTitle.textContent=s,e.tableSubtitle.textContent=`${u.recordCount} 条真实记录 · ${u.fieldCount} 个字段 · ${a}`,ve(e,c,i),Se(e,u),!d.length){e.content.innerHTML=M("empty","这张表没有记录","字段信息已读取成功，但当前表中没有可展示的行。");return}if(!f.length){e.content.innerHTML=M("search","没有匹配的记录","请调整搜索关键词或筛选字段。");return}e.content.innerHTML=`
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${C.map(g=>`<th>${h(g.name)}<small>${h(E(g.type))}</small></th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${f.map(g=>(y&&g.display[y.id]||g.recordId,`
                <tr data-id="${$(g.recordId)}" tabindex="0">
                  ${C.map((m,b)=>{const w=g.display[m.id]||"—";return`<td data-label="${$(m.name)}">${b===0?`<strong>${h(w)}</strong>`:h(w)}</td>`}).join("")}
                </tr>
              `)).join("")}
        </tbody>
      </table>
    </div>
  `,e.content.querySelectorAll("tr[data-id]").forEach(g=>{const m=()=>{const b=f.find(w=>w.recordId===g.dataset.id);b&&r(b,c,s)};g.addEventListener("click",m),g.addEventListener("keydown",b=>{(b.key==="Enter"||b.key===" ")&&(b.preventDefault(),m())})})}function Te(e,t,n,i){const r=j(n);e.detail.hidden=!1,e.detail.classList.add("is-open"),e.detailTitle.textContent=r&&t.display[r.id]||t.recordId,e.detailBody.innerHTML=`
    <div class="detail-meta">
      <span>${h(i)}</span>
      <span>${h(t.recordId)}</span>
    </div>
    ${n.map(s=>`
          <div class="detail-row">
            <dt>
              ${h(s.name)}
              <small>${h(E(s.type))} · ${h(s.id)}</small>
            </dt>
            <dd>${h(t.display[s.id]||"空")}</dd>
          </div>
        `).join("")}
  `}function _(e){e.detail.classList.remove("is-open"),window.setTimeout(()=>{e.detail.classList.contains("is-open")||(e.detail.hidden=!0)},220)}function ve(e,t,n){const i=n||"";e.fieldFilter.innerHTML=`
    <option value="">全部字段</option>
    ${t.map(r=>`<option value="${$(r.id)}">${h(r.name)}</option>`).join("")}
  `,e.fieldFilter.value=i}function Se(e,t){const n=t.categoryField&&Object.keys(t.categoryCounts).length?t.categoryCounts:t.typeCounts;e.chartTitle.textContent=t.categoryField?`${t.categoryField} 分布`:"字段类型分布";const i=Object.entries(n).sort((s,a)=>a[1]-s[1]).slice(0,6),r=Math.max(...i.map(s=>s[1]),1);if(!i.length){e.chart.innerHTML='<p class="muted">暂无可视化数据</p>';return}e.chart.innerHTML=i.map(([s,a])=>{const c=Math.max(a/r*100,6);return`
        <div class="bar">
          <span>${h(s)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${c}%"></div></div>
          <em>${a}</em>
        </div>
      `}).join("")}function ke(e){e.metricRecords.textContent="—",e.metricFields.textContent="—",e.metricFill.textContent="—"}function M(e,t,n){return`
    <div class="state-card">
      <span class="state-icon">${T[e]||T.warning}</span>
      <h3>${h(t)}</h3>
      <p>${h(n)}</p>
    </div>
  `}function q(e){return new Intl.NumberFormat("zh-CN").format(e)}function h(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function $(e){return h(e).replaceAll("'","&#39;")}const Le=document.querySelector("#app"),l=ye(Le),o={session:null,tables:[],activeTableId:null,payload:null,query:"",fieldId:"",unsubTable:null,unsubBase:null,reloadTimer:null};l.refreshBtn.addEventListener("click",()=>{var e;if(!((e=o.session)!=null&&e.bitable)){I();return}O()});l.searchInput.addEventListener("input",()=>{o.query=l.searchInput.value,B()});l.fieldFilter.addEventListener("change",()=>{o.fieldId=l.fieldFilter.value,B()});l.detailClose.addEventListener("click",()=>_(l));I();async function I(){S(l,p.Checking,"正在连接飞书插件环境"),v(l,"正在连接","正在与飞书多维表格 JS SDK 握手，不会展示演示数据。"),$e();const e=await Q();if(o.session=e,e.state!==p.Connected){const i=e.state===p.PermissionDenied?"权限不足":"未连接飞书插件环境";S(l,e.state,i),v(l,i,e.reason,e.state===p.PermissionDenied?"lock":"plug"),l.refreshBtn.disabled=!1;return}if(ge(e.theme),o.tables=e.tableMetaList,S(l,p.Connected,z(e)),l.refreshBtn.disabled=!1,!o.tables.length){L(l,[],null,k),v(l,"没有可访问的数据表","SDK 已连接，但当前文档下没有可读取的数据表。"),await N(e.bitable);return}const t=ce(),n=o.tables.some(i=>i.id===t)?t:o.tables[0].id;L(l,o.tables,n,k),o.unsubBase=se(e.bitable,()=>V()),await k(n)}async function k(e){var t;(t=o.session)!=null&&t.bitable&&(o.activeTableId=e,ae(e),L(l,o.tables,e,k),await H())}async function H(){var i;const{bitable:e}=o.session,t=o.activeTableId,n=o.tables.find(r=>r.id===t);l.tableTitle.textContent=(n==null?void 0:n.name)||"正在读取",l.tableSubtitle.textContent="正在通过 getRecordsByPage 分页读取真实记录",we(l,"正在读取字段和记录，超过 200 条会自动翻页。"),_(l);try{const r=await te(e,t),s=ue(r.fields,r.records);o.payload={...r,records:s,stats:me(r.fields,s)},(i=o.unsubTable)==null||i.call(o),o.unsubTable=ie(r.table,()=>V("table")),await le(e,t),B(),await N(e),S(l,p.Connected,z(o.session,o.payload))}catch(r){const s=String((r==null?void 0:r.message)||r),a=/permission|权限/.test(s.toLowerCase())||s.includes("权限");S(l,a?p.PermissionDenied:p.Error,a?"权限不足":"读取失败"),v(l,a?"权限不足":"读取失败",a?"当前账号无权读取这张数据表的字段或记录。":s,a?"lock":"warning")}}function B(){o.payload&&Ce(l,o.payload,o.query,o.fieldId,(e,t,n)=>{Te(l,e,t,n)})}async function O(){var e,t;if(!((e=o.session)!=null&&e.bitable)){I();return}try{o.tables=await oe(o.session.bitable),o.tables.some(n=>n.id===o.activeTableId)||(o.activeTableId=((t=o.tables[0])==null?void 0:t.id)||null),L(l,o.tables,o.activeTableId,k),o.activeTableId?await H():v(l,"没有可访问的数据表","SDK 已连接，但当前文档下没有可读取的数据表。")}catch(n){v(l,"刷新失败",String((n==null?void 0:n.message)||n),"warning")}}function V(){window.clearTimeout(o.reloadTimer),o.reloadTimer=window.setTimeout(()=>O(),400)}function $e(){var e,t;(e=o.unsubTable)==null||e.call(o),(t=o.unsubBase)==null||t.call(o),o.unsubTable=null,o.unsubBase=null,o.payload=null}function z(e,t){const n=["已连接飞书"];return e.dashboardState&&n.push(String(e.dashboardState)),t&&n.push(`${t.stats.recordCount} 条真实记录`),n.join(" · ")}export{U as _};
