// Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )
//add all categories and associated items to the categories variable in the format:
// categories={
//      "mains": [
//             {"name": "Tacos with cereal", "price": "£5"},
//             {"name": "Tacos", "price": "£2"},
//             {"name": "Tacos with toast", "price": "£3"}],
//      }
// the schema is:
// # FoodCategory( _id, name)
//#  Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )
//
// sorting is probably faster server side, so we will expect
// this is an function gets the context passed to the html and checks
//it's relevance and readability

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

    var food_categories = data["category_list"];
    var foods = data["food_list"];
    load_tab_shortcut_buttons(food_categories);
    add_section_for_each_food_category(food_categories);
    load_food_cards_into_sections(foods, food_categories);

}

//============= CREATING HTML ELEMENTS==============
function load_tab_shortcut_buttons(categories) {
    var div = document.getElementById("tabs_header");
    for (var i in categories) {
        var cat = categories[i];
        var cat_name = cat["name"];
        // <a style="text-decoration:none;" href="#sides">Sides</a>
        var a = document.createElement("a");
        a.style = "text-decoration:none;";
        a.href = "#" + cat_name;
        a.innerHTML += cat_name.toUpperCase();
        div.appendChild(a);
    }
    // var a = document.createElement("a");
    // a.style = "text-decoration:none;";
    // a.innerHTML += "BASKET";
    // a.href = "#basket";
    // a.id = "basket";
    div.appendChild(a);
}

function add_card(card) {
    console.log("LOADING CARD");
    console.log(card);
    console.log(card["information"]);
    console.log(card["description"]);

    var src = card["picture"];
    var food_name = card["name"];
    var price = card["price"];
    var id = card["id"];
    var food_information = card["information"];
    var div_1 = create_tag("div", "", "", "food_card", id, "");
    var heading = create_tag("h3", "", "", "", id, "" + food_name);
    var div_2 = create_tag("div", "", "", "food_card_img_border", "", "");
    var img = create_tag("IMG", "", "/menu/media/" + src, "food_card_img", "", "");
    var div_21 = create_tag("div","","","","","");
    var div_22 = create_tag("button","","","food_information",id,"i");
    var div_3 = create_tag("div", "", "", "", "", "");
    var div_4 = create_tag("div", "", "", "", "", "");
    var commentForm = create_tag("form", "", "", "", "", "");
    var textField = create_tag("input", "", "", "", id + "comment", "");
    var orderBtn = create_tag("button", "", "", "block", "", "Add to Order " + price);
    if (authenticated) {
        var delete_button = create_tag("button", "", "", "block", "", "delete");
        delete_button.onclick = delete_food_from_menu(id);

    }

    //adding on click functions to increment the popup quantity
    orderBtn.onclick = add_food_to_order(id, textField.id);
    div_1.appendChild(heading);
    div_2.appendChild(img);
    div_2.appendChild(div_21);
    div_21.appendChild(div_22);
    div_3.appendChild(textField);
    div_4.appendChild(orderBtn);
    div_1.appendChild(div_2);
    div_1.appendChild(div_3);
    div_1.appendChild(div_4);

    if (authenticated) {
        div_4.appendChild(delete_button);
    }

    return div_1;
}

function populate_popup(data) {
    //  let list = document.createElement("ul");
    // list.className = "card";
    // list.innerHTML = "<li>" + foodname + "</li>";
    var table_order=data["table_order"];
    var popup_tag = document.getElementById("order_list");
    while (popup_tag.firstChild) {
        popup_tag.removeChild(popup_tag.firstChild)
    }
    var order_submitted = table_order["status"];
    var order_list = table_order["orders"];
    var total_price = table_order["total_price"];

    for (var order_id in order_list) {//For each order create it in the popup list
        var order = order_list[order_id];


        //    check if it is already loaded into the page
        //    append it if it doesnt exist
        var li = create_tag("ul", "", "", "", "", "");
        var ul2 = create_tag("ul", "", "", "", "", "");
        var delete_button = create_tag("button", "", "", "button", "", "Delete");
        var ul = create_tag("ul", "", "", "popup_box_list", "", "");
        var li_name = create_tag("li", "", "", "", "", order["food_name"]);
        var li_price = create_tag("li", "", "", "", "", "" + order["food_price"]);
        var li_comment = create_tag("li", "", "", "", "", "" + order["comment"]);

        delete_button.onclick = delete_food_from_order(order["id"]);

        ul.appendChild(li_name);
        ul.appendChild(li_price);
        ul.appendChild(delete_button);
        ul2.appendChild(li_comment);


        li.appendChild(ul);
        li.appendChild(ul2);
        popup_tag.appendChild(li);
    }
    var total_tag = document.getElementById("order_total");
    total_tag.innerText = "Total: " + total_price;
    var button = document.getElementById("submit_order");
    button.innerText = "Submit Order (status: " + order_submitted + ")";

}

function add_section_for_each_food_category(categories) {
    for (var i in categories) {
        var cat = categories[i];
        var section = document.createElement("SECTION");
        section.className = "food_card_container";
//       <h1 class="separator">
//              <span>SIDES</span>
//        </h1>
        var separator = document.createElement("h1");
        separator.className = "separator";
        var span = document.createElement("span");
        span.innerText = cat["name"].toUpperCase();
        separator.appendChild(span);
        section.id = cat["name"];

        document.getElementById("categories").appendChild(separator);

        document.getElementById("categories").appendChild(section);
    }
}

function load_food_cards_into_sections(food_list, food_categories) {
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

        var card = add_card(food);
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

//
// $(food).ready(function(){
//   $("#hide").click(function(){
//     $("p").hide();
//   });
//   $("#show").click(function(){
//     $("p").show();
//   });
// });
//

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




