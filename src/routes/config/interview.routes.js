import { Router } from "express";
//controllers
import {
  getInteviewRequest,
  getTotalStreemRequest,
  getInterviewsDateRequest
} from "../../controllers/config/interview.js";

const router = Router();

router.get("/config/getIntrviews", getInteviewRequest);

router.get("/config/getTotalInterview", getTotalStreemRequest);

router.get("/config/getInterviewsForDate/:date", getInterviewsDateRequest)

export default router;
