// Builds dist/khoj-extension-v<version>.zip from extension/ (uses the system `zip` tool).
import { readFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const { version } = JSON.parse(readFileSync('extension/manifest.json', 'utf8'));
const out = `dist/khoj-extension-v${version}.zip`;
mkdirSync('dist', { recursive: true });
rmSync(out, { force: true });
execFileSync('zip', ['-r', '-X', `../${out}`, '.', '-x', '.*'], { cwd: 'extension', stdio: 'inherit' });
console.log(`Built ${out}`);
