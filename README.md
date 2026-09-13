# Qubernik Console

Consola de proyectos con un asistente de IA que actúa como gestor de
proyectos senior (MBA + 10 años de experiencia) y arma planes por niveles,
con tareas, entregables y "próximo paso inmediato".

## 1. Instalar y correr

```bash
npm install
cp .env.local.example .env.local
```

Abre `.env.local` y pon tu clave real:

```
ANTHROPIC_API_KEY=sk-ant-tu-clave-aqui
```

Luego:

```bash
npm run dev
```

Abre `http://localhost:3000`.

**Importante:** cada vez que edites `.env.local`, detén el servidor
(Ctrl+C) y vuelve a correr `npm run dev`. Next.js no recarga variables de
entorno en caliente.

## 2. Qué se corrigió respecto a la versión anterior

- **Los proyectos ahora sí abren.** Cada tarjeta usa `<Link href="/project/[slug]">`
  de Next.js en vez de una navegación manual — no depende de que otro
  estado de la página (como el chat) se haya inicializado bien primero.
- **Las claves de API viven solo en el servidor** (`.env.local`), nunca en
  el navegador. El único lugar que las lee es `app/api/chat/route.js`.
- **Los errores del chat ya no rompen la página.** Si falta una clave o la
  API responde con error, `app/api/chat/route.js` devuelve
  `{ error: "..." }` como JSON normal (no lanza una excepción), y
  `ChatPanel` lo muestra como un mensaje dentro de la conversación —
  exactamente el mensaje que viste en tu captura, pero ahora contenido y
  sin afectar el resto de la app.

## 3. Estructura

```
qubernik-app/
├── app/
│   ├── layout.jsx                 # layout raíz + ThemeProvider
│   ├── page.jsx                   # consola (grid de proyectos)
│   ├── project/[slug]/page.jsx    # panel de avance + chat de un proyecto
│   └── api/
│       ├── chat/route.js          # llama a la API de Anthropic (server-side)
│       └── status/route.js        # informa qué proveedores tienen su .env
├── components/                    # UI: tarjetas, modales, panel de avance, chat
└── lib/
    ├── models.js                  # catálogo de modelos por proveedor
    ├── systemPrompt.js            # el prompt del "gestor de proyectos"
    ├── projects.js                # persistencia en localStorage (seed + CRUD)
    ├── theme.jsx                  # tema oscuro/claro
    └── ui.js                      # estilos compartidos
```

## 4. Cómo funciona el chat

1. El cliente (`ChatPanel.jsx`) manda `{ model, messages, project }` a
   `POST /api/chat`.
2. El route handler identifica el proveedor del modelo elegido
   (`lib/models.js`), busca la variable de entorno correspondiente, y si
   no existe responde con un error legible en vez de fallar.
3. Si la clave existe, arma el `system` prompt (`lib/systemPrompt.js`)
   inyectando el nombre, estado, progreso y notas del proyecto actual, y
   llama a `POST https://api.anthropic.com/v1/messages`.
4. Si la respuesta del asistente incluye un patrón `Progreso: NN%`, el
   progreso del proyecto se actualiza solo (esto es el "(auto vía IA)"
   que se ve junto a la barra de progreso).

## 5. Agregar claves desde la app (menú → Proveedores)

Ya no hace falta editar `.env.local` a mano: en el menú (☰) → **Proveedores**
puedes pegar una clave y:

1. `app/api/env/route.js` detecta el proveedor por el formato de la clave
   (`lib/providerDetect.js`).
2. La guarda en `.env.local` (la crea si no existe) y además la aplica de
   inmediato a `process.env` del servidor que ya está corriendo — **no
   hace falta reiniciar** `npm run dev`.
3. El selector de modelos del chat y el indicador "MODELOS: ..." de la
   consola se actualizan solos para mostrar solo lo que ya tiene clave.

Puedes quitar una clave con el ícono de basura junto a cada proveedor
(esto la borra tanto de `.env.local` como de `process.env`).

**Nota:** esto escribe el archivo en disco, así que solo tiene sentido en
desarrollo local. Si más adelante despliegas esta app en un hosting como
Vercel, el sistema de archivos ahí es de solo lectura — las claves de
producción se configuran desde el panel de variables de entorno de ese
proveedor, no desde este modal.

## 6. Proveedores adicionales (OpenAI, Gemini)

Ya están declarados en `lib/models.js` y aparecen en el selector, pero la
llamada real a sus APIs todavía no está implementada — verás un mensaje
claro si los seleccionas. Para activarlos, agrega un bloque en
`app/api/chat/route.js` igual al de Anthropic, usando el SDK o el
endpoint HTTP de cada proveedor.

## 7. Persistencia

No hay base de datos: los proyectos y el historial de cada chat se
guardan en `localStorage` del navegador (por eso "vive" solo en tu
máquina y se resetea si limpias los datos del sitio). Cuando quieras
persistencia real, reemplaza las funciones de `lib/projects.js` por
llamadas a tu propia API/DB — la forma de los datos no cambia.
