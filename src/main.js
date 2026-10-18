import { ConnectionState, connectBitable, loadTableData, markRendered, recalledTableId, refreshTableList, rememberTableId, subscribeBaseChanges, subscribeTableChanges, tryCompleteDashboardConfig } from './sdk.js';
import { buildStats, transformRecords } from './format.js';
import {
  closeDetail,
  openDetail,
  renderDisconnected,
  renderLoading,
  renderShell,
  renderTableNav,
  renderTableView,
  setStatus,
  setTheme,
} from './ui.js';
import './styles.css';

const root = document.querySelector('#app');
const els = renderShell(root);

const app = {
  session: null,
  tables: [],
  activeTableId: null,
  payload: null,
  query: '',
  fieldId: '',
  unsubTable: null,
  unsubBase: null,
  reloadTimer: null,
};

els.refreshBtn.addEventListener('click', () => {
  if (!app.session?.bitable) {
    boot();
    return;
  }
  reload(true);
});

els.searchInput.addEventListener('input', () => {
  app.query = els.searchInput.value;
  paintRecords();
});

els.fieldFilter.addEventListener('change', () => {
  app.fieldId = els.fieldFilter.value;
  paintRecords();
});

els.detailClose.addEventListener('click', () => closeDetail(els));

boot();

async function boot() {
  setStatus(els, ConnectionState.Checking, '正在连接飞书插件环境');
  renderDisconnected(els, '正在连接', '正在与飞书多维表格 JS SDK 握手，不会展示演示数据。');
  teardown();

  const session = await connectBitable();
  app.session = session;

  if (session.state !== ConnectionState.Connected) {
    const title = session.state === ConnectionState.PermissionDenied ? '权限不足' : '未连接飞书插件环境';
    setStatus(els, session.state, title);
    renderDisconnected(
      els,
      title,
      session.reason,
      session.state === ConnectionState.PermissionDenied ? 'lock' : 'plug',
    );
    els.refreshBtn.disabled = false;
    return;
  }

  setTheme(session.theme);
  app.tables = session.tableMetaList;
  setStatus(els, ConnectionState.Connected, statusLabel(session));
  els.refreshBtn.disabled = false;

  if (!app.tables.length) {
    renderTableNav(els, [], null, selectTable);
    renderDisconnected(els, '没有可访问的数据表', 'SDK 已连接，但当前文档下没有可读取的数据表。');
    await markRendered(session.bitable);
    return;
  }

  const preferred = recalledTableId();
  const firstId = app.tables.some((table) => table.id === preferred) ? preferred : app.tables[0].id;
  renderTableNav(els, app.tables, firstId, selectTable);
  app.unsubBase = subscribeBaseChanges(session.bitable, () => scheduleReload('base'));
  await selectTable(firstId);
}

async function selectTable(tableId) {
  if (!app.session?.bitable) return;
  app.activeTableId = tableId;
  rememberTableId(tableId);
  renderTableNav(els, app.tables, tableId, selectTable);
  await loadActiveTable();
}

async function loadActiveTable() {
  const { bitable } = app.session;
  const tableId = app.activeTableId;
  const meta = app.tables.find((table) => table.id === tableId);
  els.tableTitle.textContent = meta?.name || '正在读取';
  els.tableSubtitle.textContent = '正在通过 getRecordsByPage 分页读取真实记录';
  renderLoading(els, '正在读取字段和记录，超过 200 条会自动翻页。');
  closeDetail(els);

  try {
    const raw = await loadTableData(bitable, tableId);
    const records = transformRecords(raw.fields, raw.records);
    app.payload = {
      ...raw,
      records,
      stats: buildStats(raw.fields, records),
    };
    app.unsubTable?.();
    app.unsubTable = subscribeTableChanges(raw.table, () => scheduleReload('table'));
    await tryCompleteDashboardConfig(bitable, tableId);
    paintRecords();
    await markRendered(bitable);
    setStatus(els, ConnectionState.Connected, statusLabel(app.session, app.payload));
  } catch (error) {
    const message = String(error?.message || error);
    const permission = /permission|权限/.test(message.toLowerCase()) || message.includes('权限');
    setStatus(
      els,
      permission ? ConnectionState.PermissionDenied : ConnectionState.Error,
      permission ? '权限不足' : '读取失败',
    );
    renderDisconnected(
      els,
      permission ? '权限不足' : '读取失败',
      permission ? '当前账号无权读取这张数据表的字段或记录。' : message,
      permission ? 'lock' : 'warning',
    );
  }
}

function paintRecords() {
  if (!app.payload) return;
  renderTableView(els, app.payload, app.query, app.fieldId, (record, fields, name) => {
    openDetail(els, record, fields, name);
  });
}

async function reload() {
  if (!app.session?.bitable) {
    boot();
    return;
  }
  try {
    app.tables = await refreshTableList(app.session.bitable);
    if (!app.tables.some((table) => table.id === app.activeTableId)) {
      app.activeTableId = app.tables[0]?.id || null;
    }
    renderTableNav(els, app.tables, app.activeTableId, selectTable);
    if (app.activeTableId) {
      await loadActiveTable();
    } else {
      renderDisconnected(els, '没有可访问的数据表', 'SDK 已连接，但当前文档下没有可读取的数据表。');
    }
  } catch (error) {
    renderDisconnected(els, '刷新失败', String(error?.message || error), 'warning');
  }
}

function scheduleReload() {
  window.clearTimeout(app.reloadTimer);
  app.reloadTimer = window.setTimeout(() => reload(), 400);
}

function teardown() {
  app.unsubTable?.();
  app.unsubBase?.();
  app.unsubTable = null;
  app.unsubBase = null;
  app.payload = null;
}

function statusLabel(session, payload) {
  const parts = ['已连接飞书'];
  if (session.dashboardState) parts.push(String(session.dashboardState));
  if (payload) parts.push(`${payload.stats.recordCount} 条真实记录`);
  return parts.join(' · ');
}
