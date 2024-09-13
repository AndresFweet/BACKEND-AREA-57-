import { Router } from "express";
//controllers
import {
  getElementFutbolRequest,
  getElementMediaFutbolByTorneoRequest,
  getTotalEncuentrosFutRequest,
  getElementMediaFutbolByJornadaRequest,
} from "../../controllers/global/seccionFut.js";

const router = Router();

router.get("/media/getElementMediaFutbol", getElementFutbolRequest);

router.get("/media/getTotalMediaFutbol", getTotalEncuentrosFutRequest);

router.get(
  "/media/getElementMediaFutbolByTorneo/:idTorneo",
  getElementMediaFutbolByTorneoRequest
);

router.get(
  "/media/getElementMediaFutbolByJornada/:idTorneo/:idJornada",
  getElementMediaFutbolByJornadaRequest
);

export default router;
