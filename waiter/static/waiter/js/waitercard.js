/* Data structure should loaded in as Order( _id , Menu_id , Table_id , Customer_id , time_of_order, state )
 * (from schema.txt)
 * Example how it's supposed to display in the waitercard.html/And the backup reference dummy html waiterver2
 *
 *
 */


var tempOrder = [];

function load_data(order_list) {
    console.log(order_list);
    load_cards(order_list);
    // get_and_update_table_order_states();
    setInterval(function () {
    update_table_order_list();

    }, 5000);
}

function update_cards(data) {
    print("UPDATING CARDS");
    var table_orders = data["table_orders"];

    print(table_orders);
    load_cards(table_orders);

}


function move_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_current_state, table_order_new_state) {
    var del_card = document.getElementById(table_order_id);
    del_card.innerHTML = "";
    switch (table_order_current_state) {
        case "client_confirmed":
            var del_card_parent = document.getElementById("pending_list");
            break;
        case "waiter_confirmed":
            var del_card_parent = document.getElementById("kitchen_list");
            break;
        case "chef_confirmed":
            var del_card_parent = document.getElementById("ready_list");
            break;
        case "chef_canceled":
            var del_card_parent = document.getElementById("ready_list");
            break;
        case "archived":
            var del_card_parent = document.getElementById("archive_list");
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
            print("VALUE");
            print(potential_div.value);
            if (potential_div.value == table_order_state) {
                continue;
            }
            potential_div.remove();

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

//Pending cards
function add_cardpending(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state) {

    var pending_list = document.getElementById("pending_list");
    // console.log("static: ");
    // console.log("creating pendingcard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");
    top_of_panel.value = table_order_state;

    var panel_header = create_tag("div", "", "", "panel-heading", "", "");
    var panel_title = create_tag("h4", "", "", "panel-title", "", "");

    /*This part might break, this tag is a custom <a> tag with bootstrap attributes. I think it's being created properly but
    /*it might be broken. in pure html it would be written like
    /* <a data-toggle="collapse" data-parent="#pending_list" href="#pending1">Order 1</a> */
    var panel_title_text = document.createElement('a');
    panel_title_text.setAttribute("data-toggle", "collapse");
    panel_title_text.setAttribute("data-parent", "#pending_list");
    panel_title_text.href = "#pending" + table_order_id;
    panel_title_text.innerHTML = "Table: " + table_order_table_number;
    panel_title_text.className = "order_text";

    var panel_content_top = create_tag("div", "", "", "panel-collapse collapse in", "pending" + table_order_id, "");
    var panel_body = create_tag("div", "", "", "panel-body", "", "");


    //Creating card divs
    var border = create_tag("div", "", "", "card text-center border border-secondary", "", "");
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
    var cancel_button = create_tag("a", "#", "", "btn w-50 btn-secondary", "", "Cancel");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", "" + table_order_time);
    confirm_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "waiter_confirmed");
    cancel_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    cardbody.appendChild(confirm_button);
    cardbody.appendChild(cancel_button);

    border.appendChild(cardbody);
    border.appendChild(footer);

    panel_title.appendChild(panel_title_text);
    panel_header.appendChild(panel_title);

    panel_body.appendChild(border);
    panel_content_top.appendChild(panel_body);

    top_of_panel.appendChild(panel_header);
    top_of_panel.appendChild(panel_content_top);

    pending_list.appendChild(top_of_panel);


}

//Orders in kitchen
function add_cardkitchen(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state) {


    var pending_list = document.getElementById("kitchen_list");
    // console.log("static: ");
    // console.log("creating kitchencard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");
    top_of_panel.value = table_order_state;

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
    //confirm_button.onclick=change_table_order_state(table_order_id,"waiter_confirmed");
    //cancel_button.onclick=change_table_order_state(table_order_id,"waiter_canceled");
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    //cardbody.appendChild(confirm_button);
    //cardbody.appendChild(cancel_button);

    border.appendChild(cardbody);
    border.appendChild(footer);

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
    deliver_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived");

    //cancel_button.onclick=change_table_order_state(table_order_id,"waiter_canceled");
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    cardbody.appendChild(deliver_button);
    //cardbody.appendChild(cancel_button);

    border.appendChild(cardbody);
    border.appendChild(footer);

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
    //confirm_button.onclick=change_table_order_state(table_order_id,"waiter_confirmed");
    cancel_button.onclick = move_card_on_click(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list, table_order_state, "archived")
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    //cardbody.appendChild(confirm_button);
    cardbody.appendChild(cancel_button);

    border.appendChild(cardbody);
    border.appendChild(footer);

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
    var pending_list = document.getElementById("archive_list");
    // console.log("static: ");
    // console.log("creating archivecard");

    //Panel group divs
    var top_of_panel = create_tag("div", "", "", "panel panel-default", "" + table_order_id, "");
    top_of_panel.value = table_order_state;

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
    //confirm_button.onclick=change_table_order_state(table_order_id,"waiter_confirmed");
    //cancel_button.onclick=change_table_order_state(table_order_id,"waiter_canceled");
    cardbody.appendChild(order_num_head);
    cardbody.appendChild(order_table_head);
    cardbody.appendChild(list_of_items);
    cardbody.appendChild(comment_box);
    //cardbody.appendChild(confirm_button);
    //cardbody.appendChild(cancel_button);

    border.appendChild(cardbody);
    border.appendChild(footer);

    panel_title.appendChild(panel_title_text);
    panel_header.appendChild(panel_title);

    panel_body.appendChild(border);
    panel_content_top.appendChild(panel_body);

    top_of_panel.appendChild(panel_header);
    top_of_panel.appendChild(panel_content_top);

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

function tab(evt, tabname) {
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
    print(table_order_states);
    var outdated_table_orders = [];
    for (var i in table_order_states) {
        var dict = table_order_states[i];
        print(dict);
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