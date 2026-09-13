'use client';

import { X } from 'lucide-react';

export function Modal({ children, onClose, c, wide }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: c.panel,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          padding: 22,
          width: wide ? 420 : 360,
          maxWidth: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, onClose, c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{title}</div>
      <button
        onClick={onClose}
        style={{ width: 26, height: 26, border: 'none', background: 'transparent', color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="Cerrar"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function Field({ label, children, c }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10.5, letterSpacing: 0.5, color: c.muted, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
