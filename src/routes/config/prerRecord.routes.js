import { Router } from "express";
//controllers
import { getRecordedRequest } from '../../controllers/config/recorded.js'

const router = Router();

router.get("/config/getRecord/:id", getRecordedRequest)

export default router;
