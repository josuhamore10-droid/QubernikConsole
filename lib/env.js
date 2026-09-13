// Lee y escribe .env.local en disco. Esto SOLO tiene sentido en desarrollo
// local (`npm run dev`): el proceso de Next.js sigue vivo mientras editas
// el archivo, así que además de escribirlo actualizamos `process.env`
// directamente para que el cambio aplique sin reiniciar el servidor.
//
// En un hosting serverless (Vercel, etc.) el sistema de archivos suele ser
// de solo lectura, así que esto no funcionaría ahí — las claves de
// producción se configuran en el panel del proveedor, no desde la app.

import fs from 'fs';
import path from 'path';

const ENV_PATH = path.join(process.cwd(), '.env.local');

function readEnvFile() {
  if (!fs.existsSync(ENV_PATH)) return '';
  return fs.readFileSync(ENV_PATH, 'utf8');
}

export function upsertEnvVar(varName, value) {
  const content = readEnvFile();
  const lines = content.length ? content.split('\n') : [];
  const needsQuotes = /\s|#/.test(value);
  const formattedValue = needsQuotes ? `"${value}"` : value;

  let found = false;
  const nextLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith(`${varName}=`)) {
      found = true;
      return `${varName}=${formattedValue}`;
    }
    return line;
  });

  if (!found) {
    if (nextLines.length && nextLines[nextLines.length - 1].trim() !== '') nextLines.push('');
    nextLines.push(`${varName}=${formattedValue}`);
  }

  fs.writeFileSync(ENV_PATH, nextLines.join('\n'));
  process.env[varName] = value; // refleja el cambio en el servidor ya corriendo
}

export function removeEnvVar(varName) {
  const content = readEnvFile();
  const lines = content.length ? content.split('\n') : [];
  const nextLines = lines.filter((line) => !line.trim().startsWith(`${varName}=`));
  fs.writeFileSync(ENV_PATH, nextLines.join('\n'));
  delete process.env[varName];
}

export function maskValue(value) {
  if (!value) return '';
  if (value.length <= 8) return '••••••••';
  return `${value.slice(0, 6)}••••${value.slice(-4)}`;
}
