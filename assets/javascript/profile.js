// Initialize Firebase
var config = {
    apiKey: "AIzaSyDVpEc6Skfj1Q9qoqpUbFhptWNOM0j__oo",
    authDomain: "rpsgame-9aed3.firebaseapp.com",
    databaseURL: "https://rpsgame-9aed3.firebaseio.com",
    projectId: "rpsgame-9aed3",
    storageBucket: "rpsgame-9aed3.appspot.com",
    messagingSenderId: "105917966385"
};

// apiKey: "AIzaSyBmXUOj-aPn0v7BMhoziXtkOL9ASmpxxas",
// authDomain: "truva-5bdb3.firebaseapp.com",
// databaseURL: "https://truva-5bdb3.firebaseio.com",
// projectId: "truva-5bdb3",
// storageBucket: "truva-5bdb3.appspot.com",
// messagingSenderId: "455614720930"

firebase.initializeApp(config);

var database = firebase.database();
// End Initialize Firebase


var userData = {
    name: "",
    city: "",
    phone: "",
    email: ""
  }

$(document).ready(function() {

    var name = $('#form-name');
    var city = $('#form-city');
    var phone = $('#form-phone');
    var email = $('#form-email');

    name.prop("disabled", true)
    city.prop("disabled", true)
    phone.prop("disabled", true)
    email.prop("disabled", true)

    $("#edit").on("click",function() {
        $('#form-name').prop("disabled", false)
        $('#form-city').prop("disabled", false)
        $('#form-phone').prop("disabled", false)
        $('#form-email').prop("disabled", false)
    });

    $("#save").on("click",function() {

        userData.name = name.val().trim();
        userData.city = city.val().trim();
        userData.phone = phone.val().trim();
        userData.email = email.val().trim();

        console.log(userData.name);
        console.log(userData.city);
        console.log(userData.phone);
        console.log(userData.email);

        database.ref().push({
            name: userData.name,
            city: userData.city,
            phone: userData.phone,
            email: userData.email,
        });

        $('#profileName').text(userData.name);
        $('#profileCity').text(userData.city);
        $('#profilePhone').text(userData.phone);
        $('#profileEmail').text(userData.email);

        name.val("");
        city.val("");
        phone.val("");
        email.val("");

        name.prop("disabled", true)
        city.prop("disabled", true)
        phone.prop("disabled", true)
        email.prop("disabled", true)
    });
});


    // $("#gifDisplay").empty();
    // $("#searchTerm").val('');
    // $("#myModal").show();
    // $('#attack').hide();

