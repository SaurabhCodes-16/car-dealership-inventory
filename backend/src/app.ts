import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Placeholder route for health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default app;
