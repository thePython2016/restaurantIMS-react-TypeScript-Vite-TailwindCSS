import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    dedupe: ["@mui/material", "@mui/system", "@mui/utils"],
  },
  build: {
    cssMinify: "lightningcss",
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      // Avoid EMFILE on Windows when bundling large packages like @mui/icons-material
      maxParallelFileOps: 2,
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  define: {
    // Define process.env for compatibility
    'process.env': 'import.meta.env',
  },
  server: {
    proxy: {
      // Proxy API requests to Django backend
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
