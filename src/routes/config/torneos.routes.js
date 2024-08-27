import { Router } from "express";

import { authRequired } from "../../middlewares/validateToken.js";

//controllers
import {
  getTipoCampeonatoRequest,
  getTipoDeporteRequest,
  createNewCampeonatoRequest,
  searchCampeonatosRequest,
} from "../../controllers/config/torneos.js";

const router = Router();

router.get("/config/getTipoCampeonato", authRequired, getTipoCampeonatoRequest);

router.get("/config/getTipoDeporte", authRequired, getTipoDeporteRequest);

router.post(
  "/config/createNewTorneo",
  authRequired,
  createNewCampeonatoRequest
);

router.get("/confg/searchTorneos", authRequired, searchCampeonatosRequest);

export default router;
