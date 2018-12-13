// Modal Javascript
    // Get the modal
    var modal = document.getElementById('myModal');
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    

    $(document).ready(function () {
        $('#pictureDiv').slick({
            fade: false,
            dots: false,
            arrows: false,
            mobileFirst: true,
            variableWidth: true,
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