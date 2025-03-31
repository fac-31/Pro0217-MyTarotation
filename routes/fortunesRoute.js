import express from "express";

const router = express.Router();

// Import functions from controller
import { getHomePage } from "../controllers/homeController.js";
import {
  getNewFortunePage,
  getRandomFortune,
  postNewFortune,
} from "../controllers/fortuneController.js";
import { getMoodFortune, getMoodPage } from "../controllers/moodController.js";
import { testRecs } from "../controllers/testController.js";

import { handleRecommendations } from "../apis/openAiApi.js";

import { retrieveUnique, saveFortune } from "../storage.js";

// Define different routes
router.get("/", getHomePage);
router.get("/new", getNewFortunePage);
router.post("/new", postNewFortune);
router.get("/mood/:mood?", async (req, res) => {
  if (req.params.mood || req.query.mood) {
    await getMoodFortune(req, res);
  } else {
    await getMoodPage(req, res);
  }
});
router.get("/random", getRandomFortune);
//router.post("/run-api", runAPI);
router.get("/test", testRecs);
router.get("/get-user/:_id", async (req, res) => {
  const { _id } = req.params;
  const userData = await retrieveUnique(_id);

  if (!userData) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(userData);
});
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
 */
router.post("/refresh-data", async (req, res) => {
  try {
    const { types, titles } = req.body;
    console.log(types, titles);
    if (!types || !titles) {
      return res.status(400).json({ error: "No types or titles" });
    }
    const recommendations = await handleRecommendations(
      null,
      null,
      titles,
      types,
    );
    res.json({ recommendations });
  } catch (error) {
    console.error("Error in refreshing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/save-user", async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).json({ error: "Missing UUID or data" });
  }

  //await saveFortune(data);
  console.log("This is what you are trying to save - ", data);
  res.json({ message: "User data saved successfully - ", data });
});

// Export router
export { router };
