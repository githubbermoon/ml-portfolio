import { cp, rm, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mode = process.env.SITE_MODE === 'realms' ? 'realms' : 'professional';
const pagesDir = path.join(root, 'src', 'pages');
const sourceDir = path.join(root, 'src', mode);
const sharedDir = path.join(root, 'src', 'shared-pages');

async function copyIfExists(from, to) {
  if (existsSync(from)) {
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { recursive: true });
  }
}

await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });

await copyIfExists(sharedDir, pagesDir);
await copyIfExists(sourceDir, pagesDir);

const homeComponent = mode === 'realms' ? 'RealmsHome' : 'ProfessionalHome';
await writeFile(
  path.join(pagesDir, 'index.astro'),
  `---\nimport ${homeComponent} from '../components/${homeComponent}.astro';\n---\n\n<${homeComponent} />\n`,
);

console.log(`Prepared ${mode} pages in ${path.relative(root, pagesDir)}`);
