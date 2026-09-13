'use client';

import { Modal, ModalHeader } from './Modal';
import { useTheme } from '@/lib/theme';

export default function SettingsModal({ onClose, c }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Modal onClose={onClose} c={c}>
      <ModalHeader title="AJUSTES" onClose={onClose} c={c} />
      <div style={{ fontSize: 11, color: c.muted, marginBottom: 8, letterSpacing: 0.5 }}>TEMA</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { key: 'dark', label: 'Oscuro' },
          { key: 'light', label: 'Claro' },
        ].map((opt) => {
          const active = theme === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setTheme(opt.key)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: active ? `1.5px solid ${c.text}` : `1px solid ${c.border}`,
                background: c.panel,
                color: c.text,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: `1.5px solid ${c.text}`,
                  background: active ? c.text : 'transparent',
                }}
              />
              {opt.label}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
