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


$(document).scroll(function() {
   if($(window).scrollTop() === 0) {
     $(".banner").show();
     $(".tabs_header").css('top', "100px");
     $(".order_popup").css('top',"175px");
   }else if( !($(window).scrollTop() === 0)) {
       $(".banner").hide();
       $(".tabs_header").css('top', "0px");
       $(".order_popup").css('top',"75px");
   }
});


// window.onscroll = function () {
//     document.getElementById("banner").style.visibility = "hidden";
//     document.getElementById("tabs_header").style.top = "0px";
// }



