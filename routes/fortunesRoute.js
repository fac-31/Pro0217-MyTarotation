import express from 'express';

const router = express.Router()

// Import functions from controller
import { 
    getHomePage,
    getNewFortunePage,
    postNewFortune,
    getMoodPage,
    getMoodFortune,
    getRandomFortune
 } from '../controllers/fortunesController.js';

// Define different routes
router.get("/", getHomePage);
router.get("/new", getNewFortunePage);
router.post("/new", postNewFortune);
router.get("/mood/:mood?", async (req,res) => {
    if (req.params.mood) {
        await getMoodFortune(req,res);
    } else {
        await getMoodPage(req,res);
    }
});
router.get("/random", getRandomFortune);

// Export router
export { router }