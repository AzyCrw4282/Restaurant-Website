function banner(){
    $(document).ready(function () {
            $("a").on('click', function (event) {

                var heightofbanner = $("#headerContainer").height() + 10;
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
