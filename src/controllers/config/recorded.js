import { pool } from "../../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("media", 10);

export const getRecordedRequest = async (req, res) => {
    try {
    
        const id = req.params.id;
    
        const resultsFound = await pool.query(
          `SELECT * FROM work.cfg_gestion_media
            WHERE id = $1`, [id]);
    
        if (resultsFound.rows.length <= 0) {
          return res.status(400).json("No se encontraron resultados");
        }
    
        // Obtener las noticias y procesar los videos
        const newsWithVideos = await Promise.all(
          resultsFound.rows.map(async (news) => {
            const { id, date_create } = news;
            const dateFormatted = date_create.toISOString().slice(0, 10); // Formato: aaaa-mm-dd
            const folderName = `${id}_${dateFormatted}`;
            const videosFolderPath = path.join(
              __dirname,
              "../../..",
              "uploads",
              "streem",
              folderName
            ); // 'uploads/stream' está en la raíz
    
            let videoUrl = null;
    
            try {
              // Leer el contenido de la carpeta de videos
              const files = fs.readdirSync(videosFolderPath);
    
              if (files.length > 0) {
                // Suponiendo que el primer video en la carpeta es el que necesitas
                const firstVideoFile = files[0];
                videoUrl = `${process.env.FRONTEND_URL}/uploads/streem/${folderName}/video.mp4`;
              }
            } catch (err) {
              console.error(
                `Error al leer la carpeta de videos para el ID ${id}:`,
                err
              );
            }
    
            // Devolver el registro de noticias con la URL del video
            return {
              ...news,
              videoUrl,
            };
          })
        );
    
        res.status(200).json(newsWithVideos);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
}