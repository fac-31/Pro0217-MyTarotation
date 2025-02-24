import express from 'express';
import bodyParser from 'body-parser';

const router = express.Router()

// Import functions from controller
import { 
    getHomePage,
    getNewFortunePage,
    postNewFortune,
    getMoodPage,
    getMoodFortune,
    getRandomFortune,
    runAPI
 } from '../controllers/fortunesController.js';

// Define different routes
router.get("/", getHomePage);
router.get("/new", getNewFortunePage);
router.post("/new", postNewFortune);
router.get("/mood/:mood?", async (req,res) => {
    console.log("---------------")
    console.log("PARAMS: " + req.params.mood)
    console.log("QUERY: " + req.query.mood)
    if (req.params.mood || req.query.mood) {
        await getMoodFortune(req,res);
    } else {
        await getMoodPage(req,res);
    }
});
router.get("/random", getRandomFortune);
router.get("/run-api", runAPI);

// Export router
export { router }