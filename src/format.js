export const FIELD_TYPE_LABELS = {
  1: '多行文本',
  2: '数字',
  3: '单选',
  4: '多选',
  5: '日期',
  7: '复选框',
  11: '人员',
  13: '电话',
  15: '超链接',
  17: '附件',
  18: '单向关联',
  19: '查找引用',
  20: '公式',
  21: '双向关联',
  22: '地理位置',
  23: '群聊',
  1001: '创建时间',
  1002: '修改时间',
  1003: '创建人',
  1004: '修改人',
  1005: '自动编号',
  99001: '条码',
  99002: '进度',
  99003: '货币',
  99004: '评分',
  99005: '邮箱',
};

export function fieldTypeLabel(type) {
  return FIELD_TYPE_LABELS[type] || `未知类型(${type})`;
}

export function transformRecords(fields, records) {
  return records.map((record) => transformRecord(fields, record));
}

export function transformRecord(fields, record) {
  const values = {};
  const display = {};
  for (const field of fields) {
    const raw = record.fields?.[field.id];
    values[field.id] = raw ?? null;
    display[field.id] = formatCellValue(raw, field);
  }
  return {
    recordId: record.recordId,
    values,
    display,
    searchText: Object.values(display).join(' ').toLowerCase(),
  };
}

export function formatCellValue(value, field) {
  if (value == null || value === '') return '';
  const type = field?.type;

  if (type === 5 || type === 1001 || type === 1002) {
    return formatDateTime(value);
  }
  if (type === 7) {
    return value === true || value === 1 ? '是' : '否';
  }
  if (type === 99002) {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? `${Math.round(n * 100)}%` : String(value);
  }

  return stringifyValue(value);
}

function stringifyValue(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return formatNumber(value);
  if (typeof value === 'boolean') return value ? '是' : '否';
  if (Array.isArray(value)) {
    return value.map((item) => stringifyValue(item)).filter(Boolean).join(', ');
  }
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (typeof value.name === 'string') return value.name;
    if (typeof value.fullName === 'string') return value.fullName;
    if (typeof value.en_name === 'string') return value.en_name;
    if (typeof value.link === 'string') return value.text || value.link;
    if (typeof value.url === 'string') return value.text || value.url;
    if (typeof value.address === 'string') return value.address;
    if (typeof value.fullAddress === 'string') return value.fullAddress;
    if (typeof value.email === 'string') return value.email;
    if (typeof value.phone === 'string') return value.phone;
    if (typeof value.token === 'string') return value.name || value.token;
    if (typeof value.id === 'string' && typeof value.name === 'string') return value.name;
    if (typeof value.value === 'number') return formatNumber(value.value);
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return String(value);
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 1000) / 1000);
}

function formatDateTime(value) {
  const ts = typeof value === 'number' ? value : Date.parse(value);
  if (!Number.isFinite(ts)) return stringifyValue(value);
  const date = new Date(ts);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  if (hh === '00' && mm === '00') return `${y}-${m}-${d}`;
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export function buildStats(fields, records) {
  const typeCounts = {};
  for (const field of fields) {
    const label = fieldTypeLabel(field.type);
    typeCounts[label] = (typeCounts[label] || 0) + 1;
  }

  const selectField = fields.find((field) => field.type === 3 || field.type === 4);
  const categoryCounts = {};
  if (selectField) {
    for (const record of records) {
      const text = record.display[selectField.id] || '未填写';
      const parts = text.split(', ').filter(Boolean);
      const keys = parts.length ? parts : ['未填写'];
      for (const key of keys) {
        categoryCounts[key] = (categoryCounts[key] || 0) + 1;
      }
    }
  }

  const filledCells = records.reduce((sum, record) => {
    return sum + fields.filter((field) => record.display[field.id]).length;
  }, 0);
  const totalCells = Math.max(fields.length * records.length, 1);

  return {
    recordCount: records.length,
    fieldCount: fields.length,
    fillRate: Math.round((filledCells / totalCells) * 100),
    typeCounts,
    categoryField: selectField ? selectField.name : null,
    categoryCounts,
  };
}

export function filterRecords(records, query, fieldId) {
  const q = query.trim().toLowerCase();
  if (!q && !fieldId) return records;
  return records.filter((record) => {
    if (fieldId) {
      const text = (record.display[fieldId] || '').toLowerCase();
      return q ? text.includes(q) : Boolean(text);
    }
    return record.searchText.includes(q);
  });
}

export function primaryField(fields) {
  return fields.find((field) => field.isPrimary) || fields[0] || null;
}
