
function redirect_user() {
    console.log("Order Sent");
    var table_code=document.getElementById("table_code").value;

    window.location+=table_code+"/"
}
