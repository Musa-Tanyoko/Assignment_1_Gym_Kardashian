import * as functions from 'firebase-functions';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import { appRouter } from './trpc';

const app = express();

app.use('/trpc', createExpressMiddleware({ router: appRouter }));

export const trpc = functions.https.onRequest(app);
