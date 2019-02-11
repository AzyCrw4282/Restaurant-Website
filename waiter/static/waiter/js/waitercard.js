/* Data structure should loaded in as Order( _id , Menu_id , Table_id , Customer_id , time_of_order )
 * (from schema.txt)
 * Example how it's supposed to display in the waitercard.html
 *
 *
 */

/*
var tempOrder = [];


function create_order(oNum, oTime, oTable, comments, items ){
    tempOrder[0] = oNum;
    tempOrder[1] = oTime;
    tempOrder[2] = oTable;
    tempOrder[3] = comments;
    tempOrder[4] = items;
    return tempOrder
}
*/

function add_card(card) {
    var card_list=document.getElementById("card_list");
    console.log(card);
    console.log("static: ");
    var orderNumber = card[0];
    var orderTime = card[1];
    var orderTable = "Table " + card[2];

    var comments = card[3];
    console.log("hello from script");
    var border = create_tag("div", "", "", "card text-center border border-secondary", "", "");
    var cardbody = create_tag("div", "", "", "card-body", "", "");
    var order_num_head = create_tag("h5", "", "", "border-bottom border-dark", "", "" + order_number);
    var order_table_head = create_tag("h5", "", "", "card-title border-bottom border-dark", "", "" + order_table);
    var list_of_items = create_tag("ol","","","text-left","","");
    var li1 = create_tag("li", "", "", "", "", "1");
    var li2 = create_tag("li", "", "", "", "", "2");
    var li3 = create_tag("li", "", "", "", "", "3");
    //In the current schema there's no storage for any comments for orders, should this be changed? Box created anyway
    var comment_box = create_tag("p", "", "", "text-monospace", "", "" + comments);
    var confirm_button = create_tag("a", "#", "", "btn btn-primary w-50", "", "Confirm");
    var cancel_button = create_tag("a", "#", "", "btn w-50 btn-secondary", "", "Cancel");
    var footer = create_tag("div", "", "", "card-footer text-muted", "", order_time);

    list_of_items.appendChild(li1);
    list_of_items.appendChild(li2);
    list_of_items.appendChild(li3);

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