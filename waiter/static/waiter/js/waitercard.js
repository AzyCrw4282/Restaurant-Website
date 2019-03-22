/* Data structure should loaded in as Order( _id , Menu_id , Table_id , Customer_id , time_of_order, state )
 * (from schema.txt)
 * Example how it's supposed to display in the waitercard.html/And the backup reference dummy html waiterver2
 *
 *
 */


var tempOrder = [];

function load_data(order_list, table_list) {
    console.log(order_list);
    load_cards(order_list);
    table_filter_options(table_list);
    // get_and_update_table_order_states();
    setInterval(function () {
        update_table_order_list();
        // update_filter(table_list);
    }, 5000);
}

function update_cards(data) {
    // print("UPDATING CARDS");

    var table_orders = data["table_orders"];

    // print(table_orders);
    load_cards(table_orders);
}


function move_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_current_state, table_order_new_state) {
    var del_card = document.getElementById(table_order_id);
    del_card.innerHTML = "";
    var del_card_parent;
    switch (table_order_current_state) {
        case "client_confirmed":
            del_card_parent = document.getElementById("pending_list");
            break;
        case "waiter_confirmed":
            del_card_parent = document.getElementById("kitchen_list");
            break;
        case "chef_confirmed":
            del_card_parent = document.getElementById("ready_list");
            break;
        case "chef_canceled":
            del_card_parent = document.getElementById("ready_list");
            break;
        case "archived":
            del_card_parent = document.getElementById("archive_list");
            break;
    }
    console.log("Deleted card from " + table_order_current_state);
    del_card_parent.removeChild(del_card);

    switch (table_order_new_state) {
        case "client_confirmed":
            add_cardpending(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_new_state);
            break;
        case "waiter_confirmed":
            add_cardkitchen(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_new_state);
            break;
        case "chef_confirmed":
            add_cardready(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_new_state);
            break;
        case "archived":
            add_cardarchive(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_new_state);
            break;

    }
    console.log("Added new card to " + table_order_new_state)

}

function move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_current_state, table_order_new_state) {
    return function () {
        console.log("CHANGING STATE OF ORDER");
        change_table_order_state(table_order_id, table_order_new_state);
        move_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_current_state, table_order_new_state)
    }
}

function turn_on_notification(table_order_state) {
    // print("turning on notification");
    var state = table_order_state;
    if (state == 'chef_canceled') {
        state = 'chef_confirmed'
    }
    // print(state);
    var tab_button = document.getElementById('tab_link_' + state);
    if (tab_button) {
        tab_button.style.backgroundColor = "red";
    }
}

function load_cards(table_orders) {
    for (var i in table_orders) {
        var table_order = table_orders[i];
        var table_order_id = table_order["id"];
        // if the order exists on the template already delete it:
        // NOT VERY NICE BUT EFFECTIVE IF THE BROWSER IS MODERN


        var table_order_comment = table_order["comment"];
        var table_order_time = table_order["time"];
        var table_order_table_number = table_order["table_number"];
        var table_order_order_list = table_order["orders"];
        var table_order_state = table_order["status"]; //However the state of the order needs to be loaded
        var potential_div = document.getElementById(table_order_id);
        if (potential_div) {
            // print("VALUE");
            // print(potential_div.value);
            if (potential_div.value == table_order_state) {
                continue;
            }
            //Div has changed/ does not exist /whatever notification needed
            turn_on_notification(table_order_state);
            potential_div.remove();

        } else {
            turn_on_notification(table_order_state);

        }


        //Conditionals so cards are loaded into the correct places
        // console.log("State:" + table_order_state);

        switch (table_order_state) {
            case "client_confirmed":
                add_cardpending(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state);
                break;
            case "waiter_confirmed":
                add_cardkitchen(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state);
                break;
            case "chef_confirmed":
                add_cardready(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state);
                break;
            case "chef_canceled":
                add_cardkitchencancel(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state);
                break;
            case "archived":
                add_cardarchive(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state);
                break;
        }
    }
}

