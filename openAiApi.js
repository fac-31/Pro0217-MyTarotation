export async function getRecommendation(client, z, zodResponseFormat) {

    // test input. Will eventually be user input
    const input = `I was born on 21 February 1995. I'm currently raging beacuse I was in car crash. 
    In other news I have recently watched all creatures great and small, marley & me, Happy Gilmore 
    and I've also read atomic habits.
`;

// Zod object for visual media.
const visualMedia = z.object({
    director: z.string(),
    title: z.string()
});

// Zod object for written media.
const writtenMedia = z.object({
    author: z.string(),
    title: z.string()
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
  birthday: z.string(),
  age: z.number(),
  mood: z.enum(moods),
  filmRecommendations: z.array(visualMedia),
  tvRecommedations: z.array(visualMedia),
  bookRecommendations : z.array(writtenMedia),
  genres: z.array(z.string())
});

let response = await client.chat.completions.create({
    model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are an expert media critic. You will recommend 3 films, 3 tv-shows, 3 books & 3 albums based on the films, tv shows, books & music the user has recently interacted with. The recommendations should be similar genres, directors or feeling to what they input. You will not recommend a film, show or book they have mentioned. Please match their mood to one fo those allowed in the JSON Schema"
            },
            {
                role: "user",
                content: input
            },
        ],
        // Use the zodresponseformat & pass it the final schema with a title. Makes the ai use this format. 
        response_format: zodResponseFormat(recommendSchema, "recommendations")
    });
    /*
    const data = response.choices[0].message.content;

    const result = genreSchema.safeParse(data)
    if (result.success) {
        // If valid, log the validated product data
        console.log("Validated Product:", result.data);
      } else {
        // If invalid, log the error
        console.error("Validation Error:", result.error);
      } */
    return console.log("Returned message", response.choices[0].message.content);
};