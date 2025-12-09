import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  // Use the provided API key as a fallback if not found in environment variables
  const apiKey = env.API_KEY || "AIzaSyDZCqJePdj1WaSdFDvA826IXRYJgtfEhCw";
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
    }
  };
});