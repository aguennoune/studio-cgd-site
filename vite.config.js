import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves a project site under /<repo>/. Override with SITE_BASE
// ("/" for a user site such as studio-cgd.github.io).
export default defineConfig({
  base: process.env.SITE_BASE ?? "/studio-cgd-site/",
  plugins: [react()],
});
