//importar el pool de conexion BD
import { pool } from "../../db.js";
//modulo para encriptacion de contraeñas
import bcrypt from "bcryptjs";
//modulo para manejar los token(COOKIES)
import { createAccesToken } from "../../libs/jwt.js";
//jsonwebtoken
import jwt from "jsonwebtoken";
//secret
import { TOKEN_SECRET } from "../../config.js";
//controladores para las peticiones del modulo (security)

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //ubicar usuario y su data
    const resultFound = await pool.query(
      `SELECT * FROM config.cfg_usuarios
         WHERE email = $1`,
      [email]
    );

    //validar resultados
    if (resultFound.rows.length <= 0) {
      return res.status(400).json(["Error de credenciales..."]);
    }

    //comparar pass y passHash
    const isMatch = await bcrypt.compare(
      password,
      resultFound.rows[0].password
    );
    if (!isMatch) {
      return res.status(400).json(["Error de credenciales..."]);
    }

    //creacion token
    const token = await createAccesToken({
      id: resultFound.rows[0].id,
    });

    //establecer cookie
    res.cookie("token", token);
    res.json({
      id: resultFound.rows[0].id,
      idRol: resultFound.rows[0].id_rol,
      email: resultFound.rows[0].email,
    });
    console.log(resultFound.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json(["Unauthorized"]);

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json(["Unauthorized"]);

    //ubicar usuario y su data
    const userFound = await pool.query(
      `SELECT * FROM config.cfg_usuarios
         WHERE id = $1`,
      [user.id]
    );
    if (!userFound) return res.status(401).json(["Unauthorized"]);

    return res.json({
      id: userFound.rows[0].id,
      idRol: userFound.rows[0].id_rol,
      email: userFound.rows[0].email,
    });
  });
};

export const logOutRequest = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  res.sendStatus(200);
};
