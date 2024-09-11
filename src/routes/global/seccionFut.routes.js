import { Router } from "express";
//controllers
import { getElementFutbolRequest, getElementMediaFutbolByTorneoRequest, getTotalEncuentrosFutRequest } from '../../controllers/global/seccionFut.js'

const router = Router();

router.get("/media/getElementMediaFutbol",  getElementFutbolRequest)

router.get("/media/getTotalMediaFutbol", getTotalEncuentrosFutRequest);

router.get("/media/getElementMediaFutbolByTorneo/:idTorneo", getElementMediaFutbolByTorneoRequest )

export default router
