import { Router } from "express";

import { authRequired } from '../../middlewares/validateToken.js'

//controllers
import { createLiveRequest, getPartidosLive } from "../../controllers/config/live.js"

const router = Router();

router.post("/config/liveStatic", authRequired, createLiveRequest);

router.get("/config/getLiveStatic", getPartidosLive)

export default router
