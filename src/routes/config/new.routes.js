//llamado del enrutador global
import { Router } from "express";

import { authRequired } from "../../middlewares/validateToken.js";

import {
  createNewRequest,
  getNewsRandom,
  gwtNewsRecents,
  getNewRequest,
  getTotalNewRequest,
  getNewsDate
} from "../../controllers/config/news.js";

const router = Router();

router.post("/config/createNew", authRequired, createNewRequest);

router.get("/config/getNewsRandom", getNewsRandom);

router.get("/config/getNewsRecents", gwtNewsRecents);

router.get("/config/getNew/:id", getNewRequest);

router.get("/config/getTotalNew", getTotalNewRequest);

router.get("/config/getNewForDate/:date", getNewsDate)


export default router;
