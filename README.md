# Geo Guesser

A web app like GeoGuessr, you just guess random places around the world, built with React + Vite, i used the Google Maps API ( Street View Panorama and Street View Service), the React Leaflet and Leaflet (for the Interactive Guess Map) and CartoDB Voyager Map Tiles (to have English countries/cities' names)

## How to Play
The game is pretty simple actually, you get a random place where you can move around, by going forward, backward, rotating and zooming in and out

When you think you know which place it is, go to the map in the corner to expand it and click on it, then, use the "GUESS" button to submit your answer

A line connecting your guess to the actual location will appear on the map and a popup with your score in the middle of the screen, click the  "Next Round" button to keep playing

## Score and Rounds
* Rounds: The game is infinite, every round dynamically fetches a new random location with coverage, most times it is outdoors but sometimes you get an indoors location
* Score: Points are calculated based on the distance between your guess and the actual location using the Haversine formula

> Haversine formula: the angle in radians multiplied with the earth radius to get the distance; 
<br>
> c = angle between the two locations with the eath's center as the vertex
<br>
> a = the haversine of the angle, i don't really know how to explain how this works, it is the square of the half of a line that connects the two locations going through the center of the earth

* Score per guess: the maximum is 5000 points (within 50 meters), from there, the points decrease exponentially as distance increases, up to 20000 kilometers where the score would be 0


* High Scores: Your max total score is automatically saved in your browser using LocalStorage, the best round gets reseted when reloading so that each game has its own best round

## How to run it locally

### Prerequisites

* Node.js installed
* A Google Maps API key with the Maps JavaScript API enabled.

### Steps

1. Clone or download the repo ( git clone https://github.com/anadeheza/geoguessr.git )
2. Install dependencies with 'npm install'
3. Create a .env file with your API key and call the variable VITE_API_KEY=""
4. Run the development server with 'npm run dev'
5. Open your browser and go to the URL given (probably http://localhost:5173)

> disclaimer: it may not work if the port is not 5173 so i suggest you use that one and no any other port