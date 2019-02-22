
function load_data(table_order_list) {
    load_cards(table_order_list);
    list_toggles();
}

function list_toggles() {
    var list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);

}

function load_cards(data) {
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
        order_li.id = "" + order_id;
        order_li.innerText = food_name + " : " + comment;
        div_img_ul.appendChild(order_li);
    }
    div_img.appendChild(div_img_ul);
    div.appendChild(div_img);

    var div_container = document.createElement("div");
    div_container.className = "container";
    var div_container_button_c = document.createElement("button");
    div_container_button_c.onclick = change_table_order_state(table_order_id,"chef_canceled");confirmCancel(table_order_id);
    div_container_button_c.className = "cancel";
    div_container_button_c.innerText += "Cancel";
    var div_container_p = document.createElement("p");
    div_container_p.appendChild(div_container_button_c);
    div_container.appendChild(div_container_p);

    div_container_p = document.createElement("p");
    var div_container_button = document.createElement("button");
    div_container_button.onclick = change_table_order_state(table_order_id,"chef_confirmed");confirmDone(table_order_id);
    div_container_button.className = "done";
    div_container_button.innerText += "Done";
    div_container_p.appendChild(div_container_button);
    div_container.appendChild(div_container_p);
    div.appendChild(div_container);
    var a = document.getElementById("card_container");
    a.appendChild(div);


}

//Anyone working on chef - Use this function to change the state
// changes state of the order


function add_listeners() {
    var list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
}

function addChecked() {
    var list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
}

function confirmCancel(objid) {
    return function () {
        var cancel = confirm("Are you sure you want to cancel this order");

        if (cancel == true) {
            document.getElementById(objid).style.backgroundColor = "#ee8400";
            setTimeout(removeCard, 2200, objid, "Cancelled");
            console.log("Order Cancelled");
        }
        if (cancel == false) {
            document.getElementById(objid).style.backgroundColor = "#ffffff";
        }
    }
}

function confirmDone(objid) {
    return function () {
        var done = confirm("Are you sure you want to complete this order");

        if (done == true) {
            document.getElementById(objid).style.backgroundColor = "#329c37";
            setTimeout(removeCard, 4000, objid, "Completed");
        }
        if (done == false) {
            document.getElementById(objid).style.backgroundColor = "#ffffff";
        }
    }
}

function removeCard(objid, typestr) {

    var cardobj = document.getElementById(objid);
    cardobj.parentElement.removeChild(cardobj);
    alert(typestr + ": Table " + objid + " order has been removed ");
}
