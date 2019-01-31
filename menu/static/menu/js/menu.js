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

function add_card(food_name, price,id) {
    console.log("Creating Card: " + food_name + " , " + price);
    var div = document.createElement("div");
    div.className = "bunny";
    div.innerHTML = "<div class='image'><h1>" + food_name + "</h1></div> <div class='container'> <h4>" + price + "</h4> <p><button>Add to Order</button></p> </div>";
    return div;
}




