import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

const PORT = 3000;

// In-memory store for donations
let donations: any[] = [
  { id: '1', amount: 5000, sender: 'Almas B.', message: 'На микрофон!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', amount: 1500, sender: 'Zhanar', message: 'Привет со стрима', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: '3', amount: 10000, sender: 'Darkhan', message: 'Топ контент', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  
  // Setup Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/donations', (req, res) => {
    res.json(donations);
  });

  // Webhook for MacroDroid / Tasker
  app.post('/api/webhooks/kaspi', (req, res) => {
    try {
      const { amount, sender, message } = req.body;
      
      if (!amount || !sender) {
        return res.status(400).json({ error: 'Missing required fields (amount, sender)' });
      }

      const newDonation = {
        id: Date.now().toString(),
        amount: Number(amount),
        sender: String(sender),
        message: message ? String(message) : '',
        timestamp: new Date().toISOString()
      };

      donations.unshift(newDonation); // Add to beginning
      
      // Keep only last 100 donations in memory
      if (donations.length > 100) {
        donations.pop();
      }

      // Broadcast to all connected clients
      io.emit('new_donation', newDonation);

      console.log('New Kaspi Donation Received:', newDonation);
      res.status(200).json({ success: true, donation: newDonation });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Send initial data
    socket.emit('initial_donations', donations);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('skip_media', () => {
      console.log('Broadcasting skip_media');
      io.emit('skip_media');
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
