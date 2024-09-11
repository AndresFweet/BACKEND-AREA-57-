import { Router } from "express";
import { authRequired } from "../../middlewares/validateToken.js";

import { createJornadaRequest, getJornadaRequest, getJornadasByIdTorneroRequest, getTotalJornadasByTorneoRequest, searchJornadaRequest, updateJornadaRequest } from '../../controllers/config/jornadas.js'

const router = Router();

router.post("/config/createNewJornada", authRequired, createJornadaRequest)

router.post("/config/searchJornadas", authRequired, searchJornadaRequest)

router.get("/config/getJornada/:id", authRequired, getJornadaRequest)

router.put("/config/updateJornada/:id", authRequired, updateJornadaRequest)

router.get("/config/getJornadasByIdTornero/:idTorneo", getJornadasByIdTorneroRequest )

router.get("/config/getTotalJornadasByTorneo/:id", getTotalJornadasByTorneoRequest )

export default router;