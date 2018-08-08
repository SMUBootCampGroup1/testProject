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

$(".searchHistoryList").empty();
refDatabaseRoot.ref("/searchEvents").on("value", function(snapshot) {

    var snapKeys = Object.keys(snapshot.val());

    for (let i = 0; i < snapKeys.length; i++) {
        /* **** Need Code to just get last 5 records but need to research it
        Psuedo code:
            start adding system date to match with the search parameter
            orderBy="$value" on the stored system date
            get data from firebase by ordering descending and get the val().searchKeyword
        */ 
        console.log(snapshot.child(snapKeys[i]).val().searchKeyword);

        var searchHistoryRow = "<li class='list-group-item search-history' id='searchListItem1'>" + snapshot.child(snapKeys[i]).val().searchKeyword + "</li>";

        $(".searchHistoryList").append(searchHistoryRow);
    }

});

