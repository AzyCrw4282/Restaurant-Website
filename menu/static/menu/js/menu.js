// SECTION STRUCTURE OF THIS FILE:
// ACCESS POINT (LOADING DATA FROM HTML)
// CREATING HTML ELEMENTS FOR THE PAGE
var authenticated = false;

function user_is_authenticated() {
    authenticated = true;
}

//========  LOADING DATA =============
function load_data(data) {
    update_menu_popup_data();
    var food_information = data["food_information_list"];
    var food_categories = data["category_list"];
    var foods = data["food_list"];
    load_tab_shortcut_buttons(food_categories);
    add_section_for_each_food_category(food_categories);
    var food_info_dict = {};
    for (var i in food_information) {
        var info_dict = food_information[i];
        var id = info_dict["id"];
        food_info_dict[id] = info_dict;
    }
    add_filter_options(food_info_dict);
    load_food_cards_into_sections(foods, food_categories, food_info_dict);
    setInterval(function () {
        update_menu_popup_data();
    }, 30000);
}


function add_filter_options(food_info_dict) {
    var select = document.getElementById("drop_down_filter");
    for (var i in food_info_dict) {
        var cat_dict = food_info_dict[i];
        var name = cat_dict["name"];
        // console.log(name);
        var option = document.createElement("a");

        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.id = "option" + cat_dict["id"];
        checkbox.onclick = click_checkbox(checkbox);
        option.value = name.toString();
        option.innerText = name;
        option.appendChild(checkbox);
        option.onclick = update_filter(checkbox);


        select.appendChild(option)
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

// $('#drop_down_filter').multiselect({
//     columns: 1,
//     placeholder: 'Select Languages',
//     search: true,
//     selectAll: true
// });

function update_filter(checkbox) {
    return function () {
        console.log("UPDATING");
        var display = "none";
        if (!(checkbox.checked)) {
            checkbox.checked = true;
            display = "inline-block";
        } else {
            checkbox.checked = false;
        }
        // console.log(display);
        //get all buttons with the tag value of the
        //    removes / shows the relevant food cards on the page depending on selected options from the filter.

        var all_food_allergy_card_tags = document.getElementsByName("card_allergy_button_" + checkbox.id);
        // console.log(all_food_allergy_card_tags);
        for (var i = 0; i < all_food_allergy_card_tags.length; i++) {
            //    while the parent node is not the food_card get the parent node
            //    set the food_card display
            var parent_node = all_food_allergy_card_tags[i].parentNode;
            while (true) {
                // console.log(parent_node);
                if (parent_node.className == "food_card") {
                    parent_node.style.display = display;
                    break;
                } else {
                    try {
                        parent_node = parent_node.parentNode;
                    } catch (e) {
                        break;
                    }
                }
            }
        }
    }
}

//============= CREATING HTML ELEMENTS==============
function load_tab_shortcut_buttons(categories) {
    var div = document.getElementById("links_wrapper");
    var a = document.createElement("a");
    a.style = "text-decoration:none;";
    a.innerHTML += "BASKET";
    a.href = "#basket";
    a.id = "basket";
    a.onclick = hide_order_popup();
    div.appendChild(a);
    for (var i in categories) {
        var cat = categories[i];
        var cat_name = cat["name"];
        // <a style="text-decoration:none;" href="#sides">Sides</a>
        var a = document.createElement("a");
        a.className = "shortcut_anchor";
        a.style = "text-decoration:none;";
        a.href = "#" + cat_name;
        a.innerHTML += cat_name.toUpperCase();
        div.appendChild(a);
    }


}

function hide_order_popup_html() {
    var basket = document.getElementById("order_popup");
    console.log(basket.style.display);
    console.log(basket);
    if (basket.style.display) {
        console.log("yes")
    } else {
        basket.style.display = "block"
    }
    if (basket.style.display == "block") {
        basket.style.display = "none"
    } else {
        basket.style.display = "block";
    }
}


function hide_order_popup() {
    return function () {
        var basket = document.getElementById("order_popup");
        console.log(basket.style.display);
        console.log(basket);
        if (basket.style.display) {
            console.log("yes")
        } else {
            basket.style.display = "block"
        }
        if (basket.style.display == "block") {
            basket.style.display = "none"
        } else {
            basket.style.display = "block";
        }
    }

}

function redirect_user_payment() {
    window.location += 'payment_redirect/'
}

function add_card(card, info_dict) {
    // console.log("LOADING CARD");
    var information_list = card['information'];
    var desc = card['description'];
    var information = [];
    for (var i in information_list) {
        var id = information_list[i];
        information.push(info_dict[id])
    }
    // console.log("LIST DICT OF INFO: ");
    // console.log(information);
    // console.log(card);
    // console.log(card["information"]);
    // console.log(card["description"]);

    var src = card["picture"];
    var food_name = card["name"];
    var price = card["price"];
    var id = card["id"];

    var div_1 = create_tag("div", "", "", "food_card", id, "");
    var heading = create_tag("h3", "", "", "", id, "" + food_name);
    var desc_button = create_tag("button", "", "", "food_allergy_buttons", "desc_button" + id, "i");
    desc_button.style.cssFloat = 'right';
    desc_button.style.background = '#0F31C0';
    var div_2 = create_tag("div", "", "", "food_card_img_border", "", "");
    div_2.style.backgroundImage = "url('" + "/menu/media/" + src + "')";
    // var img = create_tag("IMG", "", "/menu/media/" + src, "food_card_img", "", "");
    var div_3 = create_tag("div", "", "", "", "", "");
    var div_4 = create_tag("div", "", "", "", "", "");
    var commentForm = create_tag("form", "", "", "", "", "");
    var textField = create_tag("input", "", "", "", id + "comment", "");
    var orderBtn = create_tag("button", "", "", "food_card_button", "", "Add to Order " + price);

    if (authenticated) {
        var delete_button = create_tag("button", "", "", "food_card_button", "", "delete");
        delete_button.onclick = delete_food_from_menu(id);
    }
    //adding on click functions to increment the popup quantity
    orderBtn.onclick = add_food_to_order(id, textField.id);

    if (authenticated) {
        div_4.appendChild(delete_button);
    }
    div_1.appendChild(heading);
    // div_2.appendChild(img);
    div_2.appendChild(desc_button);
    div_3.appendChild(textField);
    div_4.appendChild(orderBtn);
    div_1.appendChild(div_2);
    div_1.appendChild(div_3);
    div_1.appendChild(div_4);


    for (var i in information) {
        var allergy_name = information[i]["name"];
        var allergy_content = information[i]["ingredients"];

        var allergy_button = create_tag("button", "", "", "food_allergy_buttons", "allergy_button" + allergy_name + id, "" + allergy_name[0]);
        allergy_button.value = allergy_name;
        allergy_button.name = "card_allergy_button_" + "option" + information[i]["id"];
        div_2.appendChild(allergy_button);


        var popup_box_content = create_tag("div", "", "", "food_allergy_info_content", "content_popup" + allergy_name + id, "");
        var popup_box_header = create_tag("div", "", "", "food_allergy_info_content_header", "", "");
        var close_button = create_tag("span", "", "", "food_allergy_info_content_close", "close_button" + allergy_name + id, "");


        var heading_popup = create_tag("h2", "", "", "", "", "" + allergy_name);
        var popupbox_body = create_tag("div", "", "", "food_allergy_info_content_body", "", "");
        var inside_body = create_tag("p", "", "", "", "", "" + allergy_content);
        var popupbox_footer = create_tag("div", "", "", "food_allergy_info_content_footer", "", "");

        allergy_button.onmouseover = allergy_popup_display_on(allergy_name, id);
        allergy_button.onmouseleave = allergy_popup_display_off(allergy_name, id);

        div_2.appendChild(popup_box_content);
        popup_box_content.appendChild(popup_box_header);
        popup_box_header.appendChild(close_button);
        popup_box_header.appendChild(heading_popup);
        popup_box_content.appendChild(popupbox_body);
        popupbox_body.appendChild(inside_body);
        popup_box_content.appendChild(popupbox_footer);


    }


    desc_button.onmouseover = desc_popup_display_on(id);
    desc_button.onmouseleave = desc_popup_display_off(id);

    var info_1 = create_tag("div", "", "", "food_desc_content", "desc_popup" + id, "");
    var info_2 = create_tag("div", "", "", "food_desc_content_header", "", "");
    var info_close = create_tag("span", "", "", "food_desc_content_close", "desc_close_button" + id, "");


    var info_3 = create_tag("h2", "", "", "", "", "" + food_name);
    var info_4 = create_tag("div", "", "", "food_desc_content_body", "", "");
    var info_5 = create_tag("p", "", "", "", "", "" + desc);
    var info_6 = create_tag("div", "", "", "food_allergy_desc_content_footer", "", "");


    div_2.appendChild(info_1);
    info_1.appendChild(info_2);
    info_2.appendChild(info_close);
    info_2.appendChild(info_3);
    info_1.appendChild(info_4);
    info_4.appendChild(info_5);
    info_1.appendChild(info_6);


    return div_1;
}

function allergy_popup_display_on(allergy_name, id) {
    return function () {
        var x = document.getElementById("content_popup" + allergy_name + id);
        x.style.display = "block";
    }
}

function allergy_popup_display_off(allergy_name, id) {
    return function () {
        var x = document.getElementById("content_popup" + allergy_name + id);
        x.style.display = "none";
    }
}

function desc_popup_display_on(id) {
    return function () {
        var x = document.getElementById("desc_popup" + id);
        x.style.display = "block";
    }
}

function desc_popup_display_off(id) {
    return function () {
        var x = document.getElementById("desc_popup" + id);
        x.style.display = "none";
    }
}


function desc_popup(id) {


    return function () {

        var x = document.getElementById("desc_popup" + id);
        var desc_button = document.getElementById("desc_button" + id);

        var span = document.getElementById("desc_close_button" + id);


        x.style.display = "block";

        span.onclick = function () {
            x.style.display = "none";
        }

    }

}


function populate_popup(data) {
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
        // var li_comment = create_tag("li", "", "", "", "", "" + order["comment"]);
        delete_button.onclick = delete_food_from_order(order["id"]);
        basket_item_p.appendChild(delete_button);
        basket_item_p.appendChild(li_name);
        basket_item_p.appendChild(li_price);
        // basket_item_div.appendChild(delete_button);
        basket_item_container.appendChild(basket_item_p);
    }
    var total_tag = document.getElementById("order_total");
    total_tag.innerText = "£" + (Math.floor(total_price * 100) / 100).toString();
    var button = document.getElementById("submit_order");
    if (order_submitted == "client_created") {
        button.innerText = "Submit";
    } else {
        button.innerText = "Thank you";
    }

}

function add_section_for_each_food_category(categories) {
    for (var i in categories) {
        var cat = categories[i];
        var section = document.createElement("SECTION");
        section.className = "food_card_container";
//       <h1 class="separator">
//              <span>SIDES</span>
//        </h1>
        var separator = document.createElement("div");
        separator.className = "food_card_separator";
        separator.innerText = cat["name"].toUpperCase();
        section.id = cat["name"];

        document.getElementById("categories").appendChild(separator);

        document.getElementById("categories").appendChild(section);
    }
}

function load_food_cards_into_sections(food_list, food_categories, food_info_dict) {
    //load_header_tabs(categories);
    // categories is a dictionary
    var category_dict = {};
    for (var i in food_categories) {
        var category = food_categories[i];

        var cat_id = category["id"];
        var cat_name = category["name"];
        category_dict[cat_id] = cat_name;
    }
    for (var i in food_list) {
        var food = food_list[i];

        var card = add_card(food, food_info_dict);
        var category_id = food["category"];

        document.getElementById(category_dict[category_id]).appendChild(card);
    }

}

// ========= JQUERY ACTIVE PAGE ACTIONS================
// $(document).ready(function () {
//     $("#basket").click(function (e) {
//         var x = document.getElementById("order_popup");
//         if (x.style.display === "none") {
//             x.style.display = "block";
//         } else {
//             x.style.display = "none";
//         }
//         return false;
//     });
// });


$("#popup_button_minimize").click(function () {
    if ($(this).html() == "-") {
        $(this).html("+");
    } else {
        $(this).html("-");
    }
    $("#box").slideToggle();
});


// $(food).ready(function(){
//   $("#hide").click(function(){
//     $("p").hide();
//   });
//   $("#show").click(function(){
//     $("p").show();
//   });
// });


//======== HELPER FUNCTIONS? NEW TO JAVASCRIPT================

function create_tag(tag_name, href, src, tag_class, id, text) {
    var tag = document.createElement(tag_name);
    if (href.length > 0) {
        tag.href = href;
    }
    if (tag_class.length > 0) {
        tag.className = tag_class;
    }
    if (src.length > 0) {
        tag.src = src;
        // tag.alt="burger";
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


//     function display_ingredients(){
//     alert(""+info_description);
// }

