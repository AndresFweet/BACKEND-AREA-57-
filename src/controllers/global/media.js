import { pool } from "../../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
  { name: "banner", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export const createNewMediaRequest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar archivos:", err);
      return res.status(500).json({ message: "Error al procesar archivos" });
    }

    try {
      const { title, idTipo, idTorneo, idJornada, description, Estado } = req.body;
      const { banner, video } = req.files;

      const id_tipo = parseInt(idTipo, 10);

      // Verificar si se recibieron archivos
      if (!banner && !video) {
        return res.status(400).json({ message: "No se recibieron archivos." });
      }

      const fecha = new Date();

      // Insertar en la base de datos
      const result = await pool.query(
        `INSERT INTO work.cfg_gestion_media
              (id_tipo, title, descripcion, id_user, date_create, date_update, estatus, idtorneo, idjornada)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              RETURNING id, date_create`,
        [
          id_tipo,
          title,
          description,
          req.user.id,
          fecha,
          fecha,
          Estado,
          idTorneo,
          idJornada,
        ]
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

          // Crear la carpeta si no existe
          await fs.promises.mkdir(folderPath, { recursive: true });

          // Guardar la imagen de banner
          if (banner && banner[0]) {
            const bannerFilePath = path.join(folderPath, "banner.webp");
            await fs.promises.writeFile(bannerFilePath, banner[0].buffer);
          }

          // Guardar el archivo de video
          if (video && video[0]) {
            const videoFilePath = path.join(folderPath, "video.mp4");
            await fs.promises.writeFile(videoFilePath, video[0].buffer);
          }

          return res.status(200).json("¡Registro almacenado exitosamente!");
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

export const getTipoMediaRequest = async (req, res) => {
  try {
    const resultsFound = await pool.query(`SELECT * FROM work.ref_tipo_media`);
    //validar los resultados
    if (resultsFound.rows <= 0) {
      return res.status(400).json("Datos no encontrados");
    }

    return res.status(200).json(resultsFound);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const searchMediaRequest = async (req, res) => {
  try {
    const { name } = req.body;

    //realizar consulta a la base de datos
    const resultsFound = await pool.query(
      `SELECT gm.id as id,
      TO_CHAR(gm.date_create, 'YYYY-MM-DD') AS fecha,
		   tm.name as tipo,
		   gm.title as titulo,
		   gm.descripcion,
		   c.nombre_campeonato,
		   j.nombre as jornada,
		   gm.estatus as estado
	FROM work.cfg_gestion_media gm
	JOIN work.ref_tipo_media tm on tm.id = gm.id_tipo
	JOIN work.cfg_campeonatos c on c.id = gm.idtorneo
	JOIN work.cfg_jornadas j on j.id = gm.idjornada
    WHERE gm.title ILIKE $1`,
      [`%${name}%`]
    );
    //validar resultados
    if (resultsFound.rows <= 0) {
      return res.status(400).json("No se econtraron resultados");
    }

    return res.status(200).json(resultsFound);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getElementMediaRequest = async (req, res) => {
  try {
    const id = req.params.id;
    //realizar consulta a la base de datos
    const resultsFound = await pool.query(
      `SELECT id_tipo,title,descripcion,estatus, idtorneo, idjornada FROM work.cfg_gestion_media
       WHERE id = $1`,
      [id]
    );
    //validar resultados encontrados
    if (resultsFound.rows <= 0) {
      return res.status(400).json("Error. No hay registros");
    }

    return res.status(200).json(resultsFound);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateElementMediaRequest = async (req, res) => {
  try {
    //parametro de idTorneo
    const idElementMedia = req.params.id;
    //req.body
    const { title, idTipo, idTorneo, idJornada, description, Estado } =
      req.body;

      const result = await pool.query(
        `UPDATE work.cfg_gestion_media
         SET id_tipo = $1,
             title = $2,
             descripcion = $3,
             id_user = $4,
             date_update = $5,
             estatus = $6,
             idtorneo = $7,
             idjornada = $8
         WHERE id = $9
         RETURNING id, date_update`,
        [
          idTipo,
          title,
          description,
          req.user.id,  // El usuario que realiza la actualización
          new Date(),        // fecha de actualización
          Estado,
          idTorneo,
          idJornada,
          idElementMedia            // id del registro a actualizar
        ]
      );
      
    //validar registro
    const { id, date_update } = result.rows[0];

    if (id && date_update) {
      return res.status(200).json("¡Registro actualizado exitosamente...!");
    } else {
      return res.status(500).json("Error al manejar archivos.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
