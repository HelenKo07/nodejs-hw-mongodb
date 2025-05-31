import express from 'express';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/auth.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = async () => {
  const app = express();

  app.use(cookieParser());

  app.use(
    express.json({
      type: ['application/json', 'aplication/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.send('Welcome to the Contacts API!');
  });

  app.use('/api/auth', authRouter);
  app.use('/api/contacts', authenticate, contactsRouter);

  app.use(errorHandler);

  app.use(notFoundHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
