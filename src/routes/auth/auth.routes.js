//llamado del enrutador global
import { Router } from "express";
//importando los controladores para las peticiones
import { signin, verifyToken, logOutRequest } from "../../controllers/auth/auth.controller.js";
//importar modulo encargado de validar token
import { authRequired } from "../../middlewares/validateToken.js";
//importar modulo encargado de validar el schema
import { validateSchema } from "../../middlewares/validateSchema.js";
//importar schemas
import { signinSchema } from "../../validator/auth/auth.schema.js";
//ejecucion del enrutador para las peticiones
const router = Router();

/**RUTAS PARA LA SECCION SEGURIDAD(LOGIN Y TOKEN) */

router.post("/security/signin", validateSchema(signinSchema), signin);

router.get("/security/verifyToken", verifyToken);

router.post("/security/logout", authRequired, logOutRequest);

//exportando las rutas de trabajo
export default router;
