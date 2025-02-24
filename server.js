import express from "express";
import "dotenv/config";

// App and PORT Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Import Routers
import { router as fortuneRouter } from "./routes/fortunesRoute.js";

// Import Other Functions
import { randomImage } from "./randomImage.js";

// Middleware for shared layout
app.use((req, res, next) => {
  res.renderWithLayout = (content, options = {}) => {
    const { title = "Fortune Teller", nav = false } = options;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>${title}</title>
          
      </head>
      <body class="w-screen h-screen bg-gray-100 flex flex-col m-0 p-0">
          ${nav ? `
          <nav class="w-full bg-white shadow-md flex items-center fixed top-0 left-0 h-16 px-4">
              <a href="/" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Home</a>
          </nav>` : ""}

          <div class="flex flex-col items-center justify-center h-full w-full mt-20">
              ${content}
          </div>

          <script src="/script.js"></script>
      </body>
      </html>
    `;

    res.send(html);
  };
  next();
});

// Set up Middleware
app.use(express.json());
app.use(express.static("public"));

// Use Routers
app.use("/fortunes", fortuneRouter);

// Routes Using Shared Layout
app.get("/", (req, res) => {
  res.renderWithLayout(`
      <div class="relative flex flex-col items-center">
          <div class="w-40 h-40 flex items-center justify-center border-4 border-red-500 rounded-lg">
              <img src="" alt="" id="fortuneteller-img">
          </div>
          <div class="absolute top-0 right-[-50px] bg-white border border-red-500 rounded-full px-4 py-2">
              <p class="text-red-500 text-sm">What do you want to know?</p>
          </div>
      </div>
      <div class="grid grid-cols-2 gap-6 mt-10">
          <button class="border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg">New Fortune</button>
          <button class="border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg">Random</button>
          <button class="border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg">Mood</button>
          <button class="border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg">(Common Mood)</button>
      </div>
  `, { title: "Fortune Teller Home" });
});

app.get("/mood", (req, res) => {
  res.renderWithLayout(`
      <div class="relative flex flex-col items-center">
          <div class="w-40 h-40 flex items-center justify-center border-4 border-red-500 rounded-lg">
              <img src="" alt="" id="fortuneteller-img">
          </div>
          <div class="absolute top-0 right-[-50px] bg-white border border-red-500 rounded-full px-4 py-2">
              <p class="text-red-500 text-sm">How are you feeling?</p>
          </div>
      </div>
      <div class="flex flex-col items-center mt-6">
          <label for="mood" class="text-black mb-2">Mood</label>
          <input type="text" id="mood" name="mood" class="border border-black px-4 py-2 rounded-md">
      </div>
      <button class="border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg mt-6">Get Fortune</button>
  `, { title: "Fortune Teller - Mood", nav: true });
});

app.get("/about", (req, res) => {
  res.renderWithLayout(`
      <div class="relative flex flex-col items-center">
          <div class="w-40 h-40 flex items-center justify-center border-4 border-red-500 rounded-lg">
              <img src="" alt="" id="fortuneteller-img">
          </div>
          <div class="absolute top-0 right-[-50px] bg-white border border-red-500 rounded-full px-4 py-2">
              <p class="text-red-500 text-sm">Tell me about yourself</p>
          </div>
      </div>
      <div class="grid grid-cols-3 gap-6 mt-6 w-3/4 max-w-2xl">
          <div class="flex flex-col">
              <label class="font-semibold">Name</label>
              <input type="text" class="border border-gray-400 p-2 rounded w-full">
          </div>
          <div class="flex flex-col">
              <label class="font-semibold">Date of Birth</label>
              <input type="text" class="border border-gray-400 p-2 rounded w-full">
          </div>
          <div class="flex flex-col">
              <label class="font-semibold">Mood</label>
              <input type="text" class="border border-gray-400 p-2 rounded w-full">
          </div>
      </div>
      <div class="mt-6 w-3/4 max-w-2xl">
          <label class="block font-semibold">Interests</label>
          <textarea class="w-full border border-gray-400 p-3 rounded h-24"></textarea>
      </div>
      <div class="mt-6">
          <button class="border border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg">See my future</button>
      </div>
  `, { title: "Fortune Teller - About You", nav: true });
});

// API Route for Getting Image
app.get("/get-image", async (req, res) => {
  const imageUrl = await randomImage();
  if (imageUrl) {
    res.json({ imageUrl });
  } else {
    res.status(404).json({ error: "No image found" });
  }
});

// Run HTTP Server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
