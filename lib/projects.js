// Persistencia simple en localStorage. Es intencional que no haya backend
// todavía: esto te deja correr la app con `npm run dev` sin base de datos.
// Cuando quieras persistencia real entre dispositivos, reemplaza estas
// funciones por llamadas a tu API/DB, la forma de los datos no cambia.

const STORAGE_KEY = 'qubernik:projects';

export const SEED_PROJECTS = [
  {
    slug: 'bot-trading-algoritmico',
    icon: '✅',
    name: 'Bot Trading Algorítmico',
    status: 'en-progreso',
    progress: 35,
    notes: 'RandomForest + Bollinger/ADX/RSI. Backtesting walk-forward en curso.',
  },
  { slug: 'crowdfunding-inmobiliario', icon: '🗂️', name: 'Crowdfunding Inmobiliario', status: 'sin-definir', progress: 0, notes: '' },
  { slug: 'aion-ia-escalado-empresarial', icon: '🗂️', name: 'Aion IA Escalado Empresarial', status: 'sin-definir', progress: 0, notes: '' },
  { slug: 'qubernik-dashboard', icon: '🗒️', name: 'Qubernik Dashboard', status: 'sin-definir', progress: 0, notes: '' },
  { slug: 'ventur-ideas', icon: '💡', name: 'Ventur (Ideas)', status: 'idea', progress: 0, notes: '' },
  { slug: 'cashplay-telegram', icon: '🚀', name: 'CashPlay (Telegram)', status: 'sin-definir', progress: 0, notes: '' },
  { slug: 'agencia-web-chatbots', icon: '🗂️', name: 'Agencia Web & Chatbots', status: 'sin-definir', progress: 0, notes: '' },
  { slug: 'token-qubernik', icon: '🗂️', name: 'Token Qubernik', status: 'sin-definir', progress: 0, notes: '' },
];

export const STATUS_OPTIONS = [
  { value: 'idea', label: 'Idea' },
  { value: 'sin-definir', label: 'Sin definir' },
  { value: 'en-progreso', label: 'En progreso' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'completado', label: 'Completado' },
];

export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function loadProjects() {
  if (typeof window === 'undefined') return SEED_PROJECTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
      return SEED_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SEED_PROJECTS;
  }
}

export function saveProjects(projects) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    // Ignorar si el almacenamiento no está disponible.
  }
}

export function getProject(slug) {
  return loadProjects().find((p) => p.slug === slug) || null;
}

export function upsertProject(patchOrNew) {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.slug === patchOrNew.slug);
  let next;
  if (idx === -1) {
    next = [...projects, patchOrNew];
  } else {
    next = projects.map((p, i) => (i === idx ? { ...p, ...patchOrNew } : p));
  }
  saveProjects(next);
  return next;
}

export function loadChat(slug) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(`qubernik:chat:${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveChat(slug, messages) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`qubernik:chat:${slug}`, JSON.stringify(messages));
  } catch (e) {
    // Ignorar.
  }
}
