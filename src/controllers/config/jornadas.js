import { pool } from "../../db.js";

export const createJornadaRequest = async (req, res) => {
  try {
    //elementos del body
    const { idCampeonato, name, Estado } = req.body;

    //insertar los registros
    const result = await pool.query(
      `INSERT INTO work.cfg_jornadas
                (id_campeonato, nombre, id_usuario, estado, date_create, date_update) 
                VALUES ($1, $2, $3, $4, $5, $6) `,
      [idCampeonato, name, req.user.id, Estado, new Date(), new Date()]
    );

    return res.status(200).json("Registro almacenado correctamente!");
  } catch (error) {
    return res.status(500).json("Error de servidor" + error);
  }
};

export const searchJornadaRequest = async (req, res) => {
  try {
    const { name } = req.body;
    //realizar consulta a la base de datos
    const resultsFound = await pool.query(
      `SELECT j.id,
		   c.nombre_campeonato as torneo,
		   j.nombre as jornada,
		   j.estado,
		   TO_CHAR(j.date_create, 'YYYY-MM-DD') AS date_create
	from work.cfg_jornadas j
	JOIN work.cfg_campeonatos c on c.id = j.id_campeonato
    WHERE j.nombre ILIKE $1`,
      [`%${name}%`]
    );

    if (resultsFound.rows <= 0) {
      return res.status(400).json("No se econtraron resultados");
    }

    return res.status(200).json(resultsFound);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getJornadaRequest = async (req, res) => {
  try {
    const id = req.params.id;

    //realizar consulta a la base de datos
    const resultsFound = await pool.query(
      `SELECT * FROM work.cfg_jornadas WHERE id = $1`,
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

export const updateJornadaRequest = async (req, res) => {
  try {
    //parametro de idTorneo
    const idJornada = req.params.id;
    // accede a la data enviada en el cuerpo de la solicitud
    const { idCampeonato, name, Estado } = req.body;
    //ejecutar el script update
    const result = await pool.query(
      `UPDATE work.cfg_jornadas
         SET id_campeonato = $1,
           nombre = $2,
           id_usuario = $3,
           estado = $4,
           date_update = $5
           WHERE id = $6
           RETURNING id, date_update`,
      [idCampeonato, name, req.user.id, Estado, new Date(), idJornada]
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

export const getJornadasByIdTorneroRequest = async (req, res) => {
  try {
    const idTorneo = req.params.idTorneo;
    
    //realizar consulta a la base de datos
    const resultsFound = await pool.query(
      `	SELECT id, nombre FROM work.cfg_jornadas
	  WHERE estado = true AND id_campeonato = $1`,
      [idTorneo]
    )
    
    //validar resultados de busqueda
    if (resultsFound.rows <= 0) {
      return res.status(400).json("No hay resultados");
    }

    return res.status(200).json(resultsFound);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTotalJornadasByTorneoRequest = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json('Error de servidor...')
  }
}