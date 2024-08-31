import { Router } from "express";

import { authRequired } from "../../middlewares/validateToken.js";

//controllers
import {
  getTipoCampeonatoRequest,
  getTipoDeporteRequest,
  createNewCampeonatoRequest,
  searchCampeonatosRequest,
  getTorneoRequest,
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

export default router;
