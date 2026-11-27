import type { Plugin } from 'vite';
import { texts } from '../src/content/index';
import { getHint, type LlmConfig } from './hints';

/** Serves POST /api/hint from the dev server, so API keys never reach the browser. */
export function hintApi(config: LlmConfig): Plugin {
  return {
    name: 'hint-api',
    configureServer(server) {
      server.middlewares.use('/api/hint', async (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        if (req.method !== 'POST') return send(405, { error: 'POST only' });

        let raw = '';
        for await (const chunk of req) raw += chunk;
        let body: { textId?: string; questionId?: string };
        try {
          body = JSON.parse(raw);
        } catch {
          return send(400, { error: 'invalid JSON' });
        }

        const text = texts.find((t) => t.id === body.textId);
        const question = text?.questions.find((q) => q.id === body.questionId);
        if (!text || !question) return send(404, { error: 'unknown text or question' });
        send(200, await getHint(config, text, question));
      });
    },
  };
}
