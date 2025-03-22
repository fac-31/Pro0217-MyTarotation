  # 🔮 MyTarotation
  ### Made with ❤️ and a touch of capybara magic 🦫✨

  A whimsical application that combines the mystical art of tarot reading with personalized media recommendations.

  ## Features ✨

  - **Personalized Fortune Telling**: Share your age, birth month or starsign, and recent media consumption for a unique reading
  - **Smart Recommendations**: Each reading provides carefully curated suggestions for:
    -  Books 📚
    -  Movies 🎬 
    -  Music Albums 🎵
  - **Speed Readings**: Bypass our form and a fortune from local storage will be displayed
    - Express Fortune - randomly chosen fortune 
    - Pre-Coffee Fortune - choose a pre-defined mood
    - Everyone's feeling 'X' today - the most common mood.

  ## Design Decisions 💡 

We intentionally built this app with constraints — no middleware and no database — to better understand the core of Node.js and Express.

- Local Persistence with node-persist 🗂️
  - By storing fortunes directly on the server, we increased the chances of matching a mood to a fortune and reduced the likelihood of errors on key routes.

- Custom HTML Rendering Without a Templating Engine 🛠️
  - We recreated basic React-like rendering using a custom renderWithLayout function.
  - Instead of relying on engines like EJS or Handlebars, we wrapped our dynamic content in a reusable HTML layout using pure template literals.
  - This gave us full control over styling, structure, and animations — including dynamic backgrounds, navigation bars, and tarot booth visuals — all handled server-side

##  Tech Stack 🛠️

- **Backend**: Node.js with Express
- **APIs Integration**:
  - OpenAI API for intelligent recommendations
  - OpenLibrary API for book details
  - OMDB API for movie information
  - MusicBrainz API for music data
- **Data Persistence**: node-persist for local storage
- **Styling**: Tailwind CSS
- **Testing**: Cypress
- **API Documentation**: Swagger

## Getting Started 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Pro0217-MyTarotation.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
API_KEY=your_openai_api_key
MOVIE_API_KEY=your_omdb_api_key
```

4. Start the server:
```bash
npm run dev
```