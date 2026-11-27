import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { hintApi } from './server/plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      hintApi({
        provider: env.LLM_PROVIDER === 'openai' ? 'openai' : 'mock',
        baseUrl: env.LLM_BASE_URL ?? 'http://localhost:11434/v1',
        model: env.LLM_MODEL ?? 'llama3.2',
        apiKey: env.LLM_API_KEY ?? '',
      }),
    ],
  };
});
