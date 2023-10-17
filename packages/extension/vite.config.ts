import { defineConfig } from "vite";
import { resolve } from "node:path";

import solid from "vite-plugin-solid";
import { crx } from "@crxjs/vite-plugin";

import manifest from "./src/manifest";

const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

export default defineConfig({
  plugins: [solid(), crx({ manifest })],
  publicDir,
  
  build: {
    outDir,
    sourcemap: true,
    rollupOptions: {
      external: ["difflib"]
    }
  }
});