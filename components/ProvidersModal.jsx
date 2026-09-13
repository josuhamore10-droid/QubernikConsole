'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalHeader, Field } from './Modal';
import { MODEL_CATALOG } from '@/lib/models';
import { inputStyle, primaryBtnStyle } from '@/lib/ui';
import { CheckCircle2, CircleDashed, Trash2 } from 'lucide-react';

// Modal de "Proveedores de IA": pega una clave, el backend detecta a qué
// proveedor pertenece por su formato y la guarda en .env.local. No hay
// selector manual de proveedor a propósito — así queda igual de simple
// que el flujo original que mostraste en las capturas.
export default function ProvidersModal({ onClose, c }) {
  const [status, setStatus] = useState(null);
  const [keyDraft, setKeyDraft] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  function refreshStatus() {
    return fetch('/api/env')
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setError('No se pudo consultar /api/env.'));
  }

  useEffect(() => {
    refreshStatus();
  }, []);

  async function handleAddKey() {
    setError('');
    setNotice('');
    if (!keyDraft.trim()) {
      setError('Pega una clave primero.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/env', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key: keyDraft.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setNotice(`${data.providerLabel} configurado. Ya puedes usar sus modelos, sin reiniciar el servidor.`);
        setKeyDraft('');
        await refreshStatus();
      }
    } catch (err) {
      setError(err.message || 'Error de red guardando la clave.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(providerId) {
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/env', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider: providerId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        await refreshStatus();
      }
    } catch (err) {
      setError(err.message || 'Error de red eliminando la clave.');
    }
  }

  return (
    <Modal onClose={onClose} c={c} wide>
      <ModalHeader title="PROVEEDORES DE IA" onClose={onClose} c={c} />
      <div style={{ fontSize: 12, color: c.muted, marginBottom: 16, lineHeight: 1.5 }}>
        Pega una clave y el sistema detecta el proveedor y la guarda en <code>.env.local</code>.
        Los modelos de ese proveedor quedan disponibles al instante en el chat.
      </div>

      <Field label="NUEVA CLAVE" c={c}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={keyDraft}
            onChange={(e) => { setKeyDraft(e.target.value); setError(''); }}
            placeholder="sk-ant-..., AIza..., sk-..."
            style={{ ...inputStyle(c), flex: 1 }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddKey(); }}
          />
          <button onClick={handleAddKey} disabled={saving} style={primaryBtnStyle(c, saving)}>
            {saving ? 'Guardando…' : 'Agregar'}
          </button>
        </div>
      </Field>
      {error && <div style={{ fontSize: 12, color: c.danger, marginTop: -8, marginBottom: 12 }}>{error}</div>}
      {notice && <div style={{ fontSize: 12, color: '#3EBB61', marginTop: -8, marginBottom: 12 }}>{notice}</div>}

      <div style={{ fontSize: 11, color: c.muted, margin: '18px 0 8px', letterSpacing: 0.5 }}>ESTADO</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(MODEL_CATALOG).map(([providerId, cfg]) => {
          const s = status ? status[providerId] : null;
          return (
            <div
              key={providerId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{cfg.label}</div>
                  <div style={{ fontSize: 11, color: c.muted }}>{s?.masked || cfg.envVar}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {s === null ? (
                  <span style={{ fontSize: 11, color: c.muted }}>...</span>
                ) : s.configured ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#3EBB61' }}>
                    <CheckCircle2 size={13} /> Configurada
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: c.muted }}>
                    <CircleDashed size={13} /> Falta
                  </span>
                )}
                {s?.configured && (
                  <button
                    onClick={() => handleRemove(providerId)}
                    title="Quitar clave"
                    style={{ width: 24, height: 24, border: 'none', background: 'transparent', color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
