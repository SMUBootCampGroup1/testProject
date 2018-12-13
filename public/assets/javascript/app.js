var parameters = location.search.substring(1).split("&");  //console.log(parameters);
var firstPos, dist, lat, lon, myMap; //global variables to pass in GET
var userData = {
    userId: 1,
    searchFor: "",
    dist: "",
    lat: "",
    lon: "",
    savedAsId: "",
    allSavedPlacesArray: [],
    thisPlacePhotoArray: [],
    thisPlaceUrl: ""
};

if (parameters == 0) {  //if there is no GET this is a new visitor - start afresh
    $("#allowmessage").css('visibility', 'visible');
    $("#slider").css('visibility', 'hidden');
    //go get their geo coordinates
    getAutoGEO();//this function will take care or resetting the webpage when done
}//end if parameters == 0

else if (parameters != 0) { //if there IS a GET then process the user's search input
    $("#allowmessage").css('visibility', 'hidden').css('height', '0');
    $("#slider").css('visibility', 'visible');
    var keepCount = 0; 
    parameters.forEach(function (entry) {
        var splitPoint = entry.indexOf("=") + 1;
        switch (keepCount) {
            case 0: userData.searchFor = entry.substring(splitPoint);
            case 1: userData.savedAsId = entry.substring(splitPoint);
            case 2: userData.dist = entry.substring(splitPoint);
            case 3: userData.lat = entry.substring(splitPoint);
            case 4: userData.lon = entry.substring(splitPoint);
        } //end switch
        keepCount++;
    });//end parameters.forEach  
}

setSlider();

//Events====================================================

$(".slick-active").on("click", function (event) {
    event.preventDefault();//prevent enter button causing havoc
   
    switch($(this).index('.slick-track')){
        case -1: userData.searchFor = "restaurant"; break;
        case -2: userData.searchFor = "nightlife"; break;
        case -3: userData.searchFor = "music"; break;
        case -4: userData.searchFor = "bars"; break;
        default: userData.searchFor - "restaurants"; break;
    }
    
    saveSearch();//save it to db and get the new record key
    //this function will take us to search_results page and map with map pins when its done
});

//functions +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function setSlider() {
    $('#slider').slick({
        dots: true,
        arrows: true,
        draggable: false
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
                    dist = "8800";
                    lat = pos.lat;
                    lon = pos.lng;
                    //this is where we first set these params, before search, so do not get userData values here
                    var nextPage = "index.html?kywd=&searchId=&dist=" + dist + "&lat=" + lat + "&lon=" + lon;
                    location.replace(nextPage);
                }
            }, 1500);
        });
    }
}//END FUNCTION getAutoGEO

// function makeTimestamp() {
//     //set working variables of our own
//     var dt = new Date();
//     var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
//     return dt + time;
// }//end function makeTimestamp

// function initSession() {
//     var dateOfSession = makeTimestamp();
//     //connect to firebase database
//     var databaseRef = initFirebase();

//     // Capture User Inputs and store them into variables
//     var newSessionID = databaseRef.ref('/sessionEvents').push({
//         sessionBeginDate: dateOfSession
//     }).getKey(); //console.log("after initSession databaseRef = "); //console.log(databaseRef);
//     return newSessionID;
// }//end function initSession

function saveSearch() { 
    let data ={ 
        latitude: userData.lat,
        longitude: userData.lon,
        distance: userData.dist,
        keyword: userData.searchFor,
        userId: userData.userId
    }

    $.ajax(
        {
        method: "POST",
        url: "/api/searches",
        data: data
        }
    ).then(
        function(res) { 
            userData.savedAsId = res._id;
            var nextPage = "search_results.html?kywd=" + userData.searchFor + "&searchId=" + userData.savedAsId + "&dist=" + userData.dist + "&lat=" + userData.lat + "&lon=" + userData.lon;
            location.replace(nextPage);
    }).catch(
        function(err) {
            console.log(`failure`, err);
        }
    );

//firebase style
//     // var dateOfSearch = makeTimestamp();
//     //connect to firebase database
//     var refTheDatabaseRoot = initFirebase();
//     searchID = refTheDatabaseRoot.ref('/searchEvents').push({
//         // searchSessionID: sesID,
//         // searchDate: dateOfSearch,
//         searchKeyword: k,
//         // searchDistance: d,
//         // searchLat: la,
//         // searchLon: lo,
//         // searchNumResults: 0,
//         // searchJSONbody: ""
//     }).getKey();

//     refTheDatabaseRoot.ref('/searchEvents').on("value", function (snapshot) {
//         var mySnapshot = snapshot.val(); //console.log(mySnapshot); console.log(" AND THAT WAS mySnapshot");
//         var snapKeys = Object.keys(mySnapshot); //console.log(snapKeys); console.log(" - snapkeys ");
//         var searchRecordToShow = '';

//         var searchHistoryList = [];
//         searchHistoryList.push(searchID);

//         // for (var j = 0; j < snapKeys.length; j++) {

//         //     if (snapKeys[j] == searchID) {//if we're at the record that matches our key of choice...
//         //         searchRecordToShow = mySnapshot[snapKeys[j]];//this is our record
//         //     }//end if iterKey == thisSearchKey
//         // }//end for i loop
//     });//end searchEvents on value
//END firebase style

}//end function saveSearch

