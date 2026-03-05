import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

function localAudioUploadPlugin() {
  return {
    name: 'local-audio-upload',
    configureServer(server: any) {
      server.middlewares.use('/api/upload-song', (req: any, res: any) => {
        if (req.method === 'POST') {
          const urlStr = req.url || '';
          const searchParams = new URLSearchParams(urlStr.split('?')[1]);
          const rawFilename = searchParams.get('filename') || `song.mp3`;
          // Keep original extension, sanitize the name part
          const ext = path.extname(rawFilename) || '.mp3';
          const nameOnly = path.basename(rawFilename, ext);
          const safeName = nameOnly.replace(/[^a-zA-Z0-9\-]/g, '_');
          const safeFilename = `${Date.now()}_${safeName}${ext}`;

          const targetDir = path.resolve(__dirname, 'public/songs');
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const targetPath = path.join(targetDir, safeFilename);
          const chunks: Buffer[] = [];

          req.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          req.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks);
              fs.writeFileSync(targetPath, buffer);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ url: '/songs/' + safeFilename }));
            } catch (err) {
              console.error(err);
              res.statusCode = 500;
              res.end('Error writing file');
            }
          });

          req.on('error', (err: any) => {
            console.error(err);
            res.statusCode = 500;
            res.end('Error uploading file');
          });

          return;
        }
        res.statusCode = 405;
        res.end('Method not allowed');
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ['**/public/songs/**']
    }
  },
  plugins: [react(), mode === "development" && componentTagger(), localAudioUploadPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
