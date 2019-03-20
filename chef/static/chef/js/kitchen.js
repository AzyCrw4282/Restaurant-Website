/**
 * This function is used to call the load cards function.
 * This function takes one parameter table_order_list which is then passed on to the function load card.
 * @param table_order_list - represents order data from customer as a list
 */

function load_data(table_order_list) {
    load_cards(table_order_list);
}


/**
 * This function is used to retrieve and send data to the add card function.
 * @param data - represents an list passed on from the load_data function.
 */

function load_cards(data) {
    setInterval(function () {
        update_table_order_states()
    }, 5000);
    console.log(data);
    var table_orders = data["table_orders"];
    console.log(table_orders);

    for (var i in table_orders) {
        var table_order = table_orders[i];
        console.log(table_order);
        var table_order_id = table_order["id"];
        var table_order_comment = table_order["comment"];
        var table_order_time = table_order["time"];
        var table_order_table_number = table_order["table_number"];
        var table_order_order_list = table_order["orders"];
        console.log(table_order_order_list);
        add_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list);
    }
}


/**
 * This function is used to request a reload of the page if an id is missing or not should all correct id's be present.
 * @param card_id_list - this represents the list of card id's.
 */

function update_table_order_cards(card_id_list) {
//    check if an update is required if it is reload page
//     console.log(card_id_list);
    var cards = document.getElementById("card_container");
    var number_of_cards = cards.children.length;
    //update the states regardless because these can be clicked at any time...
    update_order_states();
    if (card_id_list.length != number_of_cards) {
        location.reload()
    }
    for (var j in card_id_list) {
        if (document.getElementById(card_id_list[j])) {
            //    id exists all good
        } else {
            // there is a new id, reload the page :/
            location.reload();
        }
    }
}


/**
 * This function is used to implement the "to-do list" feature, allowing the chef's to tick of food items that have been cooked.
 * This function not only visually ticks off what parts of the order have been complete but also updates this information in the database.
 * @param order_dict- this represents a dictionary filled with order data.
 */

function update_order_list_items(order_dict) {

    for (var key in order_dict) {
        var order_status = order_dict[key];
        var order_li = document.getElementById("order_li" + key);
        if (order_li) {
            console.log(order_li);
            if (order_status == "cooking") {
                order_li.className = "";
                order_li.onclick = change_order_state(key, "done");
            } else {
                order_li.className = "checked";
                order_li.onclick = change_order_state(key, "cooking");
            }

        }

    }
}


/**
 * This function is used to create the card.
 * This function works by using js dom to create the elements of the card allowing them to then be appended to the kitchen page, with the correct order data.
 * @param table_order_id - this represents a table id.
 * @param table_order_comment - this represents a food comment from the customer.
 * @param table_order_time - this is used to represent the time of order displayed on the page.
 * @param table_order_table_number - this represents the order number linked to the table.
 * @param table_order_order_list - this represents a list of food ordered by the customer.
 */

function add_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list) {
    console.log("adding card");
    console.log(table_order_order_list);
    var div = document.createElement("div");
    var time_field = document.createElement("h4");
    time_field.innerText = "Time: " + table_order_time;
    div.appendChild(time_field);
    var table_number = document.createElement("h4");
    table_number.innerText = "Table Number: " + table_order_table_number;
    div.appendChild(table_number);
    div.id = table_order_id;
    div.className = "card";

    var div_img = document.createElement("div");
    div_img.className = "image";
    var div_img_ul = document.createElement("ul");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        console.log(order_item);
        var order_id = order_item["id"];
        var food_name = order_item["food_name"];
        var comment = order_item["comment"];
        var order_li = document.createElement("li");
        order_li.id = "order_li" + order_id;
        order_li.innerText = food_name + " : " + comment;
        if (order_item["status"] == "cooking") {
            order_li.onclick = change_order_state(order_id, "done");
        } else {
            order_li.className = "checked";
            order_li.onclick = change_order_state(order_id, "cooking");
        }

        div_img_ul.appendChild(order_li);
    }
    div_img.appendChild(div_img_ul);
    div.appendChild(div_img);

    var div_container = document.createElement("div");
    div_container.className = "container";
    var div_container_button_c = document.createElement("button");
    div_container_button_c.onclick = change_table_order_state(table_order_id, "chef_canceled");
    div_container_button_c.className = "cancel";
    div_container_button_c.innerText += "Cancel";
    var div_container_p = document.createElement("p");
    div_container_p.appendChild(div_container_button_c);
    div_container.appendChild(div_container_p);

    div_container_p = document.createElement("p");
    var div_container_button = document.createElement("button");
    div_container_button.onclick = change_table_order_state(table_order_id, "chef_confirmed");
    div_container_button.className = "done";
    div_container_button.innerText += "Done";
    div_container_p.appendChild(div_container_button);
    div_container.appendChild(div_container_p);
    div.appendChild(div_container);
    var a = document.getElementById("card_container");
    a.appendChild(div);
    update_order_states();

}


