import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigin = process.env.FRONTEND_URL;
    if (!origin || origin === allowedOrigin || origin.includes('vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', service: 'LeadDesk Backend' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
