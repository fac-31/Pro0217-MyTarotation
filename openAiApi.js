export async function getRecommendation(client, z, zodResponseFormat) {

    // test input. Will eventually be user input
    const input = `I am 29 years old. I'm currently quite melancholic. 
    In other news I have recently watched Hannibal with Mads Mikkelsen & Zone of Interest. I recently read Game of Thrones while
    listening to The Gaslight Anthem.
`;

// Zod object for visual media.
const visualMedia = z.object({
    director: z.string(),
    title: z.string()
});

// Zod object for written media.
const writtenMedia = z.object({
    author: z.string(),
    title: z.string(),
    isbnCode: z.string()
});

// Zod object for musical media.
const musicMedia = z.object({
    artist: z.string(),
    album: z.string()
})

// Array of moods to match against. The ai will match user input to the closest match in this list. 
const moods = ["Happy", "Sad", "Angry", "Chilled", "Reflective", "Fearful", "Disgusted"]

/* The full schema made up of the of the objects / arrays above. The string & number methods are hopefully fairly obvious. The #
z.array(z.string()) = an array of strings. You could also have an array of numbers etc. The recommendation props are arrays of 
objects following the pattern defined above. z.enum(moods) means the result has to match one of the elements of the array given
to enum*/
const recommendSchema = z.object({
  age: z.number(),
  mood: z.enum(moods),
  filmRecommendations: z.array(visualMedia),
  tvRecommedations: z.array(visualMedia),
  bookRecommendations: z.array(writtenMedia),
  musicRecommendations: z.array(musicMedia),
  genres: z.array(z.string())
});

let response = await client.chat.completions.create({
    model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are an expert media critic. You will recommend 1 item each for the following categories - films, tv shows, books  & music. The recommendations should be based on their input with the recommendations being similar genres, directors or vibe to what they input. You will not recommend a film, show or book they have mentioned. Please match their mood to one of those allowed in the JSON Schema."
            },
            {
                role: "user",
                content: input
            },
        ],
        // Use the zodresponseformat & pass it the final schema with a title. Makes the ai use this format. 
        response_format: zodResponseFormat(recommendSchema, "recommendations")
    });
    return JSON.parse(response.choices[0].message.content);
};