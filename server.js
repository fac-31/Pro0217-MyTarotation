import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

/* Imported here as an example as what happens when the functions are called. 
You would normally call it in the routes folder to access data from the api endpoints. I think it can also be imported into
the controllers. */ 
import { saveMoods, retrieveItem, clear } from "./storage.js";
/*
saveMoods("happy");
retrieveItem("moods").then(data => (data))
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
    const { title = "Fortune Teller", nav = false, fortuneTellerImg = 'default' } = options;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>${title}</title>
              <style type="text/tailwindcss">
              @tailwind base;
@tailwind components;
@tailwind utilities;

        @layer utilities {
            @keyframes typewriter {
                from { width: 0; }
                to { width: 100%; }
            };
            .animate-typewriter {
                display: inline-block; 
                overflow: hidden;
                white-space: nowrap;
                animation: typewriter 1.5s steps(20) 0.5s 1 normal both;
            };
@keyframes dealCard {
  from {
    transform: scale(0.2) translateY(-700px) translateX(0px) rotate(-360deg);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0px) translateX(400px)  rotate(360deg);
    opacity: 1;
  }
}
.animate-deal {
  transform-origin: center;
  animation: dealCard 2s ease-out 1s forwards;
}
  }
#card-wrapper1:hover #card-inner {
  transform: rotateY(180deg); /* Flips the card */
}

#card-inner {
  transform-style: preserve-3d;  /* Enable 3D transformations */
  transition: transform 2s ease; 
}

/* Prevents the back of the card from showing when flipped */
#card-front, #card-back {
  backface-visibility: hidden;

}
/* Initially, the back of the card is hidden, flipped 180 degrees */
#card-back {
  transform: rotateY(180deg);
}
    </style>
      </head>
      <body class="w-screen h-screen bg-gray-100 flex flex-col m-0 p-0">
          ${nav ? `
          <nav class="w-full flex items-center fixed top-0 left-0 h-16 px-4">
              <a href="/" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Home</a>
          </nav>` : ""}
          <div class="flex flex-col items-center mt-20">
         
              <div class="w-60 h-fit flex items-center justify-center rounded-lg">
                  <img src="/FortuneTellerImages/gifs/CR-${fortuneTellerImg}.gif" alt="" id="fortuneteller-img">
              </div>
          </div>
          <div class="flex flex-col items-center justify-start h-full w-full">
              ${content}
          </div>

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

