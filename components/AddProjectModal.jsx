'use client';

import { useState } from 'react';
import { Modal, ModalHeader, Field } from './Modal';
import { inputStyle, primaryBtnStyle } from '@/lib/ui';
import { slugify } from '@/lib/projects';

export default function AddProjectModal({ onClose, onCreate, c, existingSlugs }) {
  const [icon, setIcon] = useState('🗂️');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Ponle un nombre al proyecto.');
      return;
    }
    let slug = slugify(trimmed);
    if (!slug) slug = `proyecto-${Date.now()}`;
    if (existingSlugs.includes(slug)) slug = `${slug}-${Date.now()}`;

    onCreate({ slug, icon: icon || '🗂️', name: trimmed, status: 'sin-definir', progress: 0, notes: notes.trim() });
  }

  return (
    <Modal onClose={onClose} c={c}>
      <ModalHeader title="AGREGAR PROYECTO" onClose={onClose} c={c} />
      <Field label="ÍCONO (EMOJI)" c={c}>
        <input value={icon} onChange={(e) => setIcon(e.target.value)} style={inputStyle(c)} />
      </Field>
      <Field label="NOMBRE DEL PROYECTO" c={c}>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="Ej: App de Reservas"
          style={inputStyle(c)}
        />
      </Field>
      <Field label="NOTAS (OPCIONAL)" c={c}>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...inputStyle(c), resize: 'vertical' }} />
      </Field>
      {error && <div style={{ fontSize: 12, color: c.danger, marginBottom: 12 }}>{error}</div>}
      <button onClick={handleCreate} style={primaryBtnStyle(c)}>
        Crear proyecto
      </button>
    </Modal>
  );
}
