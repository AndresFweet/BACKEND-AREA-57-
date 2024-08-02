//llamado del enrutador global
import { Router } from "express";

import { authRequired } from '../../middlewares/validateToken.js'

import { createNewRequest, getNewsRandom, gwtNewsRecents, getNewRequest   

 } from "../../controllers/config/news.js"

const router = Router();

router.post("/config/createNew", authRequired, createNewRequest);

router.get("/config/getNewsRandom", getNewsRandom)

router.get("/config/getNewsRecents", gwtNewsRecents)

router.get("/config/getNew/:id", getNewRequest)

export default router;