//Table filter things

/**
 * This function loads the different tables as options to the table filter.
 * This works by parsing over the table orders and loading the tables from orders into the dropdown
 * as options.
 *
 * This is gonna be really slow when we start approaching higher numbers or orders, only fix
 * would be to change the way /waiter/ loads the data into and get tables as a seperate entity but
 * might require significant refactoring. I'm not sure how exactly to it too.
 *
 * TODO: Fix scaling by only loading tables directly from the database (refactor loading data)
 * @param table_orders List of orders pulled from database.
 */
function table_filter_options(table_list) {
    var filter = document.getElementById("table_filter_content");
    for (var i in table_list) {
        var table_order = table_list[i];
        var table_number = table_order["number"];

        var table_filter_option = document.createElement("a");
        var table_filter_checkbox = document.createElement("input");
        table_filter_checkbox.setAttribute("type", "checkbox");
        table_filter_checkbox.id = "checkbox_" + table_number;
        table_filter_checkbox.value = table_number.toString();
        table_filter_option.innerText = "Table" + table_number;
        //click the checkbox twice to counter act.
        table_filter_checkbox.onclick = click_checkbox(table_filter_checkbox);
        table_filter_option.appendChild(table_filter_checkbox);
        //actually control the selection of the checkbox
        table_filter_option.onclick = update_table_filter(table_filter_checkbox);
        filter.appendChild(table_filter_option);
    }
}

function update_table_filter(checkbox) {
    return function () {
        var set_display = "none";
        console.log("UPDATING");
        var display = "none";
        if (!(checkbox.checked)) {
            checkbox.checked = true;
            display = "block";
        } else {
            checkbox.checked = false;
        }
        //For some reason the bellow does not work? so alternative was used.
        // var order_cards = document.getElementsByName("top_table_" + checkbox.value);
        var all_cards = document.getElementsByClassName("panel panel-default");


        // console.log(order_cards);
        // order_cards.style.display=display;
        for (var i = 0; i < all_cards.length; i++) {
            var order_card = all_cards[i];
            if ("top_table_" + checkbox.value == order_card.name) {
                order_card.style.display = display;

            }
        }
    }
}


