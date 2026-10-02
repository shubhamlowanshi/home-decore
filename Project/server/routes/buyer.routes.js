import express from "express";

import {findBuyers,getBuyers,} from "../controllers/buyer.controller.js";

const router = express.Router();

router.post( "/find", findBuyers);

router.get("/",getBuyers);

export default router; 