function initMap() {
    var autoLat = parseFloat(userData.lat); var autoLon = parseFloat(userData.lon);
    var markCenter = { lat: autoLat, lng: autoLon };
    
    myMap = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: markCenter
    });

    var requestMap = {
        location: markCenter,
        radius: userData.dist,
        types: [userData.searchFor]
    };

    var serviceMap = new google.maps.places.PlacesService(myMap); 
    serviceMap.nearbySearch(requestMap, callbackMap);

}//close initMap

function callbackMap(resultsMap, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //save all results to db.results then show map
        savePlaces(resultsMap); //which then calls createMarker
                                
    }
}//close callback

function savePlaces(allResults){//save general place data before showing map & map pins
    
    for(let i=0; i<allResults.length; i++){
        let thisPlace = {
            city: "",
            cuisines: [],
            googlePhotos: [],
            googlePlaceId: allResults[i].place_id,
            googleRating: allResults[i].rating,
            latitude: allResults[i].geometry.location.lat(),
            longitude: allResults[i].geometry.location.lng(),
            name: allResults[i].name,
            searchId: userData.savedAsId,
            street: allResults[i].vicinity,
            types: allResults[i].types,
            website: "",
            zip: "",
            zomatoMenu: "",
            zomatoPhotos: "",
            zomatoRating: 0
        }
        
            $.ajax(
                {
                method: "POST",
                url: "/api/places",
                data: thisPlace
                }
            )
            .then(function(savedPlace){ 
                if(i < (allResults.length-1)){
                    userData.allSavedPlacesArray.push(savedPlace);
                }
                else if( i == (allResults.length-1) ){
                    let arrayLength = userData.allSavedPlacesArray.length;
                    for (let j = 0; j < arrayLength; j++) {
                        createMarker(userData.allSavedPlacesArray[j]);
                    }
                }
            })
            .catch(
                function(err) {
                    console.log(`failure`, err);
                }
            );
    }

}//end function savePlaces

function createMarker(place) { 

    var placeName = place.name;
    var placeId = place.googlePlaceId;
    var dbResultId = place._id;

    var dynMarker = new google.maps.Marker({
        dbresultid: dbResultId,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        map: myMap,
        position: {
            lat: place.latitude,
            lng: place.longitude
        },
        placelatitude: place.latitude,
        placelongitude: place.longitude,
        placename: placeName,
        placeid: placeId
    });
    google.maps.event.addListener(dynMarker, 'click', function() {
        dynMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");                                    
        getGoogleDetails(this); //which in turn calls getZomatoShowModal
    });

}//end createMarker

function getGoogleDetails(clickedMarker){ 

    var requestDetails = {
        placeId: clickedMarker.placeid,
        fields: ['photos','url']
    }; 

    var serviceDetails = new google.maps.places.PlacesService(myMap); 
    serviceDetails.getDetails(requestDetails, 
        function (resultsDetails, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) { 
                userData.thisPlacePhotoArray = resultsDetails.photos; 
                userData.thisPlaceUrl = resultsDetails.url;
            }//end if status = ok
            else{
                userData.thisPlacePhotoArray = ""; 
                userData.thisPlaceUrl = "";
                console.log("failed to retrieve photo array and url from google");}
        }
    );//end serviceDetails.getDetails
    getZomatoRestId(clickedMarker); //which will call getZomatoDetails
                                    //then either zomatoRender or googleRender
}//close function getGoogleDetails

function getZomatoRestId(markerData){
    let zomatoNameToFind = markerData.placename;
    let zLatitude = markerData.placelatitude;
    let zLongitude = markerData.placelongitude;

    let queryURL = "https://developers.zomato.com/api/v2.1/search?q=" + zomatoNameToFind + "&lat=" + zLatitude + "&lon=" + zLongitude;

    $.ajax({  //zomato search for rest by name & loc - get zomato's restId
        type: "GET",
        headers: { "X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7" },
        url: queryURL,
        success: function (getRestId) { 
            var zomatoRestaurants = getRestId.restaurants; 
            var restIdToFind = "";
            for(let k=0; k<zomatoRestaurants.length; k++){
                if(!restIdToFind){ 
                    let zName=zomatoRestaurants[k].restaurant.name.toString();
                    let gName=zomatoNameToFind.toString();
                 
                    if(zName == gName){
                        restIdToFind=zomatoRestaurants[k].restaurant.R.res_id;
                    }   
                }//end if restIdToFind.length = 0
            }//end for k loop

            if(restIdToFind){
                userData.restIdToFind = restIdToFind;
                getZomatoDetails(markerData); //which then calls renderZomato
            }
            else{renderGoogle(markerData);}
        },
        else: function(markerData){
            renderGoogle(markerData);
        }
    });
}

