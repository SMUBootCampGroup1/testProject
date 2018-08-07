var parameters = location.search.substring(1).split("&");  //console.log(parameters);
var firstPos, kywd, dist, lat, lon, sessionID, searchID, myMap; //global variables to pass in GET
var userData = {
    searchCriteria: ""
};

/*var yelpPicArray = [
    "http://s3-media2.fl.yelpcdn.com/bphoto/ybXbObsm7QGw3SGPA1_WXA/o.jpg",
    "http://s3-media3.fl.yelpcdn.com/bphoto/7rZ061Wm4tRZ-iwAhkRSFA/o.jpg",
    "http://s3-media3.fl.yelpcdn.com/bphoto/--8oiPVp0AsjoWHqaY1rDQ/o.jpg"
]*/


if (parameters == 0) {  //if there is no GET this is a new visitor - start afresh
    //go get their geo coordinates
    getAutoGEO();//this function will take care or resetting the webpage when done
}//end if parameters == 0

else if (parameters != 0) { //if there IS a GET then process the user's search input
    var keepCount = 0;
    parameters.forEach(function (entry) {
        var splitPoint = entry.indexOf("=") + 1;
        switch (keepCount) {
            case 0: kywd = entry.substring(splitPoint);
            case 1: dist = entry.substring(splitPoint);
            case 2: lat = entry.substring(splitPoint);
            case 3: lon = entry.substring(splitPoint);
            case 4: sessionID = entry.substring(splitPoint);
            case 5: searchID = entry.substring(splitPoint);
        } //end switch
        keepCount++;
    });//end parameters.forEach    

    setSlider();

}

//Events====================================================

$(".searchButton").on("click", function (event) {//user in on index.html if they click myBtn2
    event.preventDefault();//prevent enter button causing havoc
    userData.searchCriteria = $(".searchField").val();//get user input

    saveSearch(userData.searchCriteria, dist, lat, lon, sessionID);//save it to db and get the new record key
    //this function will take us to search_results page and map with map pins when its done
});

//functions +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function setSlider() {
    $('#slider').slick({
        dots: true,
        arrows: true
    });
}// end setSlider

function getAutoGEO() {
    var pos = "";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            setTimeout(function () {//don't activate the page at all until geo location is obtained
                if (pos != "") {
                    kywd = "";
                    dist = "8800";
                    lat = pos.lat;
                    lon = pos.lng;
                    sessionID = initSession();
                    var nextPage = "index.html?kywd=" + kywd + "&dist=" + dist + "&lat=" + lat + "&lon=" + lon + "&sesID=" + sessionID;
                    location.replace(nextPage);
                }
            }, 2500);
        });
    }
}//END FUNCTION getAutoGEO

function makeTimestamp() {
    //set working variables of our own
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    return dt + time;
}

function initFirebase() {
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


function initSession() {
    var dateOfSession = makeTimestamp();
    //connect to firebase database
    var databaseRef = initFirebase();

    // Capture User Inputs and store them into variables
    var newSessionID = databaseRef.ref('/sessionEvents').push({
        sessionBeginDate: dateOfSession
    }).getKey(); //console.log("after initSession databaseRef = "); //console.log(databaseRef);
    return newSessionID;
}//end function initSession

function saveSearch(k, d, la, lo, sesID) {
    var dateOfSearch = makeTimestamp();
    //connect to firebase database
    var refTheDatabaseRoot = initFirebase();

    searchID = refTheDatabaseRoot.ref('/searchEvents').push({
        searchSessionID: sesID,
        searchDate: dateOfSearch,
        searchKeyword: k,
        searchDistance: d,
        searchLat: la,
        searchLon: lo,
        searchNumResults: 0,
        searchJSONbody: ""
    }).getKey();

    refTheDatabaseRoot.ref('/searchEvents').on("value", function (snapshot) {
        var mySnapshot = snapshot.val(); //console.log(mySnapshot); console.log(" AND THAT WAS mySnapshot");
        var snapKeys = Object.keys(mySnapshot); //console.log(snapKeys); console.log(" - snapkeys ");
        var searchRecordToShow = '';
        for (var j = 0; j < snapKeys.length; j++) {

            if (snapKeys[j] == searchID) {//if we're at the record that matches our key of choice...
                searchRecordToShow = mySnapshot[snapKeys[j]];//this is our record
            }//end if iterKey == thisSearchKey
        }//end for i loop

        var nextPage = "search_results.html?kywd=" + k + "&dist=" + d + "&lat=" + la + "&lon=" + lo + "&sesID=" + sessionID + "&seaID=" + searchID;
        location.replace(nextPage);
    });//end searchEvents on value
}//end function saveSearch


function initMap() {
    var autoLat = parseFloat(lat); var autoLon = parseFloat(lon);
    var markCenter = { lat: autoLat, lng: autoLon };

    myMap = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: markCenter
    });

    var request = {
        location: markCenter,
        radius: 8800, //5-miles
        types: ['restaurant', 'cafe', 'food']
        //types: ['night_club']
    };

    var service = new google.maps.places.PlacesService(myMap); 
    //console.log("service " + service);
    service.nearbySearch(request, callback);

}//close initMap

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}//close callback

