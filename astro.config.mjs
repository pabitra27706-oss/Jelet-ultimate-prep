import { defineConfig } from 'astro/config';
import { base } from './scripts/static-server.mjs';

export default defineConfig({
  base: base.replace(/\/$/, ''),
  output: 'static',
  trailingSlash: 'always',
});
