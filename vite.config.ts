import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin(), tsconfigPaths()],
  publicDir: "assets",
  build: {
    target: "esnext",
  },
  esbuild: {
    legalComments: "none",
  },
});
