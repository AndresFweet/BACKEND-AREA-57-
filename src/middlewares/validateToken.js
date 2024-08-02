import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { pool } from "../db.js";

export const authRequired = async (req, res, next) => {
  const { token } = req.cookies;
  let id_usuario;

  if (!token) return res.status(401).json("No token, authorization denied");

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid Token");

    id_usuario = user.id;
  });

  //consulta sql
  const userFound = await pool.query(
    `SELECT * FROM config.cfg_usuarios
    WHERE id = $1`,
    [id_usuario]
  );

  req.user = {
    id: userFound.rows[0].id,
    idRol: userFound.rows[0].id_rol,
    email: userFound.rows[0].email
  };

  next();
};
