import { Router } from "express";

import { authRequired } from "../../middlewares/validateToken.js";

//controllers
import {
  createLiveRequest,
  getPartidosLive,
  getTotalStreemRequest,
  getStreemDateRequest
} from "../../controllers/config/live.js";

const router = Router();

router.post("/config/liveStatic", authRequired, createLiveRequest);

//router.get("/config/getLiveStatic", getPartidosLive);

router.get("/config/getTotalStreem", getTotalStreemRequest);

router.get("/config/getStreemsForDate/:date", getStreemDateRequest)

export default router;
