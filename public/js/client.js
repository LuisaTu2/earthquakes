$(document).ready(function(){

        document.querySelector('[name="endtime"]').onchange = changeDateRange;
        document.querySelector('select[name="minmagnitude"]').onchange = changeMinMag;
        document.querySelector('[name="maxradiuskm"]').onchange = changeRadius;

        $("#address").keypress(function (event) {
            if(event.which == 13) {
                alert( "You submitted an address!" );
                event.preventDefault();
                ajaxCall();
            }       // End of address on keypress call if statement
        });         // End of address on keypress call
});                 // End of document ready


// Function Definitions

function changeDateRange(event) {
    if(!event.target.value) {
        alert("Please Select One");
    } else {
        ajaxCall();
}};

function changeMinMag(event) {
    if(!event.target.value) {
        alert("Please Select One");
    } else {
        ajaxCall();
}};

function changeRadius(event) {
    if(!event.target.value) {
        alert("Please Select One");
    } else {
        ajaxCall();
}};

function ajaxCall(){
    var a = $("#address").val();
    var st = $("#startDate").val();
    var et =  $("#endDate").val();
    if(a == "" || a == undefined || st == "" || st == undefined  || et == "" || et == undefined ){
        alert("Please provide a valid location and date range.")
    } else {
        var userData = {
            address: a,
            starttime: st,
            endtime: et,
            maxradiuskm: document.getElementById("range").value,
            minmagnitude: document.getElementById("minMag").value
        };
    
        $.ajax({
            type: "POST",
            url: "/data",
            data: JSON.stringify(userData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data, status, jqXHR){

                var tmpl; var mapTmpl;
                var quakesL = data.length;

                // Get the map script template 
                $.get("/templates/map.html", function(mapHTML){
                    mapTmpl = mapHTML;
                    if(data.c == "") {
                        //console.log(data.c);
                        //data.c = "";
                        alert("There is no data within the given specifications. Please modify the search parameters. ");
                        //var rMap = Mustache.to_html(mapTmpl, {latCenter: data.latCenter, lngCenter: data.lngCenter, c: data.c});
                        //$("#map").html(rMap);
                    } else {
                        var rMap = Mustache.to_html(mapTmpl, {latCenter: data.latCenter, lngCenter: data.lngCenter, c: data.c});
                        $("#map").html(rMap);
                    }
                });

                // Get the div template 
                $.get("/templates/dataDisplay.html", function(divHTML){
                    tmpl = divHTML;
                    //console.log(jsonData);
                    var rDiv = Mustache.to_html(tmpl, userData);
                    $("#dataDisplayRight").html(rDiv);
                });


            }           
        }) // End of $.ajax call  // CANNOT CREATE IF STATEMENT IN DONE

    }       // End of ajaxCall else statement
}           // End of ajaxCall function definition




// Old Code
        // .done(function (data) {      
        //     var tmpl; var mapTmpl;
        //     //console.log(data.c);

        //     // Get the map script template 
        //     $.get("/templates/map.html", function(mapHTML){
        //         mapTmpl = mapHTML;
        //         // if(data.c == "") {
        //         //     console.log("There are no earthquakes within the given specifications. Please modify the parameters of analysis. ")
        //         // }
        //         var rMap = Mustache.to_html(mapTmpl, {latCenter: data.latCenter, lngCenter: data.lngCenter, c: data.c});
        //         $("#map").html(rMap);
        //     });

        //     // Get the div template 
        //     $.get("/templates/dataDisplay.html", function(divHTML){
        //         tmpl = divHTML;
        //         //console.log(jsonData);
        //         var rDiv = Mustache.to_html(tmpl, jsonData);
        //         $("#dataDispRight").html(rDiv);
        //     });

        //     // console.log(data.c);
        //     // console.log(jsonData);
        //     // Handling case in which no earthquakes are found with given specifications
        //     // if(data.c == [] ){
        //     //     alert("No earthquakes were found. Please change the searching paramenters. ");
        //     // }               
        //     // var r = Mustache.to_html(tmpl, jsonData);
        //     // $("#dataDispRight").html(r);

        // }); // End of done promise(? is it actually a promise?)