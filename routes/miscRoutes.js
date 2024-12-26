import { Router } from 'express';
import { getStatsData , contactUs} from "../controllers/misc.controller.js";

const router = Router();

router.get("/admin/stats/users", getStatsData);

router.post("/contact", contactUs);




export default router;