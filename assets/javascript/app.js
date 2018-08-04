
$(document).ready(function() {
    // Slider
    $('#slider').slick({
      dots: true,
      arrows: true
    });
    // End Slider
});


var parameters = location.search.substring(1).split("&");  //console.log(parameters);

if(parameters != 0){//if this has a GET, then save it and display it
    
    //LIVE CODE HERE _ RESTORE IT AFTER TESTING IS COMPLETE     //NEED restore when going live
    var keepCount = 0;
    var kywd2, dist2, lat2, lon2;
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
    /*
    //go search GooglePlaces and get data to show
              //update page with search results data
              $("#publicSpaceName").html("Buzz Brew");
              $("#header").append("Eggs & Latin-accented dishes are served 24/7 in this tiny, hip coffee shop with Pop Art decor.</i>");
              $("#picture").attr("src", "assets/images/buzzbrew.png").css('width', '100%');
              $("#placeRating").empty();
              var imgPointerDollar = $("<img>"); imgPointerDollar.attr("src", "assets/images/dollarsign.png");
              imgPointerDollar.css("width", "35px").css("height", "45px");
              $("#placeRating").append(imgPointerDollar);
              var imgPointerDollar2 = $("<img>"); imgPointerDollar2.attr("src", "assets/images/dollarsign.png");
              imgPointerDollar.css("width", "35px").css("height", "45px");                             
              imgPointerDollar2.css("margin-right", "60px");
              $("#placeRating").append(imgPointerDollar2);
              var imgPointerStar = $("<img>"); imgPointerStar.attr("src", "assets/images/ratingstar.png");
              imgPointerStar.css("height", "45px");
              $("#placeRating").append(imgPointerStar);
              $("#reviews").html("Absolutely love this place! The self serve coffee bar gives you many options for different kinds of coffee to make just the way you like it. You can also take home fresh coffee grounds or beans to make your favorite coffee at home.<br><br>Even with only 1 waitress and 1 chef, the food arrived quickly and hot. My only issue was the potatoes were harder than usual. Again, probably due to the low staff and there being other customers in the restuarant. Get the French Connection. It's delicious!");
              $("#myModal").show();
    */
    //set working variables of our own
    var currentTimestamp = makeTimestamp();
    var userLat = lat2;
    var userLon = lon2;

    $("#myBtn2").on("click", function(event) {//user in on index.html if they click myBtn2
        event.preventDefault();
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

}//end if there IS a GET

else if(parameters == 0){  //if there is no GET this is a new visitor - start afresh

        //set global variables
        var kywd = "cafe" ;//NEED make this empty string when going LIVE
        var dist = "8800";
        var lat = "35.17938";//NEED make this empty string when going LIVE
        var lon = "-95.1698";//NEED make this empty string when going LIVE

        //and working variables
        var currentTimestamp = makeTimestamp();
    
        //connect to firebase database
        var refDatabaseRoot = initFirebase();

        refDatabaseRoot.ref('/searchEvents').push({
            searchKeyword: kywd,
            searchDistance: dist,
            searchPosition: {lat: lat, lng: lon}, 
            searchDate: currentTimestamp
        });//save this search

        //=========END STEP 1

        refDatabaseRoot.ref('/searchEvents').on("value", function(snapshot) {
            //STEP 2 go to search_result.html and do FB search there
            var nextPage = "index.html?kywd=" + kywd + "&dist=" + dist + "&lat=" + lat + "&lon=" + lon;
            location.replace(nextPage);
            }, function(errorObject) {
                console.log("The read failed: " + errorObject.code);
        });//end searchEvents on value
    
} //end else if there is no GET

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