function click_checkbox(checkbox) {
    return function () {
        //clicking the checkbox again so it unclicks itself
        if (!(checkbox.checked)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    }
}

//Pending cards
function add_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state) {

    var card_list;
    // console.log("static: ");
    // console.log("creating pendingcard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");
    top_of_panel.value = table_order_state;
    top_of_panel.name = "top_table_" + table_order_table_number;
    var panel_header = create_tag("div", "", "", "panel-heading", "", "");
    var panel_title = create_tag("h4", "", "", "panel-title", "", "");

    /*This part might break, this tag is a custom <a> tag with bootstrap attributes. I think it's being created properly but
    /*it might be broken. in pure html it would be written like
    /* <a data-toggle="collapse" data-parent="#pending_list" href="#pending1">Order 1</a> */
    var panel_title_text = document.createElement('a');
    panel_title_text.innerHTML = "Table: " + table_order_table_number;
    panel_title_text.className = "order_text";

    var panel_content_top = create_tag("div", "", "", "panel-collapse collapse in", "", "");
    var panel_body = create_tag("div", "", "", "panel-body", "", "");


    //Creating card divs
    var border = create_tag("div", "", "", "text-center border border-secondary", "", "");
    var cardbody = create_tag("div", "", "", "card-body", "", "");
    var order_num_head = create_tag("h5", "", "", "border-bottom border-dark", "", "order number: " + table_order_id);
    var order_table_head = create_tag("h5", "", "", "card-title border-bottom border-dark", "", "table number: " + table_order_table_number);
    var list_of_items = create_tag("ol", "", "", "text-left", "", "");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        var order_item_tag = create_tag("li", "", "", "", "", "" + order_item["food_name"] + ": " + order_item["comment"]);
        list_of_items.appendChild(order_item_tag);

    }

    //In the current schema there's no storage for any comments for orders, should this be changed? Box created anyway
    var comment_box = create_tag("p", "", "", "text-monospace", "", "" + table_order_comment);
    var confirm_button = create_tag("a", "#", "", "btn btn-primary w-50", "", "Confirm");
    var deliver_button = create_tag("a", "#", "", "btn btn-primary w-100", "", "Delivered");
    var cancel_button = create_tag("a", "#", "", "btn w-50 btn-secondary", "", "Cancel");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", "" + table_order_time);

    //Status Override
    var override_dropdown = create_tag("div", "", "", "override_drop", "", "");
    var override_button = create_tag("button", "", "", "override_button", "", "Status Override");
    var override_content = create_tag("div", "", "", "override-content", "", "");
    var override_to_pending = create_tag("a", "#", "", "", "", "Pending");
    var override_to_in_kitchen = create_tag("a", "#", "", "", "", "In Kitchen");
    var override_to_ready = create_tag("a", "#", "", "", "", "Order Ready");
    var override_to_cancelled = create_tag("a", "#", "", "", "", "Cancelled");
    var override_to_archive = create_tag("a", "#", "", "", "", "archive");

    override_to_pending.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "customer_confirmed");
    override_to_in_kitchen.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "waiter_confirmed");
    override_to_ready.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_confirmed");
    override_to_cancelled.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_canceled");
    override_to_archive.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");

    deliver_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");
    confirm_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "waiter_confirmed");
    cancel_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");

    //Specific card conditions
    switch (table_order_state) {
        case "client_confirmed":
            card_list = document.getElementById("pending_list");
            panel_title_text.setAttribute("data-toggle", "collapse");
            panel_title_text.setAttribute("data-parent", "#pending_list");
            panel_title_text.href = "#pending" + table_order_id;
            panel_content_top.id = "pending" + table_order_id;
            border.classList.add("card");
            deliver_button.style.display = "none";
            break;
        case "waiter_confirmed":
            card_list = document.getElementById("kitchen_list");
            panel_title_text.setAttribute("data-toggle", "collapse");
            panel_title_text.setAttribute("data-parent", "#kitchen_list");
            panel_title_text.href = "#kitchen" + table_order_id;
            panel_content_top.id = "kitchen" + table_order_id;
            border.classList.add("cardkitchen");
            confirm_button.style.display = "none";
            cancel_button.style.display = "none";
            deliver_button.style.display = "none";
            break;
        case "chef_confirmed":
            card_list = document.getElementById("ready_list");
            panel_title_text.setAttribute("data-toggle", "collapse");
            panel_title_text.setAttribute("data-parent", "#ready_list");
            panel_title_text.href = "#ready" + table_order_id;
            panel_content_top.id = "ready" + table_order_id;
            border.classList.add("cardready");
            confirm_button.style.display = "none";
            cancel_button.style.display = "none";
            break;
        case "chef_canceled":
            card_list = document.getElementById("ready_list");
            panel_title_text.setAttribute("data-toggle", "collapse");
            panel_title_text.setAttribute("data-parent", "#ready_list");
            panel_title_text.href = "#ready" + table_order_id;
            panel_content_top.id = "ready" + table_order_id;
            border.classList.add("cardready");
            confirm_button.style.display = "none";
            deliver_button.style.display = "none";
            cancel_button.text = "Archive";
            break;
        case "archived":
            card_list = document.getElementById("archive_list");
            panel_title_text.setAttribute("data-toggle", "collapse");
            panel_title_text.setAttribute("data-parent", "#archive_list");
            panel_title_text.href = "#archive" + table_order_id;
            panel_content_top.id = "archive" + table_order_id;
            panel_title_text.innerHTML = "Table: " + table_order_table_number + " Time: " + table_order_time;
            border.classList.add("cardkitchen");
            confirm_button.style.display = "none";
            cancel_button.style.display = "none";
            deliver_button.style.display = "none";
            break;
    }


    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    cardbody.appendChild(confirm_button);
    cardbody.appendChild(deliver_button);
    cardbody.appendChild(cancel_button);

    override_content.appendChild(override_to_pending);
    override_content.appendChild(override_to_in_kitchen);
    override_content.appendChild(override_to_ready);
    override_content.appendChild(override_to_cancelled);
    override_content.appendChild(override_to_archive);
    override_dropdown.appendChild(override_button);
    override_dropdown.appendChild(override_content);

    border.appendChild(cardbody);
    border.appendChild(footer);
    border.appendChild(override_dropdown);

    panel_title.appendChild(panel_title_text);
    panel_header.appendChild(panel_title);

    panel_body.appendChild(border);
    panel_content_top.appendChild(panel_body);

    top_of_panel.appendChild(panel_header);
    top_of_panel.appendChild(panel_content_top);



    card_list.appendChild(top_of_panel);


}

