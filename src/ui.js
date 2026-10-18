import { fieldTypeLabel, filterRecords, primaryField } from './format.js';
import { ConnectionState } from './sdk.js';

const icons = {
  table: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 9h18M9 9v11M15 9v11" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.2-5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M20 5v5h-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l9 16H3L12 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="17.5" r="0.9" fill="currentColor"/></svg>`,
  plug: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V3M16 7V3M7 7h10v5a5 5 0 0 1-10 0V7zM12 17v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  empty: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10h8M8 14h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

export function renderShell(root) {
  root.innerHTML = `
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
            ${icons.refresh}
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
                ${icons.search}
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
          ${icons.close}
        </button>
      </div>
      <dl id="detail-body" class="detail-body"></dl>
    </aside>
  `;

  return {
    statusChip: root.querySelector('#status-chip'),
    statusText: root.querySelector('#status-text'),
    refreshBtn: root.querySelector('#refresh-btn'),
    tableCount: root.querySelector('#table-count'),
    tableNav: root.querySelector('#table-nav'),
    metricRecords: root.querySelector('#metric-records'),
    metricFields: root.querySelector('#metric-fields'),
    metricFill: root.querySelector('#metric-fill'),
    chartTitle: root.querySelector('#chart-title'),
    chart: root.querySelector('#chart'),
    tableTitle: root.querySelector('#table-title'),
    tableSubtitle: root.querySelector('#table-subtitle'),
    searchInput: root.querySelector('#search-input'),
    fieldFilter: root.querySelector('#field-filter'),
    content: root.querySelector('#content'),
    detail: root.querySelector('#detail'),
    detailTitle: root.querySelector('#detail-title'),
    detailBody: root.querySelector('#detail-body'),
    detailClose: root.querySelector('#detail-close'),
  };
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = String(theme || 'LIGHT').toLowerCase();
}

export function setStatus(els, state, text) {
  els.statusChip.className = `status-chip is-${state}`;
  els.statusText.textContent = text;
  els.refreshBtn.disabled = state === ConnectionState.Checking;
}

export function renderTableNav(els, tables, activeId, onSelect) {
  els.tableCount.textContent = String(tables.length);
  if (!tables.length) {
    els.tableNav.innerHTML = `<p class="nav-empty">暂无可用数据表</p>`;
    return;
  }
  els.tableNav.innerHTML = tables
    .map(
      (table) => `
        <button class="nav-item ${table.id === activeId ? 'is-active' : ''}" data-id="${escapeAttr(table.id)}" type="button">
          ${icons.table}
          <span>${escapeHtml(table.name || table.id)}</span>
        </button>
      `,
    )
    .join('');
  els.tableNav.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => onSelect(btn.dataset.id));
  });
}

export function renderDisconnected(els, title, message, icon = 'plug') {
  clearMetrics(els);
  els.chart.innerHTML = '';
  els.tableTitle.textContent = '记录列表';
  els.tableSubtitle.textContent = title;
  els.content.innerHTML = stateCard(icon, title, message);
}

export function renderLoading(els, message) {
  els.content.innerHTML = `
    <div class="skeleton-list">
      <p class="muted">${escapeHtml(message)}</p>
      ${Array.from({ length: 6 }, () => '<div class="skeleton-row"></div>').join('')}
    </div>
  `;
}

