// *********************************************************************** //
// IMPLEMENTING AJAX JSON 
// *********************************************************************** //
// *********************************************************************** //
// Importing required modules
// *********************************************************************** //
const request = require("request");
const express = require("express");
const hbs = require("hbs");
const geocode = require('./geocode/geocode.js');
var bodyParser = require('body-parser');

// *********************************************************************** //
// Location Info
// *********************************************************************** //
var locationRect = ["minlatitude", "minlongitude", "maxlatitude", "maxlongitude"];
var locationCircle = ["latitude", "longitude", "maxradius", "maxradiuskm"];

// *********************************************************************** //
// Creating the server
// *********************************************************************** //
var app = express();
app.use(express.static("public"));
//app.set("view engine", "hbs"); // 
app.use(bodyParser.json());


// *********************************************************************** //
// Routing
// *********************************************************************** //
app.get("/", function(req, res){
    console.log("You requested: " + req.url);
    res.render("home.hbs");
});

app.post("/data", function(req, res){
    console.log("You requested: " + req.url);
    var data = req.body;
    console.log(data);
    //earthQuakes(jsonData, res);
    
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

    app.listen(8080, () => {
        console.log("Server is up on port 8080.");
    });

// *********************************************************************** //
// End of File
// *********************************************************************** //

// app.get("/home", function(req, res){
//     console.log("You requested: " + req.url);
//     var userAddress = req.query.address;
//     var startTime = req.query.starttime;
//     var endTime = req.query.endtime;
//     var minMag = req.query.minmagnitude;
//     var maxRad = req.query.maxradiuskm;
//     var limit = "100";

//     console.log(userAddress, startTime, endTime, minMag, maxRad);


//     if (userAddress === undefined || userAddress == "") {
//         userAddress = "San Francisco";
//     }   
//     if (startTime === undefined || startTime == "") {
//         startTime =  "2018-01-01";
//     }   
//     if (endTime === undefined || endTime == "") {
//         endTime =  "2018-04-30";
//     }  
//     if (minMag === undefined || minMag == "") {
//         minMag =  "3";
//     }   
//     if (maxRad === undefined || maxRad == "") {
//         maxRad =  "500";
//     }     

//     console.log("The variables are: ");
//     console.log(userAddress, startTime, endTime, minMag, maxRad);

//     geocode.geocodeAddress(userAddress, function(err1, arrayLatLong){
//         if(err1){
//             console.log("Could not retrieve the address." + err1.message);


//         } else {     
//         var latCenter = arrayLatLong[0];
//         var lngCenter = arrayLatLong[1];
    
//         var quakeQuery = `starttime=${startTime}&endtime=${endTime}&limit=${limit}&latitude=${latCenter}&longitude=${lngCenter}&maxradiuskm=${maxRad}&minmagnitude=${minMag}`;
//         var quakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&`+ quakeQuery;
    

//         getJSONdata(quakeUrl, function(err2, body){
//             if(err2){
//                 console.log("Incorrect URL: " + err2.message);
//             } else {                
//                 var coords = (getQuakesCoords(body)); 
//                 var coordsL = coords.length;
//                 var cVar = "";
//                 if( coordsL == 0){
//                     cVar = JSON.stringify( [{lat: latCenter, lng: lngCenter }] );
//                 } else {
//                     cVar = coords;
//                 }
//                 res.render("home2.hbs", {
//                     startDate: startTime,
//                     endDate: endTime, 
//                     latCenter: latCenter,           //Cannot do any differently than individually call lat and lng 
//                     lngCenter: lngCenter,
//                     c: cVar,
//                     cL: coordsL,
//                     m: minMag, 
//                     maxr: maxRad
//                 });

                
//             };  //end of get Json else
//             }); // end of get Json
//         };       // end of Geocode else

//     });         // end of Geocode
   
    

// }); // end of GET /home request 


// var stime = "2014-01-01";
// var etime = "2014-01-03";
// var minmag = "3";
// var limit = "10";
// var maxrad = 500;
// var stime = argv.st;
// var etime = argv.et;
// var minmag = argv.minM;
// var limit = "10";
// var maxrad = argv.maxRkm;




// function earthQuakes(data, response){
//         var userAddress = data.address; 
//         var startTime = data.starttime;
//         var endTime = data.endtime;
//         var maxRad = data.maxradiuskm;
//         var minMag = data.minmagnitude;
//         var limit = "50";   
        
//         geocode.geocodeAddress(userAddress, function(err1, arrayLatLong){
//             if(err1){
//                 console.log("Could not retrieve the address." + err1.message);
//             } else {     
//                 var latCenter = arrayLatLong[0];
//                 var lngCenter = arrayLatLong[1];    
    
//                 var quakeQuery = `starttime=${startTime}&endtime=${endTime}&limit=${limit}&latitude=${latCenter}&longitude=${lngCenter}&maxradiuskm=${maxRad}&minmagnitude=${minMag}`;
//                 var quakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&`+ quakeQuery;
            
//             getJSONdata(quakeUrl, function(err2, body){
//                 if(err2){
//                     console.log("Incorrect URL: " + err2.message);
//                 } else {                
//                     var coords = (getQuakesCoords(body)); 
//                     var coordsL = coords.length;
//                     var cVar = "";
//                     if( coordsL == 0){
//                         cVar = JSON.stringify( [{lat: latCenter, lng: lngCenter }] );
//                     } else {
//                         cVar = coords;
//                     }
//                     response.render("home2.hbs", {
//                         startDate: startTime,
//                         endDate: endTime, 
//                         latCenter: latCenter,           //Cannot do any differently than individually call lat and lng 
//                         lngCenter: lngCenter,
//                         c: cVar,
//                         cL: coordsL,
//                         m: minMag, 
//                         maxr: maxRad
//                     });                   
//                 };      // end of get Json else
//             });         // end of get Json
//         };              // end of Geocode else
//     });                 // end of Geocode 
// }                       // end of earthQuakes function



  //res.json({c:coords, latCenter:latCenter, lngCenter: lngCenter});
                // res.json(JSON.stringify({c: cVar}));
                // res.end();
                // res.render("home2.hbs", {
                //     startDate: startTime,
                //     endDate: endTime, 
                //     latCenter: latCenter,           //Cannot do any differently than individually call lat and lng 
                //     lngCenter: lngCenter,
                //     c: cVar,
                //     cL: coordsL,
                //     m: minMag, 
                //     maxr: maxRad
                //});     // end of res.render()    