//Orders in kitchen
function add_cardkitchen(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state) {


    var pending_list = document.getElementById("kitchen_list");
    // console.log("static: ");
    // console.log("creating kitchencard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");
    top_of_panel.value = table_order_state;
    top_of_panel.name = "top_table_" + table_order_table_number;

    var panel_header = create_tag("div", "", "", "panel-heading", "", "");
    var panel_title = create_tag("h4", "", "", "panel-title", "", "");

    /*This part might break, this tag is a custom <a> tag with bootstrap attributes. I think it's being created properly but
    /*it might be broken. in pure html it would be written like
    /* <a data-toggle="collapse" data-parent="#pending_list" href="#pending1">Order 1</a> */
    var panel_title_text = document.createElement('a');
    panel_title_text.setAttribute("data-toggle", "collapse");
    panel_title_text.setAttribute("data-parent", "#kitchen_list");
    panel_title_text.href = "#kitchen" + table_order_id;
    panel_title_text.innerHTML = "Table: " + table_order_table_number;
    panel_title_text.className = "order_text";

    var panel_content_top = create_tag("div", "", "", "panel-collapse collapse in", "kitchen" + table_order_id, "");
    var panel_body = create_tag("div", "", "", "panel-body", "", "");

    //Creating card divs
    var border = create_tag("div", "", "", "cardkitchen text-center border border-dark", "", "");
    var cardbody = create_tag("div", "", "", "card-body", "", "");
    var order_num_head = create_tag("h5", "", "", "border-bottom border-dark", "", "order number: " + table_order_id);
    var order_table_head = create_tag("h5", "", "", "card-title border-bottom border-dark", "", "table number: " + table_order_table_number);
    var list_of_items = create_tag("ol", "", "", "text-left", "", "");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        var order_item_tag = create_tag("li", "", "", "", "", "" + order_item["food_name"] + ": " + order_item["comment"]);
        list_of_items.appendChild(order_item_tag);

    }

    //In the current schema there's no storage for any comments for orders, should this be changed? Box created anyway
    var comment_box = create_tag("p", "", "", "text-monospace", "", "" + table_order_comment);
    //var confirm_button = create_tag("a", "#", "", "btn btn-primary w-50", "", "Confirm");
    //var cancel_button = create_tag("a", "#", "", "btn w-50 btn-secondary", "", "Cancel");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", "" + table_order_time);

    //Status Override
    var override_dropdown = create_tag("div", "", "", "override_drop", "", "");
    var override_button = create_tag("button", "", "", "override_button", "", "Status Override");
    var override_content = create_tag("div", "", "", "override-content", "", "");
    var override_to_pending = create_tag("a", "#", "", "", "", "Pending");
    var override_to_in_kitchen = create_tag("a", "#", "", "", "", "In Kitchen");
    var override_to_ready = create_tag("a", "#", "", "", "", "Order Ready");
    var override_to_cancelled = create_tag("a", "#", "", "", "", "Cancelled");
    var override_to_archive = create_tag("a", "#", "", "", "", "archive");

    override_to_pending.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "customer_confirmed");
    override_to_in_kitchen.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "waiter_confirmed");
    override_to_ready.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_confirmed");
    override_to_cancelled.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_canceled");
    override_to_archive.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");


    //confirm_button.onclick=change_table_order_state(table_order_id,"waiter_confirmed");
    //cancel_button.onclick=change_table_order_state(table_order_id,"waiter_canceled");
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    //cardbody.appendChild(confirm_button);
    //cardbody.appendChild(cancel_button);

    override_content.appendChild(override_to_pending);
    override_content.appendChild(override_to_in_kitchen);
    override_content.appendChild(override_to_ready);
    override_content.appendChild(override_to_cancelled);
    override_content.appendChild(override_to_archive);
    override_dropdown.appendChild(override_button);
    override_dropdown.appendChild(override_content);

    border.appendChild(cardbody);
    border.appendChild(footer);
    border.appendChild(override_dropdown);

    panel_title.appendChild(panel_title_text);
    panel_header.appendChild(panel_title);

    panel_body.appendChild(border);
    panel_content_top.appendChild(panel_body);

    top_of_panel.appendChild(panel_header);
    top_of_panel.appendChild(panel_content_top);

    pending_list.appendChild(top_of_panel);

}