export function renderTableView(els, payload, query, fieldId, onOpen) {
  const { name, tableId, fields, records, stats } = payload;
  const filtered = filterRecords(records, query, fieldId);
  const lead = primaryField(fields);
  const columns = fields.slice(0, 6);

  els.metricRecords.textContent = formatCount(stats.recordCount);
  els.metricFields.textContent = formatCount(stats.fieldCount);
  els.metricFill.textContent = `${stats.fillRate}%`;
  els.tableTitle.textContent = name;
  els.tableSubtitle.textContent = `${stats.recordCount} 条真实记录 · ${stats.fieldCount} 个字段 · ${tableId}`;

  renderFieldFilter(els, fields, fieldId);
  renderChart(els, stats);

  if (!records.length) {
    els.content.innerHTML = stateCard('empty', '这张表没有记录', '字段信息已读取成功，但当前表中没有可展示的行。');
    return;
  }

  if (!filtered.length) {
    els.content.innerHTML = stateCard('search', '没有匹配的记录', '请调整搜索关键词或筛选字段。');
    return;
  }

  els.content.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${columns.map((field) => `<th>${escapeHtml(field.name)}<small>${escapeHtml(fieldTypeLabel(field.type))}</small></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map((record) => {
              const title = lead ? record.display[lead.id] || record.recordId : record.recordId;
              return `
                <tr data-id="${escapeAttr(record.recordId)}" tabindex="0">
                  ${columns
                    .map((field, index) => {
                      const text = record.display[field.id] || '—';
                      return `<td data-label="${escapeAttr(field.name)}">${index === 0 ? `<strong>${escapeHtml(text || title)}</strong>` : escapeHtml(text)}</td>`;
                    })
                    .join('')}
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  els.content.querySelectorAll('tr[data-id]').forEach((row) => {
    const open = () => {
      const record = filtered.find((item) => item.recordId === row.dataset.id);
      if (record) onOpen(record, fields, name);
    };
    row.addEventListener('click', open);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
}

export function openDetail(els, record, fields, tableName) {
  const lead = primaryField(fields);
  els.detail.hidden = false;
  els.detail.classList.add('is-open');
  els.detailTitle.textContent = (lead && record.display[lead.id]) || record.recordId;
  els.detailBody.innerHTML = `
    <div class="detail-meta">
      <span>${escapeHtml(tableName)}</span>
      <span>${escapeHtml(record.recordId)}</span>
    </div>
    ${fields
      .map(
        (field) => `
          <div class="detail-row">
            <dt>
              ${escapeHtml(field.name)}
              <small>${escapeHtml(fieldTypeLabel(field.type))} · ${escapeHtml(field.id)}</small>
            </dt>
            <dd>${escapeHtml(record.display[field.id] || '空')}</dd>
          </div>
        `,
      )
      .join('')}
  `;
}

export function closeDetail(els) {
  els.detail.classList.remove('is-open');
  window.setTimeout(() => {
    if (!els.detail.classList.contains('is-open')) els.detail.hidden = true;
  }, 220);
}

function renderFieldFilter(els, fields, fieldId) {
  const current = fieldId || '';
  els.fieldFilter.innerHTML = `
    <option value="">全部字段</option>
    ${fields.map((field) => `<option value="${escapeAttr(field.id)}">${escapeHtml(field.name)}</option>`).join('')}
  `;
  els.fieldFilter.value = current;
}

function renderChart(els, stats) {
  const source = stats.categoryField && Object.keys(stats.categoryCounts).length
    ? stats.categoryCounts
    : stats.typeCounts;
  els.chartTitle.textContent = stats.categoryField ? `${stats.categoryField} 分布` : '字段类型分布';
  const entries = Object.entries(source).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(...entries.map((item) => item[1]), 1);
  if (!entries.length) {
    els.chart.innerHTML = '<p class="muted">暂无可视化数据</p>';
    return;
  }
  els.chart.innerHTML = entries
    .map(([label, count]) => {
      const width = Math.max((count / max) * 100, 6);
      return `
        <div class="bar">
          <span>${escapeHtml(label)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
          <em>${count}</em>
        </div>
      `;
    })
    .join('');
}

function clearMetrics(els) {
  els.metricRecords.textContent = '—';
  els.metricFields.textContent = '—';
  els.metricFill.textContent = '—';
}

function stateCard(icon, title, message) {
  return `
    <div class="state-card">
      <span class="state-icon">${icons[icon] || icons.warning}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function formatCount(n) {
  return new Intl.NumberFormat('zh-CN').format(n);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", '&#39;');
}
