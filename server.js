import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for MyTarotation',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
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
app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;

// Swagger API Documentation Setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
    const { title = "Fortune Teller", nav = false, fortuneTellerImg = 'default', useVideoBackground = false } = options;

    const backgroundStyle = useVideoBackground
    ?
     `<video autoplay muted loop class="fixed top-0 left-0 w-full h-full object-cover z-[-1]">
       <source src="/backgroundImages/tent_video.mp4" type="video/mp4" />
       Your browser does not support the video tag.
     </video>`
     : `<div class="fixed top-0 left-0 w-full h-full bg-[url('/backgroundImages/static-bg.png')] bg-no-repeat bg-center bg-cover z-[-1]"></div>`;

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
       
  <script>
    const fortuneTellerImg = 'default'; // Adjust as needed
  </script>
</head>


<body class="relative w-screen h-screen flex flex-col items-center m-0 p-0 overflow-auto mb-10">
${backgroundStyle}
  ${nav ? `
  <nav class="w-full flex items-center fixed top-0 left-0 h-16 px-4">
    <a href="/" onclick="sessionStorage.setItem('homeClicked', 'true')" class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700
         border border-yellow-300 text-yellow-100 
         px-8 py-3 rounded-lg text-lg font-semibold 
         shadow-md">Home</a>
  </nav>` : ""}

  <!-- Fortune Teller Section -->
  <div class="relative flex flex-col items-center justify-center bg-[#6b5124] rounded-lg p-4 md:p-8 lg:p-12" style="width: calc(100px + 30vw); height: calc(150px + 30vh); max-width: 700px; min-width: 350px; margin-top: 8rem; margin-bottom: 2rem;">
    <!-- Left Booth Side -->
    <div class="absolute left-0 top-0 h-full w-fit flex items-center justify-center">
      <img src="/FortuneTellerImages/pngs/booth-side-l.png" class="h-full max-h-[90vh] md:max-h-[95vh]" alt="Left Booth Side" />
    </div>

    <!-- Fortune Teller Image -->
    <div class="w-full max-w-[100px] md:max-w-[150px] border-4 border-solid border-black rounded-lg">
      <img src="/FortuneTellerImages/gifs/CR-${fortuneTellerImg}.gif" alt="Fortune Teller" id="fortuneteller-img" class="w-full h-auto" />
    </div>

    <!-- Right Booth Side -->
    <div class="absolute right-0 top-0 h-full w-fit flex items-center justify-center">
      <img src="/FortuneTellerImages/pngs/booth-side-r.png" class="h-full max-h-[90vh] md:max-h-[95vh]" alt="Right Booth Side" />
    </div>
  </div>

  <!-- Content Section Below Booth -->
<div class="flex flex-col items-center justify-start bg-[#6b5124] border-l-4 border-r-4 border-yellow-300 shadow-xl rounded-lg p-6 md:p-8 lg:p-12 " style="width: calc(100px + 30vw); max-width: 700px; min-width: 50px;">    ${content}
  </div>
</body>

      `;

    res.send(html);
  };
  next();
});


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

