## Get started
1. Clone the project 
2. Add your own Google Maps API key to the map script in the following files: <br>
    public >> templates >> **map.html** <br>
    views >> **home.hbs** <br>
    geocode >> **geocode.js** <br>

![Insert gKey](gKey.PNG)

3. From the root folder run: <br> **npm install**
4. From the root folder run: <br> **node server.js**
5. Run program on local host 8080.

A sample map display along with the search details is displayed below.

<br>
Map rendering magnitude 4 and higher earthquakes with epicenter Los Angeles. Search radius is set to 500km and the 
time of observation ranges from June 1, 2018 to Feb 25, 2019. 

![EarthQuakes - Map Display](/screenshots/screenshot.png)

<!-- ![EarthQuakes - Map Display](/screenshots/screenshot_LA.png)

<br>

![EarthQuakes - Search Details](/screenshots/screenshot_LA_details.png) -->
