import express from "express";
import { doctorList } from "../controllers/doctorControllers.js";
import e from "express";

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)

export default doctorRouter