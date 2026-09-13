'use client';

import { useState, useEffect } from 'react';
import { STATUS_OPTIONS } from '@/lib/projects';
import { inputStyle, primaryBtnStyle } from '@/lib/ui';

export default function ProgressPanel({ project, onSave, c }) {
  const [status, setStatus] = useState(project.status);
  const [progress, setProgress] = useState(project.progress);
  const [notes, setNotes] = useState(project.notes || '');
  const [saved, setSaved] = useState(false);

  // Si el chat actualiza el progreso automáticamente, refleja el cambio aquí.
  useEffect(() => {
    setProgress(project.progress);
  }, [project.progress]);

  function handleSave() {
    onSave({ status, progress: Number(progress), notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 10, padding: 20, height: 'fit-content' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 20 }}>AVANCE DEL PROYECTO</div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 0.5, color: c.muted, marginBottom: 6 }}>ESTADO</div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...inputStyle(c), cursor: 'pointer' }}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 0.5, color: c.muted, marginBottom: 10 }}>
          PROGRESO: {progress}% <span style={{ opacity: 0.7 }}>(auto vía IA)</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 0.5, color: c.muted, marginBottom: 6 }}>NOTAS</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} style={{ ...inputStyle(c), resize: 'vertical' }} />
      </div>

      <button onClick={handleSave} style={primaryBtnStyle(c)}>
        {saved ? 'Guardado ✓' : 'Guardar avance'}
      </button>
    </div>
  );
}
