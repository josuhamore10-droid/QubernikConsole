export function colors(isDark) {
  return {
    bg: isDark ? '#0B0C0E' : '#F5F5F3',
    panel: isDark ? '#141518' : '#FFFFFF',
    panelAlt: isDark ? '#101113' : '#EFEEEA',
    border: isDark ? '#25262A' : '#E4E3DF',
    text: isDark ? '#EDEDED' : '#171717',
    muted: isDark ? '#8B8D93' : '#6B6B68',
    accent: '#C9722F',
    danger: '#E5484D',
  };
}

export function inputStyle(c) {
  return {
    width: '100%',
    background: c.bg,
    color: c.text,
    border: `1px solid ${c.border}`,
    borderRadius: 7,
    padding: '9px 11px',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };
}

export function primaryBtnStyle(c, disabled) {
  return {
    background: disabled ? c.border : c.text,
    color: disabled ? c.muted : c.bg,
    border: 'none',
    borderRadius: 7,
    padding: '9px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
  };
}

export function iconBtnStyle(c) {
  return {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: 'none',
    background: 'transparent',
    color: c.muted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };
}

export function chipBtnStyle(c) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    color: c.text,
    border: `1px solid ${c.border}`,
    borderRadius: 20,
    padding: '7px 14px',
    fontSize: 12.5,
    cursor: 'pointer',
  };
}
