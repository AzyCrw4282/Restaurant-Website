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
        console.log(cat_name);
        a.href = "#" + cat_name;
        a.innerHTML += cat_name;
        li.appendChild(a);
        ul.appendChild(li);
    }
}


function add_card(card) {
    console.log("static: " + DJANGO_STATIC_URL);
    var src = card["picture"];
    var name = card["name"];
    var price = card["price"];
    var id = card["id"];
    console.log("hello from script");
    var div_1 = create_tag("div", "", "", "food_card", id, "");
    var div_2 = create_tag("div", "", "", "food_card_img_border", "", "");
    var img = create_tag("IMG", "", /static/ + src, "food_card_img", "", "");
    div_2.appendChild(img);
    div_1.appendChild(div_2);
    var div_3 = create_tag("div", "", "", "food_card_info_box", "", "");
    var ul = create_tag("ul", "", "", "food_info_box_list", "menu", "");
    var li_burger = create_tag("li", "", "", "", "", name);
    var li_price = create_tag("li", "", "", "", "", "" + price);
    var div_4 = create_tag("ul", "", "", "food_card_info_list", "", "");
    var div_6 = create_tag("li", "", "", "button", "", "-");
    var div_7 = create_tag("li", "", "", "button", "", "submit");
        var div_8 = create_tag("li", "", "", "button", "", "+");

    div_4.appendChild(div_6);
    div_4.appendChild(div_7);
    div_4.appendChild(div_8);

    ul.appendChild(li_burger);
    ul.appendChild(li_price);
    div_3.appendChild(ul);
    div_1.appendChild(div_3);
    div_3.appendChild(div_4)
    ;
    return div_1;
}

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
        var separator = document.createElement("div");
        separator.className = "food_card_separator";
        separator.innerText = cat["name"]
        separator.id = cat["name"];
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




