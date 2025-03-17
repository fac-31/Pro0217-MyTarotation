import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
// import browserSync from "browser-sync"; 

// const bs = browserSync.create();
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
import { randomImage } from "./utils/randomImage.js";

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
      transform: scale(1) translateY(0px) translateX(0px)  rotate(360deg);
      opacity: 1;
    }
  }
  .animate-deal {
    transform-origin: center;
    animation: dealCard 2s ease-out 1s forwards;
  }
    }
  #card-wrapper1:hover #card-inner {
    transform: rotateY(180deg); 
  }

  #card-inner {
    transform-style: preserve-3d; 
    transition: transform 2s ease; 
  }

  #card-front, #card-back {
    backface-visibility: hidden;

  }

  #card-back {
    transform: rotateY(180deg);
  }
      </style>
        </head>
      
          <body class=" relative w-screen h-screen flex justify-center m-0 p-0 bg-[#3a0305]">
            <video autoplay muted loop class="fixed top-0 left-0 w-full h-full object-cover z-[-1]">
            <source src="/backgroundImages/tent_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
            </video>

            ${nav ? `
            <nav class="w-full flex items-center fixed top-0 left-0 h-16 px-4">
                <a href="/" class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700
                     border border-yellow-300 text-yellow-100 
                     px-8 py-3 rounded-lg text-lg font-semibold 
                     shadow-md">Home</a>
            </nav>` : ""}
            <div class="relative flex flex-col items-center justify-center w-full h-screen max-w-[700px] bg-[#6b5124] rounded-lg p-4 md:p-8 lg:p-12">
                 <div class="absolute left-0 top-0 h-full w-[10vw] flex items-center justify-center">
                    <img src="/FortuneTellerImages/pngs/booth-side-l.png" class="h-full max-h-[90vh] md:max-h-[95vh]">
                </div>
                <div class="flex flex-col items-center w-full h-full max-w-lg">
                    <div class="w-full max-w-[100px] md:max-w-[150px] items-center justify-center border-4 border-solid border-black rounded-lg">
                        <img src="/FortuneTellerImages/gifs/CR-${fortuneTellerImg}.gif" alt="" id="fortuneteller-img" class="w-full h-auto">
                    </div>
                    <div class="flex flex-col items-center justify-start h-full w-full">
                        ${content}
                    </div>
                </div>
                 <div class="absolute right-0 top-0 h-full w-[10vw] flex items-center justify-center">
                    <img src="/FortuneTellerImages/pngs/booth-side-r.png" class="h-full max-h-[90vh] md:max-h-[95vh]">
                </div>
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

// bs.init({
//   proxy: `http://localhost:${PORT}`,
//   files: ['public/*/.*'], // Watch for changes in the 'public' folder
//   reloadDelay: 50,
// });