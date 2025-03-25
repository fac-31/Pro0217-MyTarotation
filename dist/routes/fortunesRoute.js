var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
const router = express.Router();
// Import functions from controller
import { getHomePage } from "../controllers/homeController.js";
import { getNewFortunePage, postNewFortune, getRandomFortune, } from "../controllers/fortuneController.js";
import { getMoodPage, getMoodFortune, } from "../controllers/moodController.js";
import { testRecs } from "../controllers/testController.js";
import { handleRecommendations } from '../apis/openAiApi.js';
import { retrieveUnique, saveFortune } from '../storage.js';
// Define different routes
router.get("/", getHomePage);
router.get("/new", getNewFortunePage);
router.post("/new", postNewFortune);
router.get("/mood/:mood?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.mood || req.query.mood) {
        yield getMoodFortune(req, res);
    }
    else {
        yield getMoodPage(req, res);
    }
}));
router.get("/random", getRandomFortune);
//router.post("/run-api", runAPI);
router.get("/test", testRecs);
router.get('/get-user/:_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const userData = yield retrieveUnique(_id);
    if (!userData) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(userData);
}));
/**
 * @swagger
 * /refresh-data:
 *  post:
 *      description: Refresh non locked recommendations
 *      responses:
 *          200:
 *              description: Returns new Recommendations
 *              content:
 *                  application/json:
 *                      schema:
 *                           type: object
 *                           properties:
 *                              books:
 *                                  type: object[]
 *                                  description: Book Recommendations
 *                                  example: ['Harry Potter']
 *                              movies:
 *                                  type: object[]
 *                                  description: Movie Recommendations
 *                                  example: ['Harry Potter']
 *
 */
router.post("/refresh-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { types, titles } = req.body;
        console.log(types, titles);
        if (!types || !titles) {
            return res.status(400).json({ error: "No types or titles" });
        }
        ;
        const recommendations = yield handleRecommendations(null, null, titles, types);
        res.json({ recommendations });
    }
    catch (error) {
        console.error('Error in refreshing data:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post('/save-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ error: "Missing UUID or data" });
    }
    yield saveFortune(data);
    console.log("This is what you are trying to save - ", data);
    res.json({ message: "User data saved successfully - ", data });
}));
// Export router
export { router };
