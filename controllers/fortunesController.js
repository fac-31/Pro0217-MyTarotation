import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const Recommendations = z.object({
    book: z.string(),
    movie: z.string(),
    album: z.string(),
});

const RecommendationSet = z.object({
    sad: Recommendations,
    angry: Recommendations,
    happy: Recommendations,
});

const getFortune = async (req,res) => {
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are recommending new media for a user related to what they like. You should recommend one book, one movie, and one album."},
            { role: "user", content: "My dad once taught me to skate and now he's gone and I miss him. It's not like he's dead or anything he just dowsn't want to be around me I guess."}
        ],
        response_format: zodResponseFormat(Recommendations,"recommendations"),
    });

    const recommendations = completion.choices[0].message.parsed;

    console.log(recommendations);
    res.send(recommendations);
}

export { getFortune }