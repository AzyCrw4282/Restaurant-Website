function populate_card() {
    update_menu_popup_data_payment()
    
}
function populate_popup_payment(data){
        //  let list = document.createElement("ul");
    // list.className = "card";
    // list.innerHTML = "<li>" + foodname + "</li>";

    var table_order = data["table_order"];
    var basket_item_container = document.getElementById("basket_item_container");
    while (basket_item_container.firstChild) {
        basket_item_container.removeChild(basket_item_container.firstChild)
    }
    var order_submitted = table_order["status"];
    var order_list = table_order["orders"];
    var total_price = table_order["total_price"];
    console.log(order_list);
    for (var i in order_list) {//For each order create it in the popup list
        var basket_item_p = document.createElement("p");
        var order = order_list[i];
        console.log(order["status"]);
        if (order["status"] == "cooking") {
            basket_item_p.style.backgroundColor = "#ffb7b7"
        } else {
            basket_item_p.style.backgroundColor = "#ccffcc"
        }
        // console.log(order);
        var delete_button = create_tag("button", "", "", "basket_delete_buttons", "", "X");
        var li_name = create_tag("a", "", "", "basket_item_name", "", order["food_name"] + ": " + order["comment"]);
        var li_price = create_tag("span", "", "", "basket_item_price", "", "" + order["food_price"]);
    }
}