import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { Server } from 'socket.io';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth/auth.routes.js';
import newRoutes from './routes/config/new.routes.js';
import liveRoutes from './routes/config/live.routes.js';
import interviewRoutes from './routes/config/interview.routes.js';
import preRecordRoutes from './routes/config/prerRecord.routes.js';

// Necesario para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización Express
const app = express();

// Configuración para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configura CORS para Express
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Módulo para visualizar las peticiones al backend
app.use(morgan('dev'));

// Módulo para trabajar las peticiones en formato JSON
app.use(express.json());

// Módulo para almacenar las cookies
app.use(cookieParser());

// Sección para utilizar las rutas importadas
app.use('/api', authRoutes);
app.use('/api', newRoutes);
app.use('/api', liveRoutes);
app.use('/api', interviewRoutes);
app.use('/api', preRecordRoutes);

// Configuración de multer para manejar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint para guardar grabaciones
app.post('/save-recording', upload.single('video'), (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!title || !description || !file) {
    return res.status(400).send('Title, description, and video are required');
  }

  const dir = path.join(__dirname, 'recordings', title);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Mover el archivo a la carpeta de grabaciones
  const filePath = path.join(dir, file.originalname);
  fs.renameSync(file.path, filePath);

  // Guardar título y descripción en un archivo de texto
  fs.writeFileSync(path.join(dir, 'info.txt'), `Title: ${title}\nDescription: ${description}`);

  res.send('Recording saved successfully');
});

// Configuración de socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Origen permitido para socket.io
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('video-frame', (image) => {
    socket.broadcast.emit('video-stream', image);
  });

  socket.on('audio-stream', (audioData) => {
    socket.broadcast.emit('audio-stream', audioData);
  });

  socket.on('counter-update', (counter) => {
    socket.broadcast.emit('counter-update', counter);
  });

  socket.on('marker-update', (marker) => {
    socket.broadcast.emit('marker-update', marker);
  });

  socket.on('team-update', (teams) => {
    const { teamA, teamB } = teams;
    socket.broadcast.emit('team-update', { teamA, teamB });
  });

  socket.on('disconnect', () => {
    //console.log("user disconnected");
  });
});

// Configuración del servidor dependiendo del entorno
let server;
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync('/path/to/your/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/path/to/your/cert.pem', 'utf8');
  const ca = fs.readFileSync('/path/to/your/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

// Usa el puerto de la variable de entorno o un valor por defecto
const port = process.env.PORTLIVE || 5000;

server.listen(port, () => {
  console.log(
    `Server is running on ${
      process.env.NODE_ENV === 'production' ? 'https' : 'http'
    }://localhost:${port}`
  );
});

export default app;
