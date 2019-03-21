// Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )
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


/**
 * This method gives customer access to the menu, initially set to false.
 * @type {boolean} when autheniticated is true, user is redirected to menu page.
 */

var authenticated = false;
function user_is_authenticated() {
    authenticated = true;
}

//========  LOADING DATA =============
/**
 *This function allocates the data which are lists and allows to use that data in functions.
 * Gives the functions access to the lists.
 * @param data represents the data required in the other functions.
 */

function load_data(data) {
    update_menu_popup_data();
    var food_information = data["food_information_list"];
    var food_categories = data["category_list"];
    var foods = data["food_list"];
    load_tab_shortcut_buttons(food_categories); //the list of categories will be put in the correct section in the menu.
    add_section_for_each_food_category(food_categories); //allows to section the menu page by accessing the food category list.

    var food_info_dict = {};
    for (var i in food_information) { //for every food there will be an information, this loops over it.
        var info_dict = food_information[i];
        var id = info_dict["id"];
        food_info_dict[id] = info_dict; //each food information should have a respective id.
    }

    add_filter_options(food_info_dict); //should be a filter option for each information.

    load_food_cards_into_sections(foods, food_categories, food_info_dict); //each section will be made up of food category and its food and the foods information.
}

/**
 *This method makes a checkbox for each food information,allows filter to occur.
 * @param food_info_dict this is all the different types of information.
 */


