import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/auth.route';
import venueRoutes from './routes/venue.route';
import contactRoutes from './routes/contact.route';
import offenderRoutes from './routes/offender.route';
import userRoutes from './routes/user.route';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hour session expiry
  }
}));


// Use auth routes
app.get('/api/test', () => {
  console.log('okok');
});
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/offenders', offenderRoutes);


// Test route for jest cause its 1am
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});


async function connectToDatabase() {
  try {
    console.log('Connecting to database');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Check if this file is being run directly
if (path.resolve(__filename) === path.resolve(process.argv[1])) {
  startServer();
}

export { app, startServer, connectToDatabase };