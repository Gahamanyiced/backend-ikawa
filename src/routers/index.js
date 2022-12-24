import express from 'express';
import articleRouters from './article.route.js';
import authRouters from './auth.route.js';
import eventRouters from './event.route.js';
import userRouters from './user.route.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routes = express();

routes.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

routes.use('/api/v1/articles', articleRouters),
  routes.use('/api/v1/auth', authRouters),
  routes.use('/api/v1/events', eventRouters);
  routes.use('/api/v1/users', userRouters);
routes.get('*', (req, res) => {
  res.status(404).json({
    message: 'Page not found, try again',
  });
});

export default routes;
