import { Router } from "express";
import { authRequired } from "../../middlewares/validateToken.js";

//controllers
import {
  createNewMediaRequest,
  getTipoMediaRequest,
  searchMediaRequest,
  getElementMediaRequest,
  updateElementMediaRequest
} from "../../controllers/global/media.js";

const router = Router();

router.get("/media/getTipoMedia", authRequired, getTipoMediaRequest);

router.post("/media/searchMedia", authRequired, searchMediaRequest);

router.post(
  "/media/createNewMedia",
  authRequired,
  createNewMediaRequest
);

router.get("/media/getElementMedia/:id", authRequired,  getElementMediaRequest)

router.put("/media/updateElementMedia/:id", authRequired, updateElementMediaRequest)

export default router;
