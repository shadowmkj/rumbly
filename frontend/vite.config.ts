import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

const monaco = (monacoEditorPlugin as unknown as { default?: any })?.default || (monacoEditorPlugin as any)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), monaco({})],
})