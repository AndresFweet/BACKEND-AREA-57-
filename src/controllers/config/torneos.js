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
    const data = req.body;
    //parametros del json
    const paramName = data.data.values.name;

    const resultsFound = await pool.query(
      `SELECT c.id,
		   tc.nombre as tipo_campeonato,
		   d.nombre as deporte,
		   c.nombre_campeonato,
		   c.descripcion,
		   c.id_usuario, 
		   TO_CHAR(c.date_create, 'YYYY-MM-DD') AS date_create,
		   c.estado FROM work.cfg_campeonatos c
		JOIN WORK.ref_deporte d on d.id = c.id_deporte
		JOIN WORk.ref_tipo_campeonato tc on tc.id = c.id_tipo_campeonato
	    WHERE c.nombre_campeonato ILIKE $1`,
      [`%${paramName}%`]
    );

    if (resultsFound.rows <= 0) {
      return res.status(400).json("No se econtraron resultados");
    }

    return res.status(200).json(resultsFound);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTorneoRequest = async (req, res) => {
  try {
    const id = req.params.id;
    //realizar consulta a la base de datos
    const resultsFound = await pool.query(
      `SELECT * FROM work.cfg_campeonatos WHERE id = $1`,
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

export const updateTorneoRequest = async (req, res) => {
  try {
    //parametro de idTorneo
    const idTorneo = req.params.id;
    // accede a la data enviada en el cuerpo de la solicitud
    const { name, idTipo, idDeporte, descripcion, Estado } = req.body;
    //ejecutar el script update
    const result = await pool.query(
      `UPDATE work.cfg_campeonatos
     SET id_tipo_campeonato = $1,
         id_deporte = $2,
         nombre_campeonato = $3,
         descripcion = $4,
         id_usuario = $5,
         date_update = $6,
         estado = $7
         WHERE id = $8
         RETURNING id, date_update`,
      [
        idTipo,
        idDeporte,
        name,
        descripcion,
        req.user.id,
        new Date(),
        Estado,
        idTorneo,
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
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTorneosActivosRequest = async (req, res) => {
  try {
    const resultsFound = await pool.query(`SELECT id,nombre_campeonato FROM work.cfg_campeonatos WHERE estado = true`)
  
    if (resultsFound.rows <= 0) {
      return res.status(400).json('No hay torneos activos')
    }

    return res.status(200).json(resultsFound)

  } catch (error) {
    return res.status(500).json('Error de servidor')
  }
}
  