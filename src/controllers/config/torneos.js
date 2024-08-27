import { pool } from "../../db.js";

export const getTipoCampeonatoRequest = async (req, res) => {
  try {
    const resultsFound = await pool.query(
      `SELECT * FROM work.ref_tipo_campeonato`
    );
    if (resultsFound.rows.length <= 0) {
      return res.status(400).json("No se encontraron resultados");
    }
    res.status(200).json(resultsFound);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTipoDeporteRequest = async (req, res) => {
  try {
    const resultsFound = await pool.query(`SELECT * FROM work.ref_deporte`);
    if (resultsFound.rows <= 0) {
      return res.status(400).json("No se encontraron resultados");
    }
    res.status(200).json(resultsFound);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createNewCampeonatoRequest = async (req, res) => {
  try {
    const { name, idTipo, idDeporte, descripcion, Estado } = req.body;
    //insertar REGISTRO
    const result = await pool.query(
      `INSERT INTO work.cfg_campeonatos (
    id_tipo_campeonato, id_deporte, nombre_campeonato, descripcion, id_usuario, date_create, date_update, estado) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, date_create`,
      [
        idTipo,
        idDeporte,
        name,
        descripcion,
        req.user.id,
        new Date(),
        new Date(),
        Estado,
      ]
    );
    //validar registro
    const { id, date_create } = result.rows[0];

    if (id && date_create) {
      return res.status(200).json("¡Registro almacenado exitosamente...!");
    } else {
      return res.status(500).json("Error al manejar archivos.");
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const searchCampeonatosRequest = async (req, res) => {
  try {
    const param = req.params.nombre;

    const resultsFound = await pool.query(
      `SELECT * FROM work.cfg_campeonatos WHERE nombre_campeonato ILIKE '%${param}%'; `
    );

    if (resultsFound.rows <= 0) {
        return res.status(400).json("¡No se encontraron resultados...!");
    }

    return res.status(200).json(resultsFound.rows);

  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
