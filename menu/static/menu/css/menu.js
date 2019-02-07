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
function get_categories(category_list) {
    console.log("loaded funciton");

    console.log("CATEGORY_LIST OBJECT: " + category_list);
    add_categories(category_list);
    load_header_tabs(category_list);
    load_category_items(category_list);


}

function load_header_tabs(categories) {

    var ul = document.getElementById("tabs_header_list");
    for (var i in categories) {
        // <li><a class="active" href="#mains">Mains</a></li>
        var li = document.createElement("li");
        li.className="active";
        var a = document.createElement("a");
        a.href="#"+i;
        a.innerHTML+=i;
        li.appendChild(a);
        ul.appendChild(li);
    }

}

function add_card(picture_src,name,price,id){
    var div=document.getElementById(id="add_here");
    console.log("hello from script");
    var div_1=create_tag("div","","","food_card",id,"");
    var div_2=create_tag("div","","","food_card_img_border","","");
    var img=create_tag("IMG","",picture_src ,"food_card_img","","")
    div_2.appendChild(img);
    div_1.appendChild(div_2);
    var div_3 =create_tag("div","","","food_card_info_box","","");
    var ul=create_tag("ul","","","food_info_box_list","menu","");
    var li_burger=create_tag("li","","","","",name);
    var li_price=create_tag("li","","","","",price);
    ul.appendChild(li_burger);
    ul.appendChild(li_price);
    div_3.appendChild(ul);
    div_1.appendChild(div_3);
    div.appendChild(div_1);

}
function create_cards(foods){
    [
        {"tag_name":tag_name,"href":href,"src":src,"tag_class":tag_class,"id":id,"text":text}
    ]
    for ()
}

function create_tag(tag_name,href,src,tag_class,id,text){
    var tag=  document.createElement(tag_name);
    if(href.length>0){
            tag.href=href;
    }
    if(tag_class.length>0){
            tag.className=tag_class;
    }
    if(src.length>0){
         console.log(src);
            tag.src=src;
            // tag.alt="burger";
    }if(id.length>0){
            tag.id=id;
    }if(text.length>0){
            tag.innerText=text;
    }if(href.length>0){
            tag.href=href;
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




function add_categories(categories) {
    for (i in categories) {
        var section = document.createElement("SECTION");
        section.id = i;
        console.log("SECTION ID's: " + i);
        document.getElementById("categories").appendChild(section);
    }
}

function load_category_items(categories) {

    // these are the objects, I need to gain access to each category as vars then
//add each food in each category as a list
//for now keep the data structure
//Pseudo:
// for each cat:
// var what= {"cat.name":[{cat.values},{cat.values},{cat.values}]
// cat.values : "schema_element_name: schema_element_value"


    //get categories from db then test once the bellow works fine
    // var categories = {
    //     "mains": [
    //         {"name": "Tacos with cereal", "price": "£5"},
    //         {"name": "Tacos", "price": "£2"},
    //         {"name": "Tacos with toast", "price": "£3"}],
    //     "sides": [
    //         {"name": "Cereal with no Tacos", "price": "£5"},
    //         {"name": "Tacos with no Tacos", "price": "£2"},
    //         {"name": "Toast with no Tacos", "price": "£3"}],
    //     "drinks": [
    //         {"name": "Vodka", "price": "£5"},
    //         {"name": "Pepsi", "price": "£2"},
    //         {"name": "7up", "price": "£3"}],
    //     "deals": [
    //         {"name": "The non-non-mexican", "price": "10% off "},
    //         {"name": "The non-mexican", "price": "%50 off"},
    //         {"name": "The mexican", "price": "100% off"}]
    //
    // };
    add_categories(categories);
    //load_header_tabs(categories);
    // categories is a dictionary
    for (var i in categories) {
        console.log("Category Name: " + i);
        var category_name = i;
        var category_object = categories[i];
        //category_object is a list of dictionaries
        for (j in category_object) {
            console.log("J " + j);
            var category_object_dict = category_object[j];
            console.log("dict " + category_object_dict);
            var card = add_card(category_object_dict.name, category_object_dict.price);
            document.getElementById(i).appendChild(card);
        }

    }

}

function add_card_old(food_name, price,id) {
    console.log("Creating Card: " + food_name + " , " + price);
    var div = document.createElement("div");
    div.className = "bunny";
    div.innerHTML = "<div class='image'><h1>" + food_name + "</h1></div> <div class='container'> <h4>" + price + "</h4> <p><button>Add to Order</button></p> </div>";
    return div;
}




