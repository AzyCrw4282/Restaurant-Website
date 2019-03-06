function banner() {
    $(document).ready(function () {



        $("a").on('click', function (event) {
            var heightofbanner = $("#headerContainer").height();
            console.log(heightofbanner);
            if (this.hash !== "") {
                event.preventDefault();
                var hashlocation = this.hash;

                $('html, body').animate({
                    scrollTop: $(hashlocation).offset().top - heightofbanner
                }, 800);
            }
        });
    });
}


var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (currentScrollPos < 10) {
        document.getElementById("headerContainer").style.display = "";
    } else if(prevScrollpos < currentScrollPos) {
        document.getElementById("headerContainer").style.display = "None";
    }
    prevScrollpos = currentScrollPos;
};

window.onscroll = function() {stickNavBar()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function stickNavBar() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}