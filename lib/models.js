// Catálogo de modelos por proveedor. Cada proveedor declara la variable de
// entorno que debe existir en .env.local para poder usarse. El navegador
// nunca ve las claves reales: solo llega hasta aquí, y de aquí las lee el
// route handler del servidor (app/api/chat/route.js).

export const MODEL_CATALOG = {
  anthropic: {
    label: 'Claude',
    envVar: 'ANTHROPIC_API_KEY',
    color: '#D97757',
    models: [
      { id: 'claude-opus-5', label: 'Claude Opus 5', apiModel: 'claude-opus-5' },
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', apiModel: 'claude-sonnet-5' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', apiModel: 'claude-haiku-4-5-20251001' },
    ],
  },
  openai: {
    label: 'OpenAI',
    envVar: 'OPENAI_API_KEY',
    color: '#10A37F',
    models: [
      { id: 'gpt-5-1', label: 'GPT-5.1', apiModel: 'gpt-5.1' },
    ],
  },
  google: {
    label: 'Gemini',
    envVar: 'GOOGLE_API_KEY',
    color: '#4285F4',
    models: [
      { id: 'gemini-3-1-pro', label: 'Gemini 3.1 Pro', apiModel: 'gemini-3.1-pro' },
    ],
  },
};

export function allModels() {
  return Object.entries(MODEL_CATALOG).flatMap(([providerId, cfg]) =>
    cfg.models.map((m) => ({ ...m, provider: providerId, providerLabel: cfg.label, color: cfg.color }))
  );
}

export function getProviderForModel(modelId) {
  for (const [providerId, cfg] of Object.entries(MODEL_CATALOG)) {
    if (cfg.models.some((m) => m.id === modelId)) return providerId;
  }
  return null;
}

export function getModelMeta(modelId) {
  return allModels().find((m) => m.id === modelId) || null;
}
