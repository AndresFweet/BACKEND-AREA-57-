import { Router } from "express";

import { getElementMediaSportRequest } from '../../controllers/global/soports.js'

const router = Router();

router.get("/media/getElementMediaSports", getElementMediaSportRequest);

export default router;
