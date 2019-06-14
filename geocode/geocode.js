const request = require('request');
const gKey  = "AIzaSyDoKUQoxuJYwJ6eMIq8Gn33cf-LalCl7GA";

exports.geocodeAddress = function(address, callback) {
        var encodedAddress = encodeURIComponent(address);
       
        request({
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${gKey}`      
                //json: true
                }, function(error, res, body) {
                        body = JSON.parse(body);
                        if(error){
                                console.log("Unable to connect to Google server");
                                //callback("Unable to connect to Google servers.");
                        } else if (body.status == "OVER_QUERY_LIMIT") {
                                console.log(body);
                                console.log("You have exceed your daily request quota for this API.");
                                //callback("Unable to find that address.");
                        } else if(body.status == "ZERO_RESULTS") {
                                console.log(`Unable to find ${encodedAddress}`);
                                //callback(`Unable to find ${encodedAddress}`);
                        } else if (body.status == "OK"){
                                //   // callback(undefined, {
                                //   //   address: body.results[0].formatted_address,
                                //   //   latitude: body.reasults[0].geometry.location.lat,
                                //   //   longitude: body.results[0].geometry.locaiton.lng
                                //   //});
                                // console.log(`Address: ${body.results[0].formatted_address}`);
                                // console.log(`Latitude: ${body.results[0].geometry.location.lat}`);
                                // console.log(`Longitude: ${body.results[0].geometry.location.lng}`);
                                var lat_long = [body.results[0].geometry.location.lat, body.results[0].geometry.location.lng ];
                                callback(error, lat_long);

                        } 
                }
        );
     
}



// *********************************************************************** //
// End of File
// *********************************************************************** //


// OLD or ADDITIONAL CODE