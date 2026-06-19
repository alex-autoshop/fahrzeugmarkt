import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command }) => ({
  // Lokal unter "/", auf GitHub Pages unter "/fahrzeugmarkt/"
  base: command === "build" ? "/fahrzeugmarkt/" : "/",
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { port: 5180 },
}));
