import pg from "pg";
import {
  USERNAME_DATABASE,
  HOST_DATABASE,
  PASSWORD_DATABASE,
  DATA_BASE,
  PORT_DATABASE,
} from "./config.js";

// Configuración del pool de conexiones
export const pool = new pg.Pool({
  user: USERNAME_DATABASE,
  host: HOST_DATABASE,
  password: PASSWORD_DATABASE,
  database: DATA_BASE,
  port: PORT_DATABASE,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log(">>> DB is connected");
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};
