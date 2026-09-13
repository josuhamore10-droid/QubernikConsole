'use client';

import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { allModels } from '@/lib/models';
import { inputStyle, chipBtnStyle } from '@/lib/ui';

const MODELS = allModels();

export default function ChatPanel({ project, messages, setMessages, selectedModel, setSelectedModel, onProgressDetected, c }) {
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerStatus, setProviderStatus] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  // Solo mostramos en el selector los modelos cuyo proveedor ya tiene
  // clave configurada. Si ninguno está configurado todavía, mostramos el
  // catálogo completo para no dejar el selector vacío.
  useEffect(() => {
    fetch('/api/env')
      .then((res) => res.json())
      .then(setProviderStatus)
      .catch(() => setProviderStatus(null));
  }, []);

  const configuredModels = providerStatus
    ? MODELS.filter((m) => providerStatus[m.provider]?.configured)
    : [];
  const visibleModels = configuredModels.length > 0 ? configuredModels : MODELS;

  useEffect(() => {
    if (configuredModels.length > 0 && !configuredModels.some((m) => m.id === selectedModel)) {
      setSelectedModel(configuredModels[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerStatus]);

  // Envía el historial + el proyecto actual a /api/chat. Cualquier error
  // (clave faltante, fallo de red, respuesta no-OK) se muestra como un
  // mensaje dentro del chat en vez de lanzar una excepción — así una falla
  // aquí nunca deja la página en un estado roto.
  async function sendMessage(text) {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setDraft('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, messages: nextMessages, project }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages([...nextMessages, { role: 'assistant', content: `⚠ Error: ${data.error}`, isError: true }]);
        return;
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.content }]);

      const match = data.content.match(/progreso[:\s]+(\d{1,3})\s*%/i);
      if (match) {
        const pct = Math.min(100, Math.max(0, Number(match[1])));
        onProgressDetected(pct);
      }
    } catch (err) {
      setMessages([...nextMessages, { role: 'assistant', content: `⚠ Error de red: ${err.message}`, isError: true }]);
    } finally {
      setLoading(false);
    }
  }

  const modelMeta = MODELS.find((m) => m.id === selectedModel);

  return (
    <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 10, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${c.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
          CHAT — {(modelMeta?.label || selectedModel).toUpperCase()}
        </div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{ ...inputStyle(c), width: 'auto', padding: '6px 10px', cursor: 'pointer' }}
        >
          {visibleModels.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      </div>

      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ fontSize: 12.5, color: c.muted, lineHeight: 1.6 }}>
            Cuéntale a {modelMeta?.label || 'tu asistente'} en qué va este proyecto, o usa uno de los botones de abajo para pedirle el plan completo.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 0.5,
                color: c.muted,
                marginBottom: 4,
                textAlign: m.role === 'user' ? 'right' : 'left',
              }}
            >
              {m.role === 'user' ? 'TÚ' : (modelMeta?.label || selectedModel).toUpperCase()}
            </div>
            <div
              style={{
                background: m.isError ? 'rgba(229,72,77,0.12)' : m.role === 'user' ? c.accent : c.panelAlt,
                color: m.isError ? c.danger : m.role === 'user' ? '#fff' : c.text,
                border: m.isError ? `1px solid ${c.danger}` : 'none',
                borderRadius: 8,
                padding: '10px 13px',
                fontSize: 13,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ fontSize: 12, color: c.muted }}>Escribiendo…</div>}
      </div>

      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.border}`, display: 'flex', gap: 10 }}>
        <button style={chipBtnStyle(c)} onClick={() => sendMessage('Dame el plan completo de este proyecto, de 0 a 100%, por niveles y tareas.')}>
          Paso a paso 0 → 100%
        </button>
        <button style={chipBtnStyle(c)} onClick={() => sendMessage('¿Cómo vamos? Revisa el progreso y notas actuales y dime el siguiente paso inmediato.')}>
          ¿Cómo vamos?
        </button>
      </div>

      <div style={{ padding: 16, display: 'flex', gap: 10 }}>
        <button style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${c.border}`, background: 'transparent', color: c.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed' }} title="Adjuntar archivo (próximamente)" disabled>
          <Paperclip size={15} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(draft); } }}
          placeholder={`Escríbele a ${modelMeta?.label || 'tu asistente'}...`}
          style={{ ...inputStyle(c), flex: 1 }}
        />
        <button
          onClick={() => sendMessage(draft)}
          disabled={loading || !draft.trim()}
          style={{
            background: c.text,
            color: c.bg,
            border: 'none',
            borderRadius: 8,
            padding: '0 18px',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: loading || !draft.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !draft.trim() ? 0.5 : 1,
          }}
        >
          Enviar <Send size={13} />
        </button>
      </div>
    </div>
  );
}
