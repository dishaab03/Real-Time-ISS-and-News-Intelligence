# Real-Time ISS & News Intelligence Dashboard 🛰️

Hey there! This is my project for the FOAI End-Semester. I wanted to build something that combined my interest in space exploration with real-time data processing. This dashboard tracks the International Space Station (ISS) live and pulls in the latest space intelligence from across the web.

## 🚀 What this does
I've spent quite a bit of time making sure this is more than just a simple map. Here’s what I managed to pack into it:

*   **Live ISS Tracking**: It pings the satellite every 15 seconds to show exactly where it is. I've also added a red trajectory line to show where it’s been.
*   **Orbital Analytics**: I've included a real-time speed trend chart and stats like altitude and the nearest location on Earth.
*   **Intelligence Feed**: Using the GNews API, I'm pulling in breaking stories about space. There’s a search bar and sorting options to help dig through the news.
*   **AI Mission Assistant**: I built a chatbot that acts as a mission control assistant. It’s restricted to only answer using the dashboard data, so it stays on topic!
*   **Glassmorphism UI**: I went for a premium "Mission Control" look with a beige/cream aesthetic in light mode and a sleek dark mode.

## 🛠️ How I built it
I used **React (Vite)** for the core and **Leaflet.js** for the mapping logic. For the charts, I used **Chart.js** because it’s super flexible. The styling is all **Vanilla CSS**—I didn't want to rely on heavy frameworks for the custom design I had in mind.

## ⚙️ Setup
If you want to run this yourself:
1. Clone the repo.
2. Run `npm install` to get the dependencies.
3. You'll need to set up a `.env` file with your keys for:
    * `VITE_NEWS_API_KEY` (I used GNews)
    * `VITE_HF_API_TOKEN` (For the AI assistant)
4. Launch with `npm run dev` and you're good to go!

---
*Hope you like it! It was a fun challenge to put together.*
