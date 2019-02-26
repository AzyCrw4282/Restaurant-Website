
function redirect_user() {
    console.log("Order Sent");
    var table_code=document.getElementById("table_code").value;

    window.location+=table_code+"/"
}

/* To be used if the implemented method is not right
function login_redirect(){
    console.log("Redirecting to login page");
    console.log(window.location);
   window.location='accounts/login';
   return false; // cancel default behavior

}
*/