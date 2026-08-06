require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// --- FIX HERE: Destructure the import ---
const { socketHandler } = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

connectDB();

// Required when deployed behind a proxy/load balancer (Render, Railway, Heroku, etc.)
// so that secure cookies and req.ip work correctly.
app.set('trust proxy', 1);

// Support one or many allowed origins via a comma-separated env var, e.g.
// CLIENT_URL=https://myapp.vercel.app,https://www.myapp.com
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim());

const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin (curl, mobile apps, server-to-server, health checks)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
};

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(xss());

// Basic rate limiting on the API to slow down brute-force / abuse in production
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/messages', messageRoutes);

// Simple health check endpoint - most hosts (Render/Railway) ping this
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, status: 'ok' });
});

// --- THIS LINE WILL NOW WORK ---
socketHandler(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Avoid silent crashes in production going unnoticed
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
});