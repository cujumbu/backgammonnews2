// ESM syntax for imports
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run the TypeScript file using ts-node
const fetcher = spawn('npx', ['tsx', join(__dirname, 'news-fetcher.ts')], {
  stdio: 'inherit'
});

fetcher.on('error', (err) => {
  console.error('Failed to start news fetcher:', err);
  process.exit(1);
});

console.log('News fetcher started. Will run every 6 hours.');