import express from "express";
import { migrateSubmissionsToUsers,autoCreateCommonSection } from "../controller/migration.controller.js";

const Adminrouter = express.Router();

// PROTECT THIS ROUTE! (Use your verifyJWT or Admin middleware)
Adminrouter.post("/run-migration", migrateSubmissionsToUsers);
Adminrouter.post("/create-combined-section", autoCreateCommonSection);



export default Adminrouter;
