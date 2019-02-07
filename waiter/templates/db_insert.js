//This is a JS file for retrieving data in json format

/*

Data will be listed in a dictionary format.

E.g.
# {
#   "comment":int,
#   "orders": [
#       {"id":int,"comment":comment },
#       {"id":int,"comment":comment }
#   ]
# }




// function for add_food not added - octavio's req
function add_food(){



}

 */



//post method goes from here to db_insert.js . addtable()
function add_table(data){

    $.ajax({
    //Post request
        type: "post",
        url: 'add_table/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),

        }
    })
}


function delete_table(table_id){
    table = [
        {"table" : "table_id"}
    ];

    $.ajax({
    //Post request made here
        type: "post",
        url: 'delete_table/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_id" : table_id
        }
    })
}


function add_food_information(food_information_name){
    FoodInfo = [
        {"foodInfo" : "food_information_name"}
    ];

    $.ajax({
    //Post request made here
        type: "post",
        url: 'add_food_information/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_information_name" : food_information_name
        }
    })
}

function delete_food_information(food_information_id){

    $.ajax({
    //Post request made here
        type: "post",
        url: 'delete_food_information/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_information_id" : food_information_id
        }
    })
}

function add_food_category(food_category_name){

    $.ajax({
    //Post request made here
        type: "post",
        url: 'add_food_category/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_category_name" : food_category_name
        }
    })
}

function delete_food_category(food_category_id){

    $.ajax({
    //Post request made here
        type: "post",
        url: 'delete_food_category/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_category_id" : food_category_id
        }
    })
}

function delete_food(food_id){
    $.ajax({
    //Post request made here
        type: "post",
        url: 'delete_food/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_id": food_id
        }
    })
}

function delete_table_order(table_order_id){

    $.ajax({
    //Post request made here
        type: "post",
        url: 'delete_table_order/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_order_id" : table_order_id
        }
    })
}










