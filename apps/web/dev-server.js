const express = require('express');
const cors = require('cors');
const { createExpressMiddleware } = require('@trpc/server/adapters/express');
const { appRouter, createContext } = require('./src/lib/trpc/server.ts');

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// tRPC middleware
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 tRPC server running on http://localhost:${PORT}`);
}); 