import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
export function loadEnv() {
  const config = { ...process.env };
  for (const file of [resolve('../.env'), resolve('.env')]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
      if (match) config[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  return config;
}
