import { pool } from "../../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("media", 10);

export const createNewRequest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar archivos:", err);
      return res.status(500).json({ message: "Error al procesar archivos" });
    }

    try {
      const { title, description } = req.body;
      const media = req.files;

      if (!media || media.length === 0) {
        return res.status(400).json({ message: "No se recibieron archivos." });
      }

      const result = await pool.query(
        `INSERT INTO work.cfg_news
          (title, description, id_category, id_user, date_create, date_update, estatus)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, date_create`,
        [
          title,
          description,
          1, // Ajusta según tu lógica
          req.user.id,
          new Date(),
          new Date(),
          true,
        ]
      );

      const { id, date_create } = result.rows[0];

      if (id && date_create) {
        try {
          const dateString = new Date(date_create).toISOString().split("T")[0];
          const folderName = `${id}_${dateString}`;
          const folderPath = path.join(
            __dirname,
            "../../../uploads",
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

export const getNewsRandom = async (req, res) => {
  try {
    // Consulta para obtener las noticias 
    const resultsFound = await pool.query(`SELECT * FROM work.cfg_news
    ORDER BY RANDOM()
    LIMIT 2;`);

    if (resultsFound.rows.length <= 0) {
      return res.status(400).json('No se encontraron resultados');
    }

    // Obtener las noticias y procesar las imágenes
    const newsWithImages = await Promise.all(resultsFound.rows.map(async (news) => {
      const { id, date_create } = news;
      const dateFormatted = date_create.toISOString().slice(0, 10); // Formato: aaaa-mm-dd
      const folderName = `${id}_${dateFormatted}`;
      const imagesFolderPath = path.join(__dirname, '../../..', 'uploads', folderName); // 'uploads' está en la raíz

      let imageUrl = null;

      try {
        // Leer el contenido de la carpeta de imágenes
        const files = fs.readdirSync(imagesFolderPath);
        
        if (files.length > 0) {
          // Suponiendo que la primera imagen en la carpeta es la que necesitas
          const firstImageFile = files[0];
          imageUrl = `http://localhost:4000/uploads/${folderName}/${firstImageFile}`;
        }
      } catch (err) {
        console.error(`Error al leer la carpeta de imágenes para el ID ${id}:`, err);
      }

      // Devolver el registro de noticias con la URL de la imagen
      return {
        ...news,
        imageUrl,
      };
    }));

    res.status(200).json(newsWithImages);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error Inesperado.");
  }
};

export const gwtNewsRecents = async (req, res) => {
  try {
    // Consulta para obtener las noticias
    const resultsFound = await pool.query(`SELECT * FROM work.cfg_news ORDER BY date_create DESC LIMIT 3;`);

    if (resultsFound.rows.length <= 0) {
      return res.status(400).json('No se encontraron resultados');
    }

    // Obtener las noticias y procesar las imágenes
    const newsWithImages = await Promise.all(resultsFound.rows.map(async (news) => {
      const { id, date_create } = news;
      const dateFormatted = date_create.toISOString().slice(0, 10); // Formato: aaaa-mm-dd
      const folderName = `${id}_${dateFormatted}`;
      const imagesFolderPath = path.join(__dirname, '../../..', 'uploads', folderName); // 'uploads' está en la raíz

      let imageUrl = null;

      try {
        // Leer el contenido de la carpeta de imágenes
        const files = fs.readdirSync(imagesFolderPath);
        
        if (files.length > 0) {
          // Suponiendo que la primera imagen en la carpeta es la que necesitas
          const firstImageFile = files[0];
          imageUrl = `http://localhost:4000/uploads/${folderName}/${firstImageFile}`;
        }
      } catch (err) {
        console.error(`Error al leer la carpeta de imágenes para el ID ${id}:`, err);
      }

      // Devolver el registro de noticias con la URL de la imagen
      return {
        ...news,
        imageUrl,
      };
    }));

    res.status(200).json(newsWithImages);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error Inesperado.");
  }
}

export const getNewRequest = async (req, res) => {
  const idNew = req.params.id;
  try {
    // Consulta para obtener las noticias
    const resultsFound = await pool.query(`SELECT * FROM work.cfg_news WHERE id = $1;`, [idNew]);

    if (resultsFound.rows.length <= 0) {
      return res.status(400).json('No se encontraron resultados');
    }

    // Obtener las noticias y procesar las imágenes y videos
    const newsWithMedia = await Promise.all(resultsFound.rows.map(async (news) => {
      const { id, date_create } = news;
      const dateFormatted = date_create.toISOString().slice(0, 10); // Formato: aaaa-mm-dd
      const folderName = `${id}_${dateFormatted}`;
      const mediaFolderPath = path.join(__dirname, '../../..', 'uploads', folderName); // 'uploads' está en la raíz

      let mediaUrls = [];

      try {
        // Leer el contenido de la carpeta de medios (imágenes y videos)
        const files = fs.readdirSync(mediaFolderPath);
        
        if (files.length > 0) {
          mediaUrls = files.map(file => `http://localhost:4000/uploads/${folderName}/${file}`);
        }
      } catch (err) {
        console.error(`Error al leer la carpeta de medios para el ID ${id}:`, err);
      }

      // Devolver el registro de noticias con las URLs de los medios
      return {
        ...news,
        mediaUrls,
      };
    }));

    res.status(200).json(newsWithMedia);
    
  } catch (error) {
    console.error('Error al obtener las noticias:', error);
    return res.status(400).json('No se encontraron resultados');
  }
}