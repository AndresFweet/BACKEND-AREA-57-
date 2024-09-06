import { Router } from "express";

import { authRequired } from "../../middlewares/validateToken.js";

//controllers
import {
  getTipoCampeonatoRequest,
  getTipoDeporteRequest,
  createNewCampeonatoRequest,
  searchCampeonatosRequest,
  getTorneoRequest,
  updateTorneoRequest,
  getTorneosActivosRequest,
} from "../../controllers/config/torneos.js";

const router = Router();

router.get("/config/getTipoCampeonato", authRequired, getTipoCampeonatoRequest);

router.get("/config/getTipoDeporte", authRequired, getTipoDeporteRequest);

router.post(
  "/config/createNewTorneo",
  authRequired,
  createNewCampeonatoRequest
);

router.post("/confg/searchTorneos", authRequired, searchCampeonatosRequest);

router.get("/config/getTorneo/:id", authRequired, getTorneoRequest)


router.put("/config/updateTorneo/:id", authRequired, updateTorneoRequest)

router.get("/config/getTorneosActivos", authRequired, getTorneosActivosRequest)

export default router;