function getZomatoDetails(markerData){
    var restIdToFind = userData.restIdToFind;
    var queryURL2 = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + restIdToFind;

    $.ajax({ //use zomato's restId to search for details of specific restaurant
        type: "GET",
        headers: { "X-Zomato-API-Key": "1747b7fcad14ac3af99c8b42a5eac0d7" },
        url: queryURL2,
        success: function (getRestDetails) { 
            //a click constitutes 'saving' this place
            //update Results table
            var updateData = {
                _id: markerData.dbresultid,
                cuisines: getRestDetails.cuisines,
                googlePhotos: userData.thisPlacePhotoArray,
                priceLevel: getRestDetails.price_range,
                priceTwo: getRestDetails.average_cost_for_two,
                saved: true,
                website: userData.thisPlaceUrl,
                zomatoMenu: getRestDetails.menu_url,
                zomatoPhoto: getRestDetails.photos_url,
                zomatoRating: getRestDetails.user_rating.aggregate_rating
            }

            $.ajax(
                {
                    method: "PUT",
                    url: "/api/places/" + markerData.dbresultid,
                    data: updateData
                }
            )
            .then(function(savedPlace){ 
                renderZomato(savedPlace);
            })
            .catch(function(markerData){
                renderZomato(markerData);
            });//end of marking this row saved in Results table
        },//end success
        else: function(markerData){
            renderGoogle(markerData);
        }
    });//end ajax request zomato details
}//end getZomatoDetails
                    
function renderZomato(placeData){
    var website = userData.thisPlaceUrl;
    var priceContent = "";
    for(let p=0; p<placeData.priceLevel; p++){ 
        priceContent = priceContent + "&nbsp; <img src=assets/images/dollar.png width=20px alt=dollarsign>";
    }
    priceContent = priceContent + " (Avg for two $" + placeData.priceTwo + ")";
    if(placeData.zomatoRating == 0){var zRating = 'none';} else{var zRating = placeData.zomatoRating;}
    
    $("#publicSpaceName").html("<p>" + placeData.name + "</p>");
    $("#cuisines").html("<p>" + placeData.cuisines + "</p>");
    $("#prices").html("<p>Price: " + priceContent + "</p>");
    // if(savedPlace.googlePhotos){
    //     $("#photo").html("<p>" + savedPlace.googlePhotos + "</p>");
    // }
    // else{("#photo").css('visibility', 'hidden').css('height','0');}
    $("#googleRating").html("<p>Google Rating: " + placeData.googleRating + "</p>");
    $("#zomatoRating").html("<p>zomato Rating: " + zRating + "</p>");
    $("#zomatoAddress").html("<p>" + placeData.street + "</p>");
    $("#zomatoMenu").html("<p><a href='" + placeData.zomatoMenu + "' target='_blank'>Zomato Menu</a></p>");
    $("#googleUrl").html("<p><a href='" + placeData.website + "' target='_blank'>Google Places Page</a></p>");
    // if(savedPlace.zomatoPhotos.length>0){
    //     ("#zomatoPhotoPage").html("<p><a href='" + savedPlace.zomatoPhotos + "' target='_blank'>more Photos On Zomato</a></p>");
    // }
    // else{ ("#zomatoPhotoPage").css('visibility', 'hidden').css('height','0');}
    
    modal.style.display = "block";
}//end renderZomato

function renderGoogle(placeData){
    //a click constitutes 'saving' this place
    //update Results table
    var updateData = {
        _id: placeData.dbresultid,
        googlePhotos: userData.thisPlacePhotoArray,
        saved: true,
        website: userData.thisPlaceUrl
    }

    $.ajax(
        {
            method: "PUT",
            url: "/api/places/" + placeData.dbresultid,
            data: updateData
        }
    )
    .then(function(savedPlace){ 
        $("#publicSpaceName").html("<p>" + savedPlace.name + "</p>");
        // if(savedPlace.googlePhotos){
        //     $("#photo").html("<p>" + savedPlace.googlePhotos + "</p>");
        // }
        // else{("#photo").css('visibility', 'hidden').css('height','0');}
        $("#googleRating").html("<p>Google Rating: " + savedPlace.googleRating + "</p>");
        $("#googleUrl").html("<p><a href='" + savedPlace.website + "' target='_blank'>Google Places Page</a></p>");

        modal.style.display = "block";
    })
    .catch(function(placeData) {
        $("#publicSpaceName").html("<p>" + placeData.name + "</p>");
        // if(savedPlace.googlePhotos){
        //     $("#photo").html("<p>" + savedPlace.googlePhotos + "</p>");
        // }
        // else{("#photo").css('visibility', 'hidden').css('height','0');}
        $("#googleRating").html("<p>Google Rating: " + placeData.googleRating + "</p>");
        $("#googleUrl").html("<p><a href='" + placeData.website + "' target='_blank'>Google Places Page</a></p>");

        modal.style.display = "block";
    });
}//end renderGoogle

