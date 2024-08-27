import { Router } from "express";

//controllers
import { getMommentsTopequest } from "../../controllers/config/momments.js"

const router = Router() 

router.get("/config/getMommentsTop", getMommentsTopequest )

export default router