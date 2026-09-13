import { NextResponse } from 'next/server';
import { MODEL_CATALOG } from '@/lib/models';
import { detectProviderFromKey } from '@/lib/providerDetect';
import { upsertEnvVar, removeEnvVar, maskValue } from '@/lib/env';

// GET: estado de cada proveedor (configurado sí/no + una versión
// enmascarada de la clave). Nunca devuelve la clave completa.
export async function GET() {
  const status = Object.fromEntries(
    Object.entries(MODEL_CATALOG).map(([providerId, cfg]) => {
      const value = process.env[cfg.envVar];
      return [
        providerId,
        {
          envVar: cfg.envVar,
          label: cfg.label,
          configured: Boolean(value),
          masked: value ? maskValue(value) : null,
        },
      ];
    })
  );
  return NextResponse.json(status);
}

// POST { key }: detecta el proveedor por el formato de la clave y la
// guarda en .env.local (además de en process.env, para que aplique ya
// mismo sin reiniciar el servidor).
export async function POST(req) {
  try {
    const { key } = await req.json();
    if (!key || !key.trim()) {
      return NextResponse.json({ error: 'Pega una clave primero.' }, { status: 200 });
    }

    const providerId = detectProviderFromKey(key);
    if (!providerId) {
      return NextResponse.json(
        { error: 'No reconozco el formato de esta clave. Verifica que la copiaste completa.' },
        { status: 200 }
      );
    }

    const cfg = MODEL_CATALOG[providerId];
    upsertEnvVar(cfg.envVar, key.trim());

    return NextResponse.json({ ok: true, provider: providerId, providerLabel: cfg.label });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Error guardando la clave.' }, { status: 200 });
  }
}

// DELETE { provider }: quita la clave de .env.local y de process.env.
export async function DELETE(req) {
  try {
    const { provider } = await req.json();
    const cfg = MODEL_CATALOG[provider];
    if (!cfg) {
      return NextResponse.json({ error: 'Proveedor desconocido.' }, { status: 200 });
    }
    removeEnvVar(cfg.envVar);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Error eliminando la clave.' }, { status: 200 });
  }
}
