import { pool } from "../../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getInteviewRequest = async (req, res) => {
  try {
    // Consulta para obtener videos
    const resultsFound = await pool.query(`
        SELECT id, 
               title,
               descripcion,
               date_create
        FROM work.cfg_transmision_manual
        WHERE id_tipo = 1 AND estatus = true
        ORDER BY date_create DESC
        LIMIT 3;
      `);

    if (resultsFound.rows.length <= 0) {
      return res.status(400).json("No se encontraron resultados");
    }

    // Obtener los videos y procesar las URLs
    const videosWithUrls = await Promise.all(
      resultsFound.rows.map(async (video) => {
        const { id, date_create } = video;
        const dateFormatted = date_create.toISOString().slice(0, 10); // Formato: aaaa-mm-dd
        const folderName = `${id}_${dateFormatted}`;
        const videosFolderPath = path.join(
          __dirname,
          "../../../",
          "uploads",
          "streem",
          folderName
        ); // 'uploads/streem' está en la raíz

        let videoUrl = null;

        try {
          // Leer el contenido de la carpeta de videos
          const files = fs.readdirSync(videosFolderPath);

          if (files.length > 0) {
            // Suponiendo que el primer archivo en la carpeta es el video que necesitas
            const firstVideoFile = files[0];
            videoUrl = `${process.env.FRONTEND_URL}/uploads/streem/${folderName}/${firstVideoFile}`;
          }
        } catch (err) {
          console.error(
            `Error al leer la carpeta de videos para el ID ${id}:`,
            err
          );
        }

        // Devolver el registro de videos con la URL del video
        return {
          ...video,
          videoUrl,
        };
      })
    );

    res.status(200).json(videosWithUrls);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error Inesperado.");
  }
};

export const getTotalStreemRequest = async (req, res) => {
  try {
    const resultsFound = await pool.query(
      `SELECT * FROM work.cfg_transmision_manual WHERE id_tipo = $1 AND estatus = $2 ORDER BY date_create DESC LIMIT 12`,
      [1, true]
    );

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
            videoUrl = `${process.env.FRONTEND_URL}/uploads/streem/${folderName}/${firstVideoFile}`;
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
};

export const getInterviewsDateRequest = async (req, res) => {
  try {
    const date = req.params.date;

    let resultsFound = await pool.query(
      `SELECT * FROM work.cfg_transmision_manual 
        WHERE date_create::date = $1::date
        AND id_tipo = $2 AND estatus = $3`,
      [date, 1, true]
    );

    if (resultsFound.rows.length <= 0) {
      resultsFound = await pool.query(
        `SELECT * FROM work.cfg_transmision_manual WHERE id_tipo = 1 LIMIT 10`
      );
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
            videoUrl = `${process.env.FRONTEND_URL}/uploads/streem/${folderName}/${firstVideoFile}`;
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
};
