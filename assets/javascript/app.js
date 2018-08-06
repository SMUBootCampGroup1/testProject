var parameters = location.search.substring(1).split("&");  //console.log(parameters);

if(parameters == 0){  //if there is no GET this is a new visitor - start afresh
    
    console.log("no params");
            //set global variables
            var kywd = "cafe" ;//NEED make this empty string when going LIVE
            var dist = "8800";
            var lat = "35.17938";//NEED make this empty string when going LIVE
            var lon = "-95.1698";//NEED make this empty string when going LIVE
    
            //and working variables
            var currentTimestamp = makeTimestamp();
        
            /*//connect to firebase database
            var refDatabaseRoot = initFirebase();
    
            refDatabaseRoot.ref('/searchEvents').push({
                searchKeyword: kywd,
                searchDistance: dist,
                searchPosition: {lat: lat, lng: lon}, 
                searchDate: currentTimestamp
            });//save this search
    
            //=========END STEP 1
    
            refDatabaseRoot.ref('/searchEvents').on("value", function(snapshot) { console.log("snapshot!");
                //STEP 2 go to search_result.html and do FB search there
                var nextPage = "index.html?kywd=" + kywd + "&dist=" + dist + "&lat=" + lat + "&lon=" + lon;
                location.replace(nextPage);
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
            });//end searchEvents on value
        */
    } //end if there is no GET

else if(parameters != 0){//if this has a GET, then save it and display it
  /*  //setSlider();
    //LIVE CODE HERE _ RESTORE IT AFTER TESTING IS COMPLETE     //NEED restore when going live
    var keepCount = 0;
    var kywd2, dist2, lat2, lon2, myMap;
    parameters.forEach(function(entry) {
        var splitPoint = entry.indexOf("=") + 1;
        switch(keepCount){
            case 0: kywd2 = entry.substring(splitPoint);
            case 1: dist2 = entry.substring(splitPoint);
            case 2: lat2 = entry.substring(splitPoint);
            case 3: lon2 = entry.substring(splitPoint);
        } //end switch
        keepCount++;
    });//end parameters.forEach

    //set working variables of our own
    var currentTimestamp = makeTimestamp();
    var userLat = lat2;
    var userLon = lon2;

    $(".searchButton").on("click", function(event) {//user in on index.html if they click myBtn2
        event.preventDefault();
        console.log('search text 1:' + userData.searchCriteria);
        userData.searchCriteria = $(".searchField").val();
        console.log('search text 1:' + userData.searchCriteria);

        //save search into database     //then go to newDetailViewPage.html and do FB search there
    
        //connect to firebase database
        var refDatabaseRoot = initFirebase();

        //STEP 1 SAVE
        // Capture User Inputs and store them into variables
          refDatabaseRoot.ref('/searchEvents').push({
            searchKeyword: kywd2,
            searchDistance: dist2,
            searchLat: userLat, 
            searchLon: userLon,
            searchDate: currentTimestamp
        });
        //=========END STEP 1

        refDatabaseRoot.ref('/searchEvents').on("value", function(snapshot) {
            
            //STEP 2 go to search_result.html and do FB search there
            var nextPage = "search_results.html?kywd=" + kywd2 + "&dist=" + dist2 + "&lat=" + lat2 + "&lon=" + lon2;
            location.replace(nextPage);
          }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
          });//end searchEvents on value
    
    }//close callback function inside myBtn2 onclick
    );//close #myBtn2 onclick event
*/
    

}//end else if there IS a GET

function makeTimestamp(){
    //set working variables of our own
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    return dt + time;
}

function initFirebase(){
    var config = {
        apiKey: "AIzaSyBmXUOj-aPn0v7BMhoziXtkOL9ASmpxxas",
        authDomain: "truva-5bdb3.firebaseapp.com",
        databaseURL: "https://truva-5bdb3.firebaseio.com",
        projectId: "truva-5bdb3",
        storageBucket: "truva-5bdb3.appspot.com",
        messagingSenderId: "455614720930"
    };

    firebase.initializeApp(config);
    refDatabaseRoot = firebase.database();
    return refDatabaseRoot;
}//END initFirebase

function setSlider(){
    $('#slider').slick({
        dots: true,
        arrows: true
    });
}// End Slider

function initMap(){
    var markCenter = {lat: 32.776664, lng: -96.796988};
        
        myMap = new google.maps.Map(document.getElementById("map"), {
            zoom: 13,
            center: markCenter
        });

        var request = {
            location: markCenter,
            radius: 8800, //5-miles
            types: ['night_club']
        };

        var service = new google.maps.places.PlacesService(myMap); //console.log("service " + service);

        service.nearbySearch(request, callback);

    }//close initMap

    function callback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
            for (var i=0; i<results.length; i++){
                    createMarker(results[i]);
            }
        }
        //console.log("status = " + status);
    }//close callback
    
    function createMarker(place){     //console.log(place);

        var placeLoc = place.geometry.location;
        var placeName = place.name;
        var dynMarker = new google.maps.Marker({
            map: myMap,
            position: placeLoc,
            name: placeName
        });

        dynMarker.addListener('click', function(){
          //update page with search results data
          $("#publicSpaceName").html(placeName);
          $("#header").append("Eggs & Latin-accented dishes are served 24/7 in this tiny, hip coffee shop with Pop Art decor.</i>");
          $("#picture").attr("src", "assets/images/buzzbrew.png").css('width', '100%');
          $("#placeRating").html("ratings");
          $("#reviews").html("help");
          $("#myModal").show();
          $("#map").hide();
        });
    }//end createMarker

    function getZomato() {

        var queryURL = "https://developers.zomato.com/api/v2.1/search?entity_type=city&lat=35.17938&lon=-95.1698";
        var restaurant = "Central Perk";
        $.ajax({
            type: "GET",
            headers: {"X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7"},
            url: queryURL,
            success: function (response) {
     
                var results = response.restaurants;
                for(var i=0; i<results.length; i++){
                    //console.log(results); console.log(" gotcha");
                    var resultName = results[i].restaurant.name;
                    if(resultName == restaurant){
                        var idToFind = results[i].restaurant.id; console.log("id = " + idToFind);
                        var queryURL2 = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + idToFind;
                        $.ajax({
                            type: "GET",
                            headers: { "X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7" },
                            url: queryURL2,
                            success: function (response) {
                                var results2 = response;
                                console.log(results2); console.log(" DEUX ");
                                //console.log(idToFind); console.log("NAME");
                            }//end success2
                        });//end ajax2
                    }//end if resultname = nameToSearch
                }//end for i
            }//end success1
        });//end ajax1
     
    }//end function getZomato