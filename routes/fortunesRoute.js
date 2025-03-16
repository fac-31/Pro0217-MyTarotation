import express from 'express';

const router = express.Router()

// Import functions from controller
import { 
    getHomePage,
    getNewFortunePage,
    postNewFortune,
    getMoodPage,
    getMoodFortune,
    getRandomFortune,
    testRecs
 } from '../controllers/fortunesController.js';
 import { handleRecommendations } from '../apis/openAiApi.js';

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
router.post("/refresh-data", async (req, res) => {
    try {
        const {types, titles} = req.body;
        console.log(types, titles)
        if (!types || !titles) {
            return res.status(400).json({ error: "No types or titles" })
        };
        const recommendations = await handleRecommendations(null, null, titles, types);
        res.json({ recommendations });

    } catch (error) {
        console.error('Error in refreshing data:', error);
        res.status(500).json({ error: "Internal server error" })
    }
})

// Export router
export { router }