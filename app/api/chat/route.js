import { NextResponse } from 'next/server';
import { MODEL_CATALOG, getProviderForModel, getModelMeta } from '@/lib/models';
import { buildSystemPrompt } from '@/lib/systemPrompt';

// IMPORTANTE: este handler corre en el servidor. Es el único lugar que lee
// las claves de API (de process.env), así que nunca llegan al navegador.
// Cualquier problema (clave faltante, error de la API, etc.) se devuelve
// como JSON con status 200 y un campo `error`, en vez de lanzar una
// excepción — así el chat puede mostrar un mensaje de error dentro de la
// conversación sin romper el resto de la página (que era el bug original:
// un error sin capturar aquí podía tumbar la navegación del resto del app).
export async function POST(req) {
  try {
    const body = await req.json();
    const { model, messages, project } = body || {};

    if (!model || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Petición inválida: falta "model" o "messages".' }, { status: 200 });
    }

    const providerId = getProviderForModel(model);
    if (!providerId) {
      return NextResponse.json({ error: `Modelo desconocido: ${model}` }, { status: 200 });
    }

    const providerCfg = MODEL_CATALOG[providerId];
    const apiKey = process.env[providerCfg.envVar];
    if (!apiKey) {
      return NextResponse.json(
        { error: `Falta ${providerCfg.envVar} en .env.local` },
        { status: 200 }
      );
    }

    const system = buildSystemPrompt(project);
    const cleanMessages = messages.map((m) => ({ role: m.role, content: m.content }));

    if (providerId === 'anthropic') {
      const modelMeta = getModelMeta(model);
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelMeta.apiModel,
          max_tokens: 1500,
          system,
          messages: cleanMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error?.message || `Error ${res.status} llamando a la API de Anthropic.`;
        return NextResponse.json({ error: message }, { status: 200 });
      }

      const text = (data.content || [])
        .map((block) => (block.type === 'text' ? block.text : ''))
        .filter(Boolean)
        .join('\n');

      return NextResponse.json({ content: text || '(respuesta vacía)' });
    }

    // Los otros proveedores están declarados en lib/models.js para que
    // aparezcan en el selector, pero la llamada real todavía no está
    // implementada aquí. Devolvemos un error claro en vez de fallar en
    // silencio, para que sepas exactamente qué falta si los seleccionas.
    return NextResponse.json({
      error: `La integración con ${providerCfg.label} todavía no está implementada en app/api/chat/route.js. Agrega la llamada a su API ahí, siguiendo el mismo patrón que el bloque de Anthropic.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || 'Error inesperado en el servidor.' },
      { status: 200 }
    );
  }
}
