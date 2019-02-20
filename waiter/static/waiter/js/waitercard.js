/* Data structure should loaded in as Order( _id , Menu_id , Table_id , Customer_id , time_of_order )
 * (from schema.txt)
 * Example how it's supposed to display in the waitercard.html
 *
 *
 */


var tempOrder = [];


function update_waiter_card() {
    var food_name, total_price, food_price, order_id, order_comment;

    $.ajax({
        url: 'get_waiter_card_data/',
        dataType: 'json',
        type: 'GET', // A get request data to update data
        success: function (data) {
            if (JSON.parse(data["success"]) == "1") {
                populate_popup(JSON.parse(data['message']));//To populate called here
            } else {
                console.log("NO DATA")
            }
        },
        error: function (data) {
        }
    });

}

function load_data(order_list) {
    console.log(order_list);
    load_cards(order_list)
}

function load_cards(table_orders) {
    for (var i in table_orders) {
        var table_order = table_orders[i];
        var table_order_id = table_order["id"];
        var table_order_comment = table_order["comment"];
        var table_order_time = table_order["time"];
        var table_order_table_number = table_order["table_number"];
        var table_order_order_list = table_order["orders"];
        add_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list);


    }
}

function add_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list) {

    var card_list = document.getElementById("card_list");
    console.log("static: ");
    console.log("hello from script");
    var border = create_tag("div", "", "", "card text-center border border-secondary", "", "");
    var cardbody = create_tag("div", "", "", "card-body", "", "");
    var order_num_head = create_tag("h5", "", "", "border-bottom border-dark", "", "table code: " + table_order_id);
    var order_table_head = create_tag("h5", "", "", "card-title border-bottom border-dark", "", "table number: " + table_order_table_number);
    var list_of_items = create_tag("ol", "", "", "text-left", "", "");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        var order_item_tag = create_tag("li", "", "", "", "", "" + order_item["food_name"] + ": " + order_item["comment"]);
        list_of_items.appendChild(order_item_tag);

    }

    //In the current schema there's no storage for any comments for orders, should this be changed? Box created anyway
    var comment_box = create_tag("p", "", "", "text-monospace", "", "Waiter comment");
    var confirm_button = create_tag("a", "#", "", "btn btn-primary w-50", "", "Confirm");
    var cancel_button = create_tag("a", "#", "", "btn w-50 btn-secondary", "", "Cancel");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", "" + table_order_comment);

    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    cardbody.appendChild(confirm_button);
    cardbody.appendChild(cancel_button);

    border.appendChild(cardbody);
    border.appendChild(footer);
    card_list.appendChild(border);
}

function create_tag(tag_name, href, src, tag_class, id, text) {
    var tag = document.createElement(tag_name);
    if (href.length > 0) {
        tag.href = href;
    }
    if (tag_class.length > 0) {
        tag.className = tag_class;
    }
    if (src.length > 0) {
        console.log(src);
        tag.src = src;

    }
    if (id.length > 0) {
        tag.id = id;
    }
    if (text.length > 0) {
        tag.innerText = text;
    }
    if (href.length > 0) {
        tag.href = href;
    }
    return tag;

}