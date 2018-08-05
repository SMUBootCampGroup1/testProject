// Modal Javascript
    // Get the modal
    var modal = document.getElementById('myModal');
    
    // Get the button that opens the modal
    // var btn = document.getElementById("myBtn");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks on the button, open the modal 
    // dynMarker.onclick = function() {
    //     modal.style.display = "block";
    // }
        /// picture div for modal 
    $(document).ready(function () {
        $('#pictureDiv').slick({
            fade: false,
            dots: false,
            arrows: false
        });
    });
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        // $('#pictureDiv').slick('unslick');
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            // $('#pictureDiv').slick('unslick');
        }
    }

// 