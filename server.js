// *********************************************************************** //
// IMPLEMENTING AJAX JSON 
// *********************************************************************** //
// *********************************************************************** //
// Importing required modules
// *********************************************************************** //
const request = require("request");
const express = require("express");
const path = require('path');
const geocode = require('./geocode/geocode.js');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 8080;

// *********************************************************************** //
// Location Info
// *********************************************************************** //
const locationRect = ["minlatitude", "minlongitude", "maxlatitude", "maxlongitude"];
const locationCircle = ["latitude", "longitude", "maxradius", "maxradiuskm"];

// *********************************************************************** //
// Creating the server
// *********************************************************************** //
const app = express();
app.use( express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


// *********************************************************************** //
// Routing
// *********************************************************************** //
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/home.html')));

app.post("/data", function(req, res){
    console.log("You requested: " + req.url);
    var data = req.body;
    console.log(data);
    
    var userAddress = data.address; 
    var startTime = data.starttime;
    var endTime = data.endtime;
    var maxRad = data.maxradiuskm;
    var minMag = data.minmagnitude;
    var limit = "50";   
    
    geocode.geocodeAddress(userAddress, function(err1, arrayLatLong){
        if(err1){
            console.log("Could not retrieve the address." + err1.message);
        } else {     
            var latCenter = arrayLatLong[0];
            var lngCenter = arrayLatLong[1];    

            var quakeQuery = `starttime=${startTime}&endtime=${endTime}&limit=${limit}&latitude=${latCenter}&longitude=${lngCenter}&maxradiuskm=${maxRad}&minmagnitude=${minMag}`;
            var quakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&`+ quakeQuery;
        
        getJSONdata(quakeUrl, function(err2, body){
            if(err2){
                console.log("Incorrect URL: " + err2.message);
            } else {       
                //var coords = (getQuakesCoords(body)     
                console.log("quakes: ", body);
                getQuakesCoords(body, function(c){
                    res.json({c:c, latCenter:latCenter, lngCenter: lngCenter});
                }); 

                };      // end of get Json else
            });         // end of get Json
        };              // end of Geocode else
    });                 // end of Geocode 
});                     // end of POST 

// *********************************************************************** //
// Defining Functions
// *********************************************************************** //

function getJSONdata(url, callback){
        request(url, {encoding: null}, function(err, res, body){
            if(err){
                callback(err, null);
            } else {
                var content =  body.toString("utf8");
                callback(null, content);
            }
    });   
}

function getQuakesCoords(jsonBody, callback){
        var quakes = JSON.parse(jsonBody).features;
        if(quakes.length == 0) {
            //return "";
            coords = "";
            callback(coords);
        } else {
            var quakesCoords = [];
            quakes.forEach(function(quake){
                var obj = new Object;
                obj.lat = quake.geometry.coordinates[1];
                obj.lng =  quake.geometry.coordinates[0];
                obj.place = quake.properties.place;
                obj.mag = quake.properties.mag;
                quakesCoords.push( obj );
            });
            callback(JSON.stringify(quakesCoords));           
        }
}

// *********************************************************************** //
// Server Listening
// *********************************************************************** //

    app.listen(port, () => {
        console.log("Server is up on port 8080.");
    });

// *********************************************************************** //
// End of File
// *********************************************************************** //
