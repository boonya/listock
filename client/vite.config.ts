import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import {type CommonServerOptions, defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import tsConfigPaths from 'vite-tsconfig-paths';
import z from 'zod';
import {background_color, theme_color} from './providers/theme/theme';

const ModeSchema = z.enum(['production', 'development']);

const BuildEnvVars = z.object({
  APP_LANG: z.string().length(2),
  NAME: z.string().min(3),
  DESCRIPTION: z.string().min(10),
  REVISION: z.string().min(1),
});

const RuntimeEnvVars = z.object({
  API_URL: z.url().endsWith('/'),
});

const DevEnvVars = z.object({
  DEVSERVER_HOSTNAME: z.string().default('localhost'),
  DEVSERVER_PORT: z.coerce.number().min(1024).max(65_535).default(31_234),
});

export default defineConfig((config) => {
  const mode = ModeSchema.parse(config.mode);
  const env = loadEnv(mode, process.cwd(), '');

  const {APP_LANG, NAME, DESCRIPTION, REVISION} = BuildEnvVars.parse(env);

  const {API_URL} = mode === 'production' ? {} : RuntimeEnvVars.parse(env);

  const {DEVSERVER_PORT, DEVSERVER_HOSTNAME} =
    mode === 'development' ? DevEnvVars.parse(env) : {};

  let httpsServer: CommonServerOptions['https'];
  try {
    if (mode === 'development') {
      const key = fs.readFileSync(
        path.resolve(__dirname, './localhost-key.pem'),
      );
      const cert = fs.readFileSync(path.resolve(__dirname, './localhost.pem'));
      httpsServer = {key, cert};
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: This is what I wanted to achieve
    console.warn('https is not available.', error);
  }

  return {
    define: {
      REVISION: JSON.stringify(REVISION),
    },
    resolve: {
      alias: {
        '@/': import.meta.resolve('.'),
      },
    },
    build: {
      outDir: 'build',
    },
    server: {
      open: true,
      port: DEVSERVER_PORT,
      host: DEVSERVER_HOSTNAME,
      https: httpsServer,
    },
    plugins: [
      {
        name: 'transform-index.html',
        transformIndexHtml(html) {
          return html
            .replace(/<title>(.*?)<\/title>/, `<title>${NAME}</title>`)
            .replaceAll('%API_URL%', API_URL ?? '%API_URL%');
        },
      },
      tsConfigPaths(),
      react(),
      VitePWA({
        devOptions: {
          /* enable sw on development */
          enabled: true,
          type: 'module',
          /* other options */
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
          ],
        },
        manifest: {
          lang: APP_LANG,
          name: NAME,
          short_name: NAME,
          description: DESCRIPTION,
          theme_color,
          background_color,
          display: 'standalone',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
  };
});
