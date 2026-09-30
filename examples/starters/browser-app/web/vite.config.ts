import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `npm run dev` serves the UI on :5173 and proxies Factory (and the dev
// sign-in routes) to the Go process, so the browser sees one origin.
// The Go app trusts http://localhost:5173 for CSRF (see main.go).
const target = process.env.FACTORY_URL ?? "http://127.0.0.1:8080";

export default defineConfig({
  plugins: [react()],
  // Go embeds web/dist (ui.go); the build script re-creates dist/.gitkeep.
  build: { outDir: "dist", emptyOutDir: true, chunkSizeWarningLimit: 1024 },
  server: {
    proxy: {
      // The ClientLink WebSocket; `ws: true` is what makes the upgrade work.
      "/v1/realtime": { target, ws: true },
      "/v1": { target },
      "/dev": { target },
    },
  },
});
