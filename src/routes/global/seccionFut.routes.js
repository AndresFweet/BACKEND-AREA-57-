import { Router } from "express";
//controllers
import { getElementFutbolRequest } from '../../controllers/global/seccionFut.js'

const router = Router();

router.get("/media/getElementMediaFutbol",  getElementFutbolRequest)

export default router
