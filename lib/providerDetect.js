// Detecta el proveedor a partir de la forma de la clave pegada por el
// usuario. Es una heurística por formato, no una llamada real a ninguna
// API — sirve para decidir en qué variable de entorno guardarla.

export function detectProviderFromKey(rawKey) {
  const key = (rawKey || '').trim();
  if (!key) return null;

  if (/^sk-ant-/i.test(key)) return 'anthropic';
  if (/^AIza[0-9A-Za-z_-]{20,}$/.test(key)) return 'google';
  if (/^sk-(proj-)?[A-Za-z0-9]{20,}$/.test(key) && !/^sk-ant-/i.test(key)) return 'openai';

  return null;
}
