import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

/* Imported here as an example as what happens when the functions are called. 
You would normally call it in the routes folder to access data from the api endpoints. I think it can also be imported into
the controllers. */ 
import { saveMoods, retrieveItem, saveUser, clear } from "./storage.js";
/*
saveMoods("happy");
retrieveItem("moods").then(data => console.log(data))
*/
// App and PORT Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
              <a href="/fortunes" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Home</a>
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

app.use(express.json());
app.use(express.static("public"));

// Use Routers
app.use("/", fortuneRouter);

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