//Order ready cards
function add_cardready(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state) {

    var pending_list = document.getElementById("ready_list");
    // console.log("static: ");
    // console.log("creating readycard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");
    top_of_panel.value = table_order_state;
    top_of_panel.name = "top_table_" + table_order_table_number;

    var panel_header = create_tag("div", "", "", "panel-heading", "", "");
    var panel_title = create_tag("h4", "", "", "panel-title", "", "");

    /*This part might break, this tag is a custom <a> tag with bootstrap attributes. I think it's being created properly but
    /*it might be broken. in pure html it would be written like
    /* <a data-toggle="collapse" data-parent="#pending_list" href="#pending1">Order 1</a> */
    var panel_title_text = document.createElement("a");
    panel_title_text.setAttribute("data-toggle", "collapse");
    panel_title_text.setAttribute("data-parent", "#ready_list");
    panel_title_text.href = "#ready" + table_order_id;
    panel_title_text.innerHTML = "Table: " + table_order_table_number;
    panel_title_text.className = "order_text";

    var panel_content_top = create_tag("div", "", "", "panel-collapse collapse in", "ready" + table_order_id, "");
    var panel_body = create_tag("div", "", "", "panel-body", "", "");

    //Creating card divs
    var border = create_tag("div", "", "", "cardready text-center border border-ready", "", "");
    var cardbody = create_tag("div", "", "", "card-body", "", "");
    var order_num_head = create_tag("h5", "", "", "border-bottom border-dark", "", "order number: " + table_order_id);
    var order_table_head = create_tag("h5", "", "", "card-title border-bottom border-dark", "", "table number: " + table_order_table_number);
    var list_of_items = create_tag("ol", "", "", "text-left", "", "");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        var order_item_tag = create_tag("li", "", "", "", "", "" + order_item["food_name"] + ": " + order_item["comment"]);
        list_of_items.appendChild(order_item_tag);

    }

    //In the current schema there's no storage for any comments for orders, should this be changed? Box created anyway
    var comment_box = create_tag("p", "", "", "text-monospace", "", "" + table_order_comment);
    var deliver_button = create_tag("a", "#", "", "btn btn-primary w-100", "", "Delivered");
    //var cancel_button = create_tag("a", "#", "", "btn w-50 btn-secondary", "", "Cancel");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", "" + table_order_time);

    //Status Override
    var override_dropdown = create_tag("div", "", "", "override_drop", "", "");
    var override_button = create_tag("button", "", "", "override_button", "", "Status Override");
    var override_content = create_tag("div", "", "", "override-content", "", "");
    var override_to_pending = create_tag("a", "#", "", "", "", "Pending");
    var override_to_in_kitchen = create_tag("a", "#", "", "", "", "In Kitchen");
    var override_to_ready = create_tag("a", "#", "", "", "", "Order Ready");
    var override_to_cancelled = create_tag("a", "#", "", "", "", "Cancelled");
    var override_to_archive = create_tag("a", "#", "", "", "", "archive");

    override_to_pending.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "customer_confirmed");
    override_to_in_kitchen.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "waiter_confirmed");
    override_to_ready.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_confirmed");
    override_to_cancelled.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_canceled");
    override_to_archive.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");


    deliver_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");

    //cancel_button.onclick=change_table_order_state(table_order_id,"waiter_canceled");
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    cardbody.appendChild(deliver_button);
    //cardbody.appendChild(cancel_button);

    override_content.appendChild(override_to_pending);
    override_content.appendChild(override_to_in_kitchen);
    override_content.appendChild(override_to_ready);
    override_content.appendChild(override_to_cancelled);
    override_content.appendChild(override_to_archive);
    override_dropdown.appendChild(override_button);
    override_dropdown.appendChild(override_content);

    border.appendChild(cardbody);
    border.appendChild(footer);
    border.appendChild(override_dropdown);

    panel_title.appendChild(panel_title_text);
    panel_header.appendChild(panel_title);

    panel_body.appendChild(border);
    panel_content_top.appendChild(panel_body);

    top_of_panel.appendChild(panel_header);
    top_of_panel.appendChild(panel_content_top);

    pending_list.appendChild(top_of_panel);
}

