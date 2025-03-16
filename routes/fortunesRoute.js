import express from 'express';

const router = express.Router()

// Import functions from controller
import { getHomePage } from "../controllers/homeController.js";
import {
  getNewFortunePage,
  postNewFortune,
  getRandomFortune,
} from "../controllers/fortuneController.js";
import {
  getMoodPage,
  getMoodFortune,
} from "../controllers/moodController.js";
import { testRecs } from "../controllers/testController.js";


// Define different routes
router.get("/", getHomePage);
router.get("/new", getNewFortunePage);
router.post("/new", postNewFortune);
router.get("/mood/:mood?", async (req,res) => {
    if (req.params.mood || req.query.mood) {
        await getMoodFortune(req,res);
    } else {
        await getMoodPage(req,res);
    }
});
router.get("/random", getRandomFortune);
//router.post("/run-api", runAPI);
router.get("/test",testRecs)

// Export router
export { router }