function createMarker(place) { 
    console.log(place);
    var placeLoc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };
    var placeName = place.name;

    var dynMarker = new google.maps.Marker({
        map: myMap,
        position: placeLoc,
        name: placeName
    });

    dynMarker.addListener('click', function () {
        // if(place.opening_hours.open_now == 'false'){
        //     varOpenNow = 'Open Now';
        // }
        // else if (place.opening_hours.open_now == 'true'){
        //     varOpenNow = "Closed";
        // }
        // else{varOpenNow = "Closed";}

        var nameToFind = this.name; 
        console.log(nameToFind);
        var queryURL = 
        "https://developers.zomato.com/api/v2.1/search?q=" + nameToFind + "&lat=" + placeLoc.lat + "&lon=" + placeLoc.lng;
        //"https://developers.zomato.com/api/v2.1/search?lat=" + placeLoc.lat + "&lon=" + placeLoc.lng;

        $.ajax({  //Ajax call 1
            type: "GET",
            headers: { "X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7" },
            url: queryURL,
            success: function (response) {

                userData.idToFind = response.restaurants['0'].restaurant.R.res_id; 
                console.log("id = " + userData.idToFind);

                var queryURL2 = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + userData.idToFind;
            
                    $.ajax({ //Ajax call 2
                        type: "GET",
                        headers: { "X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7" },
                        url: queryURL2,
                        success: function (response) {
                            var results2 = response;
                            console.log(results2);

                            console.log(results2.id);
                            console.log(results2.name);

                        }//end Success 2
                    });//end Ajax 2
                }//end Success 1
            });//end Ajax 1

// Images
        var imageHTML1 = "<div><img src='";
        var imageHTML2 = "' class='imageStyle'></div>";
        //for (let i = 0; i < yelpPicArray.length; i++) {
            // $("#pictureDiv").append(
            //     imageHTML1 +
            //     place.photos[0].html_attributions +
            //     imageHTML2
            // );
        //}
// End Images

// Update page with search results data

        $("#publicSpaceName").html(this.name);
        // $("#header").append(varOpenNow + place.price_level); 
        // console.log(place.photos[0].getUrl());
        //$("#pictureDiv").attr("src", place.photos.html_attributions).css('width', '100%');
        $("#placeRating").html( place.rating );
        $("#reviews").html("reviews here");
        //$("#myModal").show();

    });
}//end createMarker

// function getRestID(nm, la, lo) {
//     //var idToFind = "";
//     var spacePos = nm.indexOf(" ");
//     var nameToFind = nm.substring(0,spacePos); //console.log(nameToFind);
//     var queryURL = 
//     "https://developers.zomato.com/api/v2.1/search?q=" + nameToFind + "&lat=" + la + "&lon=" + lo;
    
//     $.ajax({
//         type: "GET",
//         headers: { "X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7" },
//         url: queryURL,
//         success: function (response) {

//             var results = response.restaurants; //console.log(results); console.log("results")

//             //for (var i = 0; i < results.length; i++) {
//                 //console.log(results); console.log(" gotcha");
//                 //var resultName = response.restaurants['0'].restaurant.name;
//                 //if (resultName == nameToFind) {
//                     userData.idToFind = response.restaurants['0'].restaurant.R.res_id; 
//                     console.log("id = " + userData.idToFind);
//                     return userData.idToFind;
                    
//                 //}//end if resultname = nameToSearch
//             //}//end for i
//         }//end success1
//     });//end ajax1
//     return userData.idToFind;
//     //console.log("id" + idToFind);
// }//end function getRestID

// function showRestDetails(id) {
//     var queryURL2 = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + id;
//     //https://developers.zomato.com/api/v2.1/search?q=Central%20Perk&lat=35.17938&lon=-95.1698

//     $.ajax({
//         type: "GET",
//         headers: { "X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7" },
//         url: queryURL2,
//         success: function (response) {
//             var results2 = response;
//             console.log(results2); 
//             console.log(" DEUX ");            
//         }//end success2
//     });//end ajax2
// }//end function showRestDetail
