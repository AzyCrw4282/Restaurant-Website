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

// load the tabs at the top
// load the categories for each tab


//load the data sent from the server
//in the bellow format
// # {
// #     "food_information":[
// #         {"id":id,"name":name},
// #         {"id":id,"name":name}
// #     ],
// #     "food_categories":[
// #         {"id":id,"name":name},
// #         {"id":id,"name":name},
// #         {"id":id,"name":name}
// #     ],
// # "foods":[
// #     {"id":id,"display":display,"name":name,"price":price,"category_id":catogory_id,"food_information":[
// #         {"id":id},
// #         {"id":id},
// #         {"id":id},
// #     ],"description":description,"picture":picture},
// # ]
// #
// # }
function load_data(data) {
    update_menu_popup_data();
    // setInterval(function(){
    //     update_menu_popup_data()
    // },2000);
    var food_information = data["food_information"];
    var food_categories = data["food_categories"];
    var foods = data["foods"];
    load_tab_shortcut_buttons(food_categories);
    add_section_for_each_food_category(food_categories);
    load_food_cards_into_sections(food_categories, foods, food_information);

}

function load_tab_shortcut_buttons(categories) {
    var ul = document.getElementById("tabs_header_list");
    for (var i in categories) {
        var cat = categories[i];
        var cat_name = cat["name"];
        // <li><a class="active" href="#mains">Mains</a></li>
        var li = document.createElement("li");
        li.className = "active";
        var a = document.createElement("a");
        a.href = "#" + cat_name;
        a.innerHTML += cat_name;
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function delete_food_from_menu(id) {

    return function () {

        $.ajax({
            //Post request made here
            type: "post",
            url: 'delete_food_from_menu/',
            data: {
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "food_id": id
            }
        })

    }
}

function delete_food_from_order(order_id) {
    return function () {
        $.ajax({
            //Post request made here
            type: "post",
            url: 'delete_food_from_order/',
            data: {
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "order_id": order_id
            },
        });



    }


}

function add_food_to_order(food_id, comment_id) {
    return function () {


        var comment = document.getElementById(comment_id).value;

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var date_time = date + ' ' + time;
        var context = {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_id": food_id,
            "comment": comment,
            "time": date_time

        };


        $.ajax({
            //Post request made here
            type: "post",
            url: 'add_food_to_order/',
            data: context
        });
    }
}


function add_card(card) {
    var src = card["picture"];

    var name = card["name"];
    var price = card["price"];
    var id = card["id"];

    var div_1 = create_tag("div", "", "", "food_card", id, "");
    var div_2 = create_tag("div", "", "", "food_card_img_border", "", "");
    var img = create_tag("img", "", "/menu/media/" + src, "food_card_img", "", "");

    div_2.appendChild(img);

    div_1.appendChild(div_2);
    var div_3 = create_tag("div", "", "", "food_card_info_box", "", "");
    var ul = create_tag("ul", "", "", "food_info_box_list", "", "");
    var li_burger = create_tag("li", "", "", "", "", name);
    var li_price = create_tag("li", "", "", "", "", "" + price);
    var div_4 = create_tag("ul", "", "", "food_button_box_list", "", "");
    var div_8 = create_tag("li", "", "", "button", "", "Add To Order");
    var div_7 = create_tag("li", "", "", "output", id + "card_total", "" + 0);
    var delete_button = create_tag("li", "", "", "button", "", "delete");
    var comment = create_tag("input", "", "", "text", id + "comment", "comment");
    //adding on click functions to increment the popup quantity
    div_8.onclick = add_food_to_order(id, comment.id);
    delete_button.onclick = delete_food_from_menu(id);
    div_4.appendChild(div_7);
    div_4.appendChild(div_8);

    div_4.appendChild(delete_button);
    div_4.appendChild(comment);
    ul.appendChild(li_burger);
    ul.appendChild(li_price);
    div_3.appendChild(ul);
    div_1.appendChild(div_3);
    div_3.appendChild(div_4)
    ;
    return div_1;
}

//the bellow function is not nice, however I made it as reference in 15 minutes, this is to be reformatted.
//if you do not understand why this is how it is implemented please refer to the following link:
//http://www.howtocreate.co.uk/referencedvariables.html
// this function should be a miniature basket instead of an offline thing,
// sync request all items in a specific order currently stored in the database
//how does one retrieve the correct order?

function update_menu_popup_data() {
    var food_name, total_price, food_price, order_id, order_comment;

    $.ajax({
        url: 'get_menu_popup_data/',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            if (JSON.parse(data["success"]) == "1") {
                try {
                     populate_popup(JSON.parse(data['message']));
                }
                catch (e) {
               //    data is empty
               }
            } else {
                console.log("NO DATA")

            }


        },
        error: function (data) {
        }
    });

}

function populate_popup(data) {
    var popup_tag = document.getElementById("order_list");
    while (popup_tag.firstChild) {
        popup_tag.removeChild(popup_tag.firstChild)
    }
    var order_submitted = data["order_submitted"];
    var order_list = data["table_order"];
    var total_price = data["total_price"];
    for (var order_id in order_list) {
        var order = order_list[order_id];
        //    check if it is already loaded into the page
        //    append it if it doesnt exist
        var li = create_tag("li", "", "", "", "", "");
        var ul = create_tag("ul", "", "", "popup_box_list", "", "");
        var li_name = create_tag("li", "", "", "", "", order["food_name"]);
        var li_price = create_tag("li", "", "", "", "", "" + order["food_price"]);
        var li_comment = create_tag("li", "", "", "", "", "" + order["food_comment"]);
        var delete_button = create_tag("li", "", "", "button", "", "Delete");
        delete_button.onclick = delete_food_from_order(order["order_id"]);
        ul.appendChild(delete_button);
        ul.appendChild(li_name);
        ul.appendChild(li_price);
        ul.appendChild(li_comment);
        li.appendChild(ul);
        popup_tag.appendChild(li);
    }
    var total_tag = document.getElementById("order_total");
    total_tag.innerText = "Total: " + total_price;
    var button = document.getElementById("submit_order");
    button.innerText= "Submit Order (status: " + order_submitted + ")";

}

function submit_order() {

        console.log("submitting order");
        window.location += "submit_order/"

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


//</script>
//<div class="food_card">
//
//    <div class="food_card_img_border">
//
//        <img class= "food_card_img" src="http://pluspng.com/img-png/burger-png-hd-burger-png-image-png-image-466.png" alt="burger">
//    </div>
//
//    <div class="food_card_info_box" >
//        <ul id="menu"class = "food_info_box_list">
//            <li>HTML</li>
//            <li>CSS</li>
//        </ul>
//    </div>
//
//    <div class="food_card_info_box">
//
//        <div class="buttons">
//            <button>-</button>
//            <button>submit</button>
//            <button>+</button>
//        </div>
//
//    </div>
//
//
//</div>


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
        console.log(cat);
        console.log("SECTION ID's: " + i);
        document.getElementById("categories").appendChild(separator);

        document.getElementById("categories").appendChild(section);
    }
}

function load_food_cards_into_sections(categories, food_cards) {
    //load_header_tabs(categories);
    // categories is a dictionary
    var category_dict = {};
    for (var i in categories) {
        var category = categories[i];
        console.log(category);
        var cat_id = category["id"];
        var cat_name = category["name"];
        category_dict[cat_id] = cat_name;
    }
    for (var i in food_cards) {
        var food = food_cards[i];
        console.log("food: " + food);
        var card = add_card(food);
        var category_id = food["category_id"];
        console.log(category_dict);
        console.log("id to push to:" + category_dict[category_id]);
        document.getElementById(category_dict[category_id]).appendChild(card);
    }


}

function add_card_old(food_name, price, id) {
    console.log("Creating Card: " + food_name + " , " + price);
    var div = document.createElement("div");
    div.className = "bunny";
    div.innerHTML = "<div class='image'><h1>" + food_name + "</h1></div> <div class='container'> <h4>" + price + "</h4> <p><button>Add to Order</button></p> </div>";
    return div;
}




