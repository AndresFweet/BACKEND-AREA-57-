import { pool } from "../../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("media", 10);

export const createLiveRequest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar archivos:", err);
      return res.status(500).json({ message: "Error al procesar archivos" });
    }

    try {
      const { title, description, idTipo, estado } = req.body;
      const media = req.files;

      const id_tipo = parseInt(idTipo, 10);

      if (!media || media.length === 0) {
        return res.status(400).json({ message: "No se recibieron archivos." });
      }

      const fecha = new Date();

      const result = await pool.query(
        `INSERT INTO work.cfg_transmision_manual
              (id_tipo, title, descripcion,  id_user, date_create, date_update, estatus)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING id, date_create`,
        [id_tipo, title, description, req.user.id, fecha, fecha, estado]
      );

      const { id, date_create } = result.rows[0];

      if (id && date_create) {
        try {
          const dateString = new Date(date_create).toISOString().split("T")[0];
          const folderName = `${id}_${dateString}`;
          const folderPath = path.join(
            __dirname,
            "../../../uploads/streem",
            folderName
          );

          await fs.promises.mkdir(folderPath, { recursive: true });

          await Promise.all(
            media.map(async (file, index) => {
              const fileName = `${Date.now()}_${index}_${file.originalname}`;
              const filePath = path.join(folderPath, fileName);

              await fs.promises.writeFile(filePath, file.buffer);
            })
          );

          return res.status(200).json("¡Registro almacenado exitosamente...!");
        } catch (error) {
          console.error("Error al manejar archivos:", error);
          return res.status(500).json("Error al manejar archivos.");
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json("Error al almacenar el registro.");
    }
  });
};

export const getPartidosLive = async (req, res) => {
  try {
    // Consulta para obtener videos
    const resultsFound = await pool.query(`
        SELECT id,
               title,
               descripcion,
               date_create
        FROM work.cfg_gestion_contenido
        WHERE id_tipo = 2 AND estatus = true
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
          "../../..",
          "uploads",
          "stream",
          folderName
        ); // 'uploads/streem' está en la raíz

        let videoUrl = null;

        try {
          // Leer el contenido de la carpeta de videos
          const files = fs.readdirSync(videosFolderPath);

          if (files.length > 0) {
            // Suponiendo que el primer archivo en la carpeta es el video que necesitas
            const firstVideoFile = files[0];
            videoUrl = `${process.env.FRONTEND_URL}/uploads/stream/${folderName}/${firstVideoFile}`;
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
      `SELECT gm.id, gm.title, gm.descripcion, gm.date_create,
	  c.nombre_campeonato, j.nombre FROM work.cfg_gestion_media gm
	  JOIN work.cfg_campeonatos c on c.id = gm.idtorneo
	  JOIN work.cfg_jornadas j on j.id = gm.idjornada
	  WHERE gm.id_tipo = 2 AND gm.estatus = true AND c.id_deporte = 1
	  ORDER BY gm.date_create DESC
	  LIMIT 12`);

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
          "stream",
          folderName
        ); // 'uploads/stream' está en la raíz

        let videoUrl = null;

        try {
          // Leer el contenido de la carpeta de videos
          const files = fs.readdirSync(videosFolderPath);

          if (files.length > 0) {
            // Suponiendo que el primer video en la carpeta es el que necesitas
            const firstVideoFile = files[0];
            videoUrl = `${process.env.FRONTEND_URL}/uploads/stream/${folderName}/${firstVideoFile}`;
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

export const getStreemDateRequest = async (req, res) => {
  try {
    const date = req.params.date;

    const resultsFound = await pool.query(
      `SELECT id, title, descripcion  FROM work.cfg_transmision_manual 
        WHERE date_create::date = $1::date
        AND id_tipo = $2 AND estatus = $3`,
      [date, 2, true]
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
