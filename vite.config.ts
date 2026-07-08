import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import https from 'https'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'google-reviews-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/reviews', (_req, res) => {
            const apiKey = env.GOOGLE_PLACES_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY is not defined in development environment' }));
              return;
            }
            const placeId = 'ChIJpWgLK2lZ54YRh7XQPLRAiK4';
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

            https.get(url, (apiRes) => {
              let data = '';
              apiRes.on('data', (chunk) => { data += chunk; });
              apiRes.on('end', () => {
                try {
                  const json = JSON.parse(data);
                  res.statusCode = json.status === 'OK' ? 200 : 500;
                  res.setHeader('Content-Type', 'application/json');
                  if (json.status === 'OK') {
                    res.end(JSON.stringify(json.result));
                  } else {
                    res.end(JSON.stringify({ error: json.error_message || `Google Places API returned status: ${json.status}` }));
                  }
                } catch (e) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Failed to parse Google Places API response in dev server middleware' }));
                }
              });
            }).on('error', (err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            });
          });
        }
      }
    ],
    server: {
      port: Number(process.env.PORT) || 5173,
    },
  };
})

