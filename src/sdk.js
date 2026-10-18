const CONNECT_TIMEOUT_MS = 6000;
const PAGE_SIZE = 200;
const MAX_PAGES = 500;
const SELECTED_TABLE_KEY = 'weizi.selectedTableId';

export const ConnectionState = {
  Checking: 'checking',
  Connected: 'connected',
  Disconnected: 'disconnected',
  PermissionDenied: 'permission',
  Error: 'error',
};

function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = window.setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
}

function classifyError(error) {
  const message = String(error?.message || error || '');
  const lower = message.toLowerCase();
  if (
    lower.includes('permission') ||
    message.includes('权限') ||
    message.includes('没有权限') ||
    message.includes('无权限')
  ) {
    return ConnectionState.PermissionDenied;
  }
  if (
    message.includes('超时') ||
    lower.includes('timeout') ||
    lower.includes('not in') ||
    lower.includes('bridge')
  ) {
    return ConnectionState.Disconnected;
  }
  return ConnectionState.Error;
}

export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export async function connectBitable() {
  try {
    const { bitable, DashboardState } = await import('@lark-base-open/js-sdk');

    const selection = await withTimeout(
      bitable.base.getSelection(),
      CONNECT_TIMEOUT_MS,
      'SDK 握手超时，未连接到飞书插件环境',
    );

    const [tableMetaList, theme, env, instanceId] = await Promise.all([
      bitable.base.getTableMetaList(),
      safeCall(() => bitable.bridge.getTheme()),
      safeCall(() => bitable.bridge.getEnv?.()),
      safeCall(() => bitable.bridge.getInstanceId?.()),
    ]);

    return {
      state: ConnectionState.Connected,
      bitable,
      DashboardState,
      selection,
      tableMetaList: Array.isArray(tableMetaList) ? tableMetaList : [],
      theme: theme || 'LIGHT',
      env,
      instanceId,
      dashboardState: bitable.dashboard?.state || null,
    };
  } catch (error) {
    const state = classifyError(error);
    const reason = !isInIframe()
      ? '未连接飞书插件环境。当前是普通浏览器页面。请把服务地址填到飞书「应用模式 → 添加组件 → 插件 → 添加自定义插件」中打开。'
      : humanizeError(error, state);
    return {
      state: state === ConnectionState.Error && !isInIframe() ? ConnectionState.Disconnected : state,
      reason,
      error,
    };
  }
}

async function safeCall(fn) {
  try {
    const value = fn();
    return value == null ? null : await value;
  } catch {
    return null;
  }
}

function humanizeError(error, state) {
  if (state === ConnectionState.PermissionDenied) {
    return '当前账号没有读取这张多维表格的权限。请确认文档权限或高级权限配置。';
  }
  if (state === ConnectionState.Disconnected) {
    return '未连接飞书插件环境。请在飞书多维表格应用模式中通过自定义插件打开本页面。';
  }
  return String(error?.message || error || '读取失败');
}

export async function loadTableData(bitable, tableId) {
  const table = await bitable.base.getTableById(tableId);
  const [name, fieldMetaList] = await Promise.all([
    table.getName(),
    table.getFieldMetaList(),
  ]);
  const records = await fetchAllRecords(table);
  return {
    table,
    tableId: table.id || tableId,
    name,
    fields: (fieldMetaList || []).map(normalizeField),
    records,
  };
}

async function fetchAllRecords(table) {
  const records = [];
  let pageToken;
  let hasMore = true;
  let pages = 0;

  const fetchPage = table.getRecordsByPage
    ? (params) => table.getRecordsByPage(params)
    : (params) => table.getRecords(params);

  while (hasMore && pages < MAX_PAGES) {
    pages += 1;
    const page = await fetchPage({
      pageSize: PAGE_SIZE,
      pageToken,
    });
    records.push(...(page.records || []));
    hasMore = Boolean(page.hasMore);
    pageToken = page.pageToken;
    if (pageToken == null || pageToken === '') {
      hasMore = false;
    }
  }

  return records;
}

function normalizeField(field) {
  return {
    id: field.id,
    name: field.name,
    type: field.type,
    isPrimary: Boolean(field.isPrimary),
    property: field.property || null,
  };
}

export function subscribeTableChanges(table, onChange) {
  const offs = [];
  const handlers = ['onRecordAdd', 'onRecordModify', 'onRecordDelete', 'onFieldAdd', 'onFieldModify', 'onFieldDelete'];
  for (const name of handlers) {
    if (typeof table[name] === 'function') {
      offs.push(table[name](() => onChange(name)));
    }
  }
  return () => {
    offs.forEach((off) => {
      try {
        off?.();
      } catch {
        /* ignore */
      }
    });
  };
}

export function subscribeBaseChanges(bitable, onChange) {
  const offs = [];
  if (typeof bitable.base.onTableAdd === 'function') {
    offs.push(bitable.base.onTableAdd(() => onChange('onTableAdd')));
  }
  if (typeof bitable.base.onTableDelete === 'function') {
    offs.push(bitable.base.onTableDelete(() => onChange('onTableDelete')));
  }
  if (typeof bitable.dashboard?.onDataChange === 'function') {
    offs.push(bitable.dashboard.onDataChange(() => onChange('onDashboardDataChange')));
  }
  if (typeof bitable.dashboard?.onConfigChange === 'function') {
    offs.push(bitable.dashboard.onConfigChange(() => onChange('onDashboardConfigChange')));
  }
  return () => offs.forEach((off) => off?.());
}

export async function refreshTableList(bitable) {
  const tableMetaList = await bitable.base.getTableMetaList();
  return Array.isArray(tableMetaList) ? tableMetaList : [];
}

export function rememberTableId(tableId) {
  try {
    sessionStorage.setItem(SELECTED_TABLE_KEY, tableId);
  } catch {
    /* ignore */
  }
}

export function recalledTableId() {
  try {
    return sessionStorage.getItem(SELECTED_TABLE_KEY);
  } catch {
    return null;
  }
}

export async function markRendered(bitable) {
  try {
    await bitable.dashboard?.setRendered?.();
  } catch {
    /* 非仪表盘容器时忽略 */
  }
}

export async function tryCompleteDashboardConfig(bitable, tableId) {
  const dashboard = bitable.dashboard;
  if (!dashboard || typeof dashboard.saveConfig !== 'function') return { saved: false };
  const state = dashboard.state;
  const isConfig = state === 'Config' || state === 'Create';
  if (!isConfig) return { saved: false, state };
  try {
    await dashboard.saveConfig({
      dataConditions: tableId
        ? [{
            tableId,
            series: 'COUNTA',
          }]
        : [],
      customConfig: { workbench: true },
    });
    return { saved: true, state };
  } catch (error) {
    return { saved: false, state, error };
  }
}
