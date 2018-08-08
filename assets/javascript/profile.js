// Initialize Firebase
var config = {
    apiKey: "AIzaSyDzLJJDQpXlU9GlmiKFnOcOmcQ0PmNDVGU",
    authDomain: "truva-aa8da.firebaseapp.com",
    databaseURL: "https://truva-aa8da.firebaseio.com",
    projectId: "truva-aa8da",
    storageBucket: "truva-aa8da.appspot.com",
    messagingSenderId: "606341424519"
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

        // userData.name = name.val().trim();
        // userData.city = city.val().trim();
        // userData.phone = phone.val().trim();
        // userData.email = email.val().trim();

        userData.name = name.val().trim();
            var nametype=typeof(userData.name);
        userData.city = city.val().trim();
            var citytype=typeof(userData.city);
        userData.phone = phone.val().trim();
            var phonelength = userData.phone.length;
        userData.email = email.val().trim();
            var emailvalid=userData.city.indexOf("@"); console.log(emailvalid);
        if((nametype != "string") || (citytype != "string") || (phonelength < 10) || (emailvalid<0)){
            $(".error").append("<p>Error. Invlaid data<br>Please try again.</p>");
        }

        console.log(userData.name);
        console.log(userData.city);
        console.log(userData.phone);
        console.log(userData.email);

        // database.set({
        //     name: userData.name,
        //     city: userData.city,
        //     phone: userData.phone,
        //     email: userData.email,
        // });

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