//Orders cancelled by kitchen
function add_cardkitchencancel(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state) {

    var pending_list = document.getElementById("ready_list");
    // console.log("static: ");
    // console.log("creating readycard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");
    top_of_panel.value = table_order_state;
    top_of_panel.name = "top_table_" + table_order_table_number;

    var panel_header = create_tag("div", "", "", "panel-heading", "", "");

    var panel_title = create_tag("h4", "", "", "panel-title", "", "");

    /*This part might break, this tag is a custom <a> tag with bootstrap attributes. I think it's being created properly but
    /*it might be broken. in pure html it would be written like
    /* <a data-toggle="collapse" data-parent="#pending_list" href="#pending1">Order 1</a> */
    var panel_title_text = document.createElement("a");
    panel_title_text.setAttribute("data-toggle", "collapse");
    panel_title_text.setAttribute("data-parent", "#ready_list");
    panel_title_text.href = "#ready" + table_order_id;
    panel_title_text.innerHTML = "Table: " + table_order_table_number;
    panel_title_text.className = "order_text";

    var panel_content_top = create_tag("div", "", "", "panel-collapse collapse in", "ready" + table_order_id, "");
    var panel_body = create_tag("div", "", "", "panel-body", "", "");

    //Creating card divs
    var border = create_tag("div", "", "", "cardready text-center border border-secondary", "", "");
    var cardbody = create_tag("div", "", "", "card-body", "", "");
    var order_num_head = create_tag("h5", "", "", "border-bottom border-dark", "", "order number: " + table_order_id);
    var order_table_head = create_tag("h5", "", "", "card-title border-bottom border-dark", "", "table number: " + table_order_table_number);
    var list_of_items = create_tag("ol", "", "", "text-left", "", "");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        var order_item_tag = create_tag("li", "", "", "", "", "" + order_item["food_name"] + ": " + order_item["comment"]);
        list_of_items.appendChild(order_item_tag);

    }

    //In the current schema there's no storage for any comments for orders, should this be changed? Box created anyway
    var comment_box = create_tag("p", "", "", "text-monospace", "", "" + table_order_comment);
    //var confirm_button = create_tag("a", "#", "", "btn btn-primary w-50", "", "Confirm");
    var cancel_button = create_tag("a", "#", "", "btn w-100 btn-secondary", "", "Archive");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", "" + table_order_time);

    //Status Override
    var override_dropdown = create_tag("div", "", "", "override_drop", "", "");
    var override_button = create_tag("button", "", "", "override_button", "", "Status Override");
    var override_content = create_tag("div", "", "", "override-content", "", "");
    var override_to_pending = create_tag("a", "#", "", "", "", "Pending");
    var override_to_in_kitchen = create_tag("a", "#", "", "", "", "In Kitchen");
    var override_to_ready = create_tag("a", "#", "", "", "", "Order Ready");
    var override_to_cancelled = create_tag("a", "#", "", "", "", "Cancelled");
    var override_to_archive = create_tag("a", "#", "", "", "", "archive");

    override_to_pending.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "customer_confirmed");
    override_to_in_kitchen.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "waiter_confirmed");
    override_to_ready.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_confirmed");
    override_to_cancelled.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_canceled");
    override_to_archive.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");


    //confirm_button.onclick=change_table_order_state(table_order_id,"waiter_confirmed");
    cancel_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived")
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    //cardbody.appendChild(confirm_button);
    cardbody.appendChild(cancel_button);

    override_content.appendChild(override_to_pending);
    override_content.appendChild(override_to_in_kitchen);
    override_content.appendChild(override_to_ready);
    override_content.appendChild(override_to_cancelled);
    override_content.appendChild(override_to_archive);
    override_dropdown.appendChild(override_button);
    override_dropdown.appendChild(override_content);

    border.appendChild(cardbody);
    border.appendChild(footer);
    border.appendChild(override_dropdown);

    panel_title.appendChild(panel_title_text);
    panel_header.appendChild(panel_title);

    panel_body.appendChild(border);
    panel_content_top.appendChild(panel_body);

    top_of_panel.appendChild(panel_header);
    top_of_panel.appendChild(panel_content_top);

    pending_list.appendChild(top_of_panel);
}