function add_filter_options(food_info_dict) {
    var select = document.getElementById("drop_down_filter");

    //iterates over all the information for each food and creates a dropdown check box for it.
    for (var i in food_info_dict) {
        var cat_dict = food_info_dict[i];
        var name = cat_dict["name"];
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

/**
 * This function checks whether or not the checkbox is checked.
 * @param checkbox represents the actual checkbox.
 * @returns {Function}
 */

function click_checkbox(checkbox) {
    return function () {
        //clicking the checkbox again so it un-clicks itself
        if (!(checkbox.checked)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    }
}

/**
 *Applys the changes when the checkbox is clicked it will display all the food items with those food information.
 * @param checkbox
 * @returns {Function}
 */

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

/**
 * This function displays the tabs at the top of the page which are the different categories.
 * @param categories represents the different food types that can be displayed.
 */

//============= CREATING HTML ELEMENTS==============
function load_tab_shortcut_buttons(categories) {
    var tab_links = document.getElementById("links_wrapper");
    for (var i in categories) { //iterates over all the categories
        var cat = categories[i];
        var cat_name = cat["name"]; //represents all the different category name.
        var a = document.createElement("a");
        a.className = "shortcut_anchor";
        a.style = "text-decoration:none;";
        a.href = "#" + cat_name; //there is a link to each different category.
        a.innerHTML += cat_name.toUpperCase();
        tab_links.appendChild(a);
    }
    tab_links.appendChild(a); //each different category will have a link.
}

/**
 * Creates a card for each Food item by adding the relevant food information from the food table.
 * @param card
 * @param info_dict
 * @returns {HTMLElement} this will be the card
 */

function add_card(card, info_dict) {
    var information_list = card['information'];
    var desc = card['description'];
    var information = [];

    //iterates over the information
    for (var i in information_list) {
        var id = information_list[i];
        information.push(info_dict[id])
    }

    var src = card["picture"];
    var food_name = card["name"];
    var price = card["price"];
    var id = card["id"];

    //creates the html elements in the card with the specific tags.
    var food_card = create_tag("div", "", "", "food_card", id, "");
    var heading = create_tag("h3", "", "", "", id, "" + food_name);
    var desc_button = create_tag("button", "", "", "food_allergy_buttons", "desc_button" + id, "i");
    desc_button.style.cssFloat = 'right';
    desc_button.style.background = '#0F31C0';
    var card_img_border = create_tag("div", "", "", "food_card_img_border", "", "");
    card_img_border.style.backgroundImage = "url('" + "/menu/media/" + src + "')";
    var comment_section = create_tag("div", "", "", "", "", "");
    var order_button_section = create_tag("div", "", "", "", "", "");
    var commentForm = create_tag("form", "", "", "", "", "");
    var textField = create_tag("input", "", "", "", id + "comment", "");
    var orderBtn = create_tag("button", "", "", "food_card_button", "", "Add to Order " + price);


    //only when the user is authenticated, there will be a delete button.
    if (authenticated) {
        var delete_button = create_tag("button", "", "", "food_card_button", "", "delete");
        delete_button.onclick = delete_food_from_menu(id); //deletes specific food when the delete button is pressed.
    }

    orderBtn.onclick = add_food_to_order(id, textField.id); //takes the id of the card and the

    if (authenticated) {
        order_button_section.appendChild(delete_button);
    }

    //when the html elements are created by appending each html element to one another it defines the structure for the elements.
    food_card.appendChild(heading);
    card_img_border.appendChild(desc_button);
    comment_section.appendChild(textField);
    order_button_section.appendChild(orderBtn);
    food_card.appendChild(card_img_border);
    food_card.appendChild(comment_section);
    food_card.appendChild(order_button_section);


    //iterates over the information in the food table and for each information a button is created, with the relevant information.
    for (var i in information) {
        var allergy_name = information[i]["name"];
        var allergy_content = information[i]["ingredients"];

       //the button will only display the first letter of the information.
        var allergy_button = create_tag("button", "", "", "food_allergy_buttons", "allergy_button" + allergy_name + id, "" + allergy_name[0]);

        allergy_button.value = allergy_name; //all the names in the food.information
        allergy_button.name = "card_allergy_button_" + "option" + information[i]["id"]; //sets the name of the button to that specific food's information.
        card_img_border.appendChild(allergy_button);


        //creates a popup that displays all the information when user hovers over
        var popup_box_content = create_tag("div", "", "", "food_allergy_info_content", "content_popup" + allergy_name + id, "");
        var popup_box_header = create_tag("div", "", "", "food_allergy_info_content_header", "", "");
        var close_button = create_tag("span", "", "", "food_allergy_info_content_close", "close_button" + allergy_name + id, "");


        var heading_popup = create_tag("h2", "", "", "", "", "" + allergy_name);
        var popup_box_body = create_tag("div", "", "", "food_allergy_info_content_body", "", "");
        var inside_body = create_tag("p", "", "", "", "", "" + allergy_content);
        var popup_box_footer = create_tag("div", "", "", "food_allergy_info_content_footer", "", "");

        allergy_button.onmouseover = allergy_popup_display_on(allergy_name, id); //when the mouse is over the allergy_buttons it will display the popup.
        allergy_button.onmouseleave = allergy_popup_display_off(allergy_name, id);//when the mouse is away the allergy_buttons it will display the popup.

        card_img_border.appendChild(popup_box_content);
        popup_box_content.appendChild(popup_box_header);
        popup_box_header.appendChild(close_button);
        popup_box_header.appendChild(heading_popup);
        popup_box_content.appendChild(popup_box_body);
        popup_box_body.appendChild(inside_body);
        popup_box_content.appendChild(popup_box_footer);

    }

    desc_button.onmouseover = desc_popup_display_on(id); //when the mouse is over the i it will display the popup.
    desc_button.onmouseleave = desc_popup_display_off(id); //when the mouse is away from the i button it will not show the popup.


    //The popup that is displayed when the user hovers over the i button.
    //this creates the html elements that is needed for the popup.
    var info_popup_box = create_tag("div", "", "", "food_desc_content", "desc_popup" + id, "");
    var info_popup_header = create_tag("div", "", "", "food_desc_content_header", "", "");
    var info_popup_close = create_tag("span", "", "", "food_desc_content_close", "desc_close_button" + id, "");

    var desc_heading_popup = create_tag("h2", "", "", "", "", ""+food_name);
    var desc_popup_body = create_tag("div", "", "", "food_desc_content_body", "", "");
    var desc_displays = create_tag("p", "", "", "", "", "" + desc);
    var desc_popup_footer = create_tag("div", "", "", "food_allergy_desc_content_footer", "", "");


    //this makes the popup be displayed on the card,this makes sure it shows up around the card_img_border div.
    card_img_border.appendChild(info_popup_box);
    info_popup_box.appendChild(info_popup_header);
    info_popup_header.appendChild(info_popup_close);
    info_popup_header.appendChild(desc_heading_popup);
    info_popup_box.appendChild(desc_popup_body);
    desc_popup_body.appendChild(desc_displays);
    info_popup_box.appendChild(desc_popup_footer);


    return food_card;
}

/**
 * When the mouse hovers over the allergy buttons,it changes the display of the popup to block.
 * @param allergy_name this is for each button
 * @param id
 * @returns {Function}
 */
function allergy_popup_display_on(allergy_name, id) {
    return function () {
        var x = document.getElementById("content_popup" + allergy_name + id);
        x.style.display = "block";
    }
}

/**
 * when the mouse is not hovering over the allergy buttons it will change the display of the popup to none.
 * @param allergy_name for each button
 * @param id each different food information id will display different information
 * @returns {Function}
 */

function allergy_popup_display_off(allergy_name, id) {
    return function () {
        var x = document.getElementById("content_popup" + allergy_name + id);
        x.style.display = "none";
    }
}

/**
 *When the mouse is hovering over the i it will display the popup.
 * @param id this represents how every food card will have a different information.
 * @returns {Function}
 */

function desc_popup_display_on(id) {
    return function () {
        var x = document.getElementById("desc_popup" + id);
        x.style.display = "block";
    }
}

/**
 *When the mouse is hovering over the i it will display the popup.
 * @param id this represents how every food card will have a different information.
 * @returns {Function}
 */

function desc_popup_display_off(id) {
    return function () {
        var x = document.getElementById("desc_popup" + id);
        x.style.display = "none";
    }
}

// /**
//  *
//  * @param id
//  * @returns {Function}
//  */
// function desc_popup(id) {
//     return function () {
//         var x = document.getElementById("desc_popup" + id);
//         var desc_button = document.getElementById("desc_button" + id);
//         var span = document.getElementById("desc_close_button" + id);
//
//         x.style.display = "block";
//         span.onclick = function () {
//             x.style.display = "none";
//         }
//
//     }
//
// }

/**
 *
 * @param data
 */

function populate_popup(data) {
    var table_order = data["table_order"];
    var basket_item_container = document.getElementById("basket_item_container");
    while (basket_item_container.firstChild) {
        basket_item_container.removeChild(basket_item_container.firstChild)
    }
    var order_submitted = table_order["status"];
    var order_list = table_order["orders"];
    var total_price = table_order["total_price"];

    for (var order_id in order_list) {//For each order create it in the popup list
        var basket_item_p = document.createElement("p");

        var order = order_list[order_id];
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
    total_tag.innerText = "Total: " + total_price;
    var button = document.getElementById("submit_order");
    button.innerText = "Submit Order (status: " + order_submitted + ")";

}

/**
 * This function creates sections that separates the food sections.
 * places every food item in the correct food category.
 * @param categories this is all the different food types.
 */

function add_section_for_each_food_category(categories) {
    for (var i in categories) { //for each food category there will be an allocated space that will contain cards.
        var cat = categories[i];
        var food_section = document.createElement("SECTION");
        food_section.className = "food_card_container";

        var separator = document.createElement("div");
        separator.className = "food_card_separator";
        separator.innerText = cat["name"].toUpperCase(); //each different section will be for an allocated category.
        food_section.id = cat["name"]; //each

        document.getElementById("categories").appendChild(separator);

        document.getElementById("categories").appendChild(food_section);
    }
}

/**
 *
 * @param food_list
 * @param food_categories
 * @param food_info_dict
 */

function load_food_cards_into_sections(food_list, food_categories, food_info_dict) {
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

/**
 *
 */


$("#popup_button_minimize").click(function () {
    if ($(this).html() == "-") {
        $(this).html("+");
    } else {
        $(this).html("-");
    }
    $("#box").slideToggle();
});


//======== HELPER FUNCTIONS? NEW TO JAVASCRIPT================

/**
 * This creates HTML elements by their structure.
 * @param tag_name this is the tag name for the element.
 * @param href represents href which could be a link.
 * @param src the src of the element being created.
 * @param tag_class if the element has a tag class.
 * @param id represents the id of the element being created.
 * @param text this is if the html element contains text inside the tag.
 * @returns {HTMLElement}
 */

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



