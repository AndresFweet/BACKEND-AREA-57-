import { Router } from "express";

import { authRequired } from "../../middlewares/validateToken.js";

//controllers
import {
  createLiveRequest,
  getStreemDateRequest
} from "../../controllers/config/live.js";

const router = Router();

router.post("/config/liveStatic", authRequired, createLiveRequest);


router.get("/config/getStreemsForDate/:date", getStreemDateRequest)

export default router;
