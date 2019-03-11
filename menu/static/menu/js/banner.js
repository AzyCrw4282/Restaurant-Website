function banner() {
    $(document).ready(function () {

        $("a").on('click', function (event) {
            var heightofbanner = $("#headerContainer").height() + 30;
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



window.onscroll = function () {
    document.getElementById("banner").style.visibility = "hidden";
    document.getElementById("tabs_header").style.top = "0px";
}



