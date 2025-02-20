import express from 'express';

const router = express.Router()

import { getFortune } from '../controllers/fortunesController.js';

router.get("/new", getFortune);

export { router }