
function redirect_user() {
    console.log("Order Sent");
    var table_code=document.getElementById("table_code").value;

    window.location+=table_code+"/"
}
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
    // console.log($(window).scrollTop());
   if($(window).scrollTop() === 0) {
     $(".banner").show();
     $(".main_containter").css('margin-top', "100px");
   }else if( !($(window).scrollTop() === 0)) {
       $(".banner").hide();
       $(".main_containter").css('margin-top', "0px");
   }
});
