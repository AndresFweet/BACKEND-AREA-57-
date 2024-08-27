import { pool } from "../../db.js";

export const getMommentsTopequest = async (req, res) => {
  try {
    //consulta para btener videos
    const resultsFound = await pool.query(`
        SELECT tm.id,
               ttm.name AS tipo, 
               tm.title,
               tm.descripcion,
               tm.id_user,
               tm.date_create,
               tm.date_update,
               tm.estatus
        FROM work.cfg_transmision_manual tm
        JOIN work.ref_tipo_transmision_manual ttm ON ttm.id = tm.id_tipo
        WHERE tm.id_tipo = 3 AND tm.estatus = true
        ORDER BY tm.date_create DESC
        LIMIT 9;
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
