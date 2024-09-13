import { pool } from "../../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Para manejar ESM y obtener dirname

// Obtener el __dirname equivalente para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getElementMediaSportRequest = async (req, res) => {
    try {
        // Consulta para obtener las noticias
        const resultsFound = await pool.query(`SELECT gm.id, gm.title, gm.descripcion, gm.date_create,
        c.nombre_campeonato, j.nombre FROM work.cfg_gestion_media gm
        JOIN work.cfg_campeonatos c on c.id = gm.idtorneo
        JOIN work.cfg_jornadas j on j.id = gm.idjornada
        WHERE gm.id_tipo = 2 AND gm.estatus = true AND c.id_deporte = 2
        ORDER BY gm.date_create DESC
        LIMIT 3`);
    
        // Verificar si se encontraron resultados
        if (resultsFound.rows.length === 0) {
          return res.status(400).json({ message: "No se encontraron resultados" });
        }
    
        // Procesar los resultados y agregar las rutas de las imágenes
        const footballWithImages = await Promise.all(
          resultsFound.rows.map(async (row) => {
            const { id, date_create } = row;
            const dateFormatted = date_create.toISOString().slice(0, 10); // Formato: aaaa-mm-dd
            const folderName = `${id}_${dateFormatted}`;
    
            // Resolver la ruta completa del directorio
            const bannerFolderPath = path.resolve(
              __dirname,
              "../../..", // Ajusta según la estructura de tu proyecto
              "uploads",
              "streem",
              folderName
            );
    
            console.log(`Resolviendo ruta del banner: ${bannerFolderPath}`); // Depuración
    
            let bannerUrl = null;
    
            try {
              // Verificar si el directorio existe antes de leer los archivos
              if (fs.existsSync(bannerFolderPath)) {
                const files = fs.readdirSync(bannerFolderPath);
    
                // Verificar si 'banner.webp' existe en la carpeta
                if (files.includes("banner.webp")) {
                  // Si existe el archivo 'banner.webp', construimos la URL pública
                  bannerUrl = `${process.env.FRONTEND_URL}/uploads/streem/${folderName}/banner.webp`;
                }
              } else {
                console.error(`El directorio ${bannerFolderPath} no existe.`);
              }
            } catch (err) {
              console.error(
                `Error al leer la carpeta de imágenes para el ID ${id}:`,
                err
              );
            }
    
            // Retornar el registro con la URL del banner
            return {
              ...row,
              bannerUrl,
            };
          })
        );
    
        // Devolver la lista de noticias con sus respectivas imágenes
        return res.status(200).json(footballWithImages);
      } catch (error) {
        console.error("Error en getElementFutbolRequest:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
}