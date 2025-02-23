import { AliasOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@libs": path.resolve(__dirname, "src/libs"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@configs": path.resolve(__dirname, "src/configs"),
      "@redux": path.resolve(__dirname, "src/redux"),
      "@types": path.resolve(__dirname, "src/types"),
    } as AliasOptions,
  },
});