//Archived Orders
function add_cardarchive(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state) {
    // var temp_holder=document.createElement("div");
    var pending_list = document.getElementById("archive_list");
    // console.log("static: ");
    // console.log("creating archivecard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");


    var panel_header = create_tag("div", "", "", "panel-heading", "", "");

    var panel_title = create_tag("h4", "", "", "panel-title", "", "");

    /*This part might break, this tag is a custom <a> tag with bootstrap attributes. I think it's being created properly but
    /*it might be broken. in pure html it would be written like
    /* <a data-toggle="collapse" data-parent="#pending_list" href="#pending1">Order 1</a> */
    var panel_title_text = document.createElement("a");
    panel_title_text.setAttribute("data-toggle", "collapse");
    panel_title_text.setAttribute("data-parent", "#archive_list");
    panel_title_text.href = "#archive" + table_order_id;
    panel_title_text.innerHTML = "Table: " + table_order_table_number + " Time: " + table_order_time;
    panel_title_text.className = "order_text";

    var panel_content_top = create_tag("div", "", "", "panel-collapse collapse in", "archive" + table_order_id, "");
    var panel_body = create_tag("div", "", "", "panel-body", "", "");

    //Creating card divs
    var border = create_tag("div", "", "", "cardkitchen text-center border border-secondary", "", "");
    var cardbody = create_tag("div", "", "", "card-body", "", "");
    var order_num_head = create_tag("h5", "", "", "border-bottom border-dark", "", "order number: " + table_order_id);
    var order_table_head = create_tag("h5", "", "", "card-title border-bottom border-dark", "", "table number: " + table_order_table_number);
    var list_of_items = create_tag("ol", "", "", "text-left", "", "");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        var order_item_tag = create_tag("li", "", "", "", "", "" + order_item["food_name"] + ": " + order_item["comment"]);
        list_of_items.appendChild(order_item_tag);

    }

    //In the current schema there's no storage for any comments for orders, should this be changed? Box created anyway
    var comment_box = create_tag("p", "", "", "text-monospace", "", "" + table_order_comment);
    //var confirm_button = create_tag("a", "#", "", "btn btn-primary w-50", "", "Confirm");
    //var cancel_button = create_tag("a", "#", "", "btn w-50 btn-secondary", "", "Cancel");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", "" + table_order_time);

    //Status Override
    var override_dropdown = create_tag("div", "", "", "override_drop", "", "");
    var override_button = create_tag("button", "", "", "override_button", "", "Status Override");
    var override_content = create_tag("div", "", "", "override-content", "", "");
    var override_to_pending = create_tag("a", "#", "", "", "", "Pending");
    var override_to_in_kitchen = create_tag("a", "#", "", "", "", "In Kitchen");
    var override_to_ready = create_tag("a", "#", "", "", "", "Order Ready");
    var override_to_cancelled = create_tag("a", "#", "", "", "", "Cancelled");
    var override_to_archive = create_tag("a", "#", "", "", "", "archive");

    override_to_pending.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "customer_confirmed");
    override_to_in_kitchen.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "waiter_confirmed");
    override_to_ready.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_confirmed");
    override_to_cancelled.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "chef_canceled");
    override_to_archive.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");


    //confirm_button.onclick=change_table_order_state(table_order_id,"waiter_confirmed");
    //cancel_button.onclick=change_table_order_state(table_order_id,"waiter_canceled");
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    //cardbody.appendChild(confirm_button);
    //cardbody.appendChild(cancel_button);

    override_content.appendChild(override_to_pending);
    override_content.appendChild(override_to_in_kitchen);
    override_content.appendChild(override_to_ready);
    override_content.appendChild(override_to_cancelled);
    override_content.appendChild(override_to_archive);
    override_dropdown.appendChild(override_button);
    override_dropdown.appendChild(override_content);

    border.appendChild(cardbody);
    border.appendChild(footer);
    border.appendChild(override_dropdown);

    panel_title.appendChild(panel_title_text);
    panel_header.appendChild(panel_title);

    panel_body.appendChild(border);
    panel_content_top.appendChild(panel_body);

    top_of_panel.appendChild(panel_header);
    top_of_panel.appendChild(panel_content_top);
    top_of_panel.value = table_order_state;
    top_of_panel.name = "top_table_" + table_order_table_number;
    // print(top_of_panel.name);

    pending_list.appendChild(top_of_panel);
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
    /*this might work?
    if (data-toggle.length > 0) {
        tag.data-toggle = data-toggle;
    }
    if (data-parent.length > 0) {
        tag.data-parent = data-parent;
    }*/
    return tag;

}

