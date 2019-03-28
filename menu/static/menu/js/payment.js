function populate_cart() {
    update_menu_popup_data_payment()

}

function populate_popup_payment(data) {
    console.log(data);
    //  let list = document.createElement("ul");
    // list.className = "card";
    // list.innerHTML = "<li>" + foodname + "</li>";

    var table_order = data["table_order"];
    var basket_item_container = document.getElementById("order_list");
    while (basket_item_container.firstChild) {
        basket_item_container.removeChild(basket_item_container.firstChild)
    }
    var order_list = table_order["orders"];
    var total_price = table_order["total_price"];
    console.log(order_list);
    for (var i in order_list) {//For each order create it in the popup list
        var order = order_list[i];
        // <p><a>Product 4</a> <span class="price">$2</span></p>
        var basket_item_p = document.createElement("p");
        var basket_item_product_name = document.createElement("a");
        basket_item_product_name.innerText = order["food_name"];
        var basket_item_span = document.createElement("span");
        basket_item_span.className = "price";
        basket_item_span.innerText = "$" + order["food_price"];
        basket_item_p.appendChild(basket_item_product_name);
        basket_item_p.appendChild(basket_item_span);
        basket_item_container.appendChild(basket_item_p);
    }
    var num_items = document.getElementById("cart_num_items");
    num_items.innerText = order_list.length.toString();
    var total_p = document.getElementById("cart_total_price");
    console.log(total_p);

    total_p.innerText = "$"+(Math.floor(total_price*100)/100).toString();
}
function redirect_waiting(){
    var url=window.location.toString().split('/');
    var str=url[0]+'/'+url[1]+'/'+url[2]+'/'+url[3]+'/'+url[4]+'/'+url[5]+'/';
    window.location=str;
}