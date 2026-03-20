import express from "express";
import { migrateSubmissionsToUsers,autoCreateCommonSection } from "../controller/migration.controller.js";

const router = express.Router();

// PROTECT THIS ROUTE! (Use your verifyJWT or Admin middleware)
router.post("/run-migration", migrateSubmissionsToUsers);
router.post("/create-combined-section", autoCreateCommonSection);



export default router;