function tab(evt, tabname, id) {
    //reset the bg colour if it is red.
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabname).style.display = "block";
    var tab = document.getElementById(id);
    // print(tab);
    tab.style.backgroundColor = "white";
    evt.currentTarget.className += " active";
}

// update if external changes detected:
function update_table_order_states(table_order_states) {
    print("CALLED THIS FUNCTION");
// This page should never need a reload.
// request a list of all card id's and their states
// if the card id and state matches the one on the document then it's fine
// otherwise delete it request all the card details from the server
// and add it back to the relevant location by it's status.
//    Requirements for this: Card id and Card status
//     print(table_order_states);
    var outdated_table_orders = [];
    for (var i in table_order_states) {
        var dict = table_order_states[i];
        // print(dict);
        var state = dict["state"];
        var id = dict["id"];
        var table_order_div = document.getElementById(id);
        if (table_order_div) {
            if (table_order_div.value == state) {
                //    it exists and the value is the same, so all good
            } else {
                //add the id to the list of id's we have to update from the server
                //this is due to ineffective javascript but it will be fine
                //as it serves to add new cards in the background as well,
                //it's just less pretty and less efficient.
                outdated_table_orders.push(id);
            }
        } else {
            //add it to the list as it does not exist on the page and needs to be retrieved from the server.
            outdated_table_orders.push(id);
        }

    }
    if (outdated_table_orders.length > 0) {
        update_table_order_list(outdated_table_orders);

    }


}

function print(object) {
    console.log(object);
}

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};