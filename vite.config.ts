import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { spawn, type ChildProcess } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vite plugin that auto-starts the backend when you run npm run dev
// This means ONE command (npm run dev) starts EVERYTHING
function autoStartBackend() {
  let backendProcess: ChildProcess | null = null;

  return {
    name: "auto-start-backend",
    configureServer() {
      console.log("\n🚀 Auto-starting PathPort backend...\n");

      backendProcess = spawn("node", ["Server/index.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: false,
      });

      backendProcess.on("error", (err) => {
        console.error("❌ Backend failed to start:", err.message);
      });

      backendProcess.on("exit", (code) => {
        if (code !== 0 && code !== null) {
          console.error(`❌ Backend exited with code ${code}`);
        }
      });

      // Kill backend when Vite shuts down
      process.on("exit", () => backendProcess?.kill());
      process.on("SIGINT", () => { backendProcess?.kill(); process.exit(0); });
      process.on("SIGTERM", () => { backendProcess?.kill(); process.exit(0); });
    },
  };
}

export default defineConfig({
  plugins: [react(), autoStartBackend()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            // Only log once, not on every request
            if (!err.message.includes("ECONNREFUSED")) return;
            console.error(
              "\n[BACKEND NOT READY] Waiting for backend on port 5000...\n"
            );
          });
        },
      },
    },
  },
});
