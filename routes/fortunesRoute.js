import express from 'express';
import bodyParser from 'body-parser';
import { retrieveItem } from '../storage.js';
const router = express.Router()

// Import functions from controller
import { 
    getHomePage,
    getNewFortunePage,
    postNewFortune,
    getMoodPage,
    getMoodFortune,
    getRandomFortune,
    runAPI,
    getRecommendPage
 } from '../controllers/fortunesController.js';

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
router.get("/recommend", getRecommendPage);
router.get("/run-api", runAPI);
router.get("/api/result", async (req, res) => {
    const { id } = req.query;
    const result = await retrieveItem(id);

    if (!result) {
        return res.status(404).json({ error: "Not found" });
    }

    res.json(result);
});
// Export router
export { router }