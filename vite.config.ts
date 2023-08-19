import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 512
  },
  plugins: [react()],
  server: {
    host: true,
  },
  
 
});
