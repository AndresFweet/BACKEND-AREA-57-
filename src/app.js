import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Importar rutas
import authRoutes from "./routes/auth/auth.routes.js";
import newRoutes from "./routes/config/new.routes.js";
import liveRoutes from "./routes/config/live.routes.js"
import interviewRoutes from "./routes/config/interview.routes.js"
import preRecordRoutes from './routes/config/prerRecord.routes.js'
import mommentsRoutes from "./routes/config/momments.routes.js"

import TorneoRoutes from './routes/config/torneos.routes.js'

// Necesario para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización Express
const app = express();  

//midlewers
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Configuración para servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Configura CORS para Express
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);



//seccion de rutas con autorizacion
app.use("/api", authRoutes);
//seccion para nuevos elementos (news, interviews y mas)
app.use("/api", newRoutes);
//seccion para streeming online
app.use("/api", liveRoutes)
//seccion de entrevisas
app.use("/api", interviewRoutes)
//seccion de grabacioes
app.use("/api", preRecordRoutes)
//seccion para momments notabele
app.use("/api", mommentsRoutes)
//seccion para el modulo de campeonatos y/o torneos
app.use("/api", TorneoRoutes)
export default app;
