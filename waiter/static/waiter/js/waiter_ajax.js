//This is a JS file for retrieving data in json format

// SECTIONS OF THIS IFLE:
// INSERTING ITEMS INTO THE DATABASE
// ON CLICK EVENTS (FOR THE BUTTONS IN THE WAITER PAGE

// ========= INSERTING ITEMS INTO THE DATABASE=========
// function for add_food not added - octavio's req
function deselect_table(table_id) {
    $.ajax({
        //Post request
        type: "post",
        url: 'deselect_table/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_id":table_id
        }
    })
}
function select_table(table_id) {
    $.ajax({
        //Post request
        type: "post",
        url: 'select_table/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_id":table_id
        }
    })
}
function add_food() {

    $.ajax({
        //Post request
        type: "post",
        url: 'add_food/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),

        }
    })
}


//post method goes from here to db_insert.js . addtable()
function add_table() {

    $.ajax({
        //Post request
        type: "post",
        url: 'add_table/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_id": document.getElementById("table_id").value,
            "table_number": document.getElementById("table_number").value
        }
    })
}


function delete_table(table_id) {
    table = [
        {"table": "table_id"}
    ];

    $.ajax({
        //Post rupdate_waiter_cardequest made here
        type: "post",
        url: 'delete_table/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_id": table_id
        }
    })
}


function add_food_information(food_information_name) {
    FoodInfo = [
        {"foodInfo": "food_information_name"}
    ];

    $.ajax({
        //Post request made here
        type: "post",
        url: 'add_food_information/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_information_name": food_information_name
        }
    })
}

//Unsure on how these id's are being passed
function delete_food_information(food_information_id) {

    $.ajax({
        //Post request made here
        type: "post",
        url: 'delete_food_information/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_information_id": food_information_id
        }
    })
}

function add_food_category(food_category_name) {
    $.ajax({
        //Post request made here
        type: "post",
        url: 'add_food_category/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_category_name": document.getElementById("food_category_name").value

        }
    })
}

function delete_food_category(food_category_id) {

    $.ajax({
        //Post request made here
        type: "post",
        url: 'delete_food_category/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_category_id": food_category_id
        }
    })
}

function delete_food(food_id) {
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

function delete_table_order(table_order_id) {

    $.ajax({
        //Post request made here
        type: "post",
        url: 'delete_table_order/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_order_id": table_order_id
        }
    })
}

//========== FUNCTIONS UPDATING THE WAITER PAGE AND ON CLICK EVENTS=================


function change_table_order_state(table_order_id, state) {

    $.ajax({
        type: "post",
        url: 'change_table_order_state/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_order_id": table_order_id,
            "state": state
        }
    });
}

// function get_and_update_table_order_states(){
//      $.ajax({
//         type: "GET",
//         url: 'get_table_order_states/',
//         dataType:'json',
//         success: function (data) {
//             if (JSON.parse(data["success"]) == "1") {
//                 update_table_order_states(JSON.parse(data['message']));//To populate called here
//             } else {
//                 console.log("NO DATA")
//             }
//         },
//         error: function (data) {
//         }
//
//     });
// }$.a
function add_food_information_to_food(food_li, info_li) {

    $.ajax({
        type: "post",
        url: 'add_information_to_food/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "information_list":JSON.stringify( info_li),
            "food_list": JSON.stringify( food_li)
        }
    });
}


function update_table_order_list(table_order_list) {
    $.ajax({
        type: "GET",
        url: 'get_table_order_list/',
        dataType: 'json',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "table_order_list": table_order_list
        },
        success: function (data) {
            if (JSON.parse(data["success"]) == "1") {
                var data = JSON.parse(data['message']);

                update_cards(data);//To populate called here
            } else {
                // console.log("NO DATA")
            }
        },
        error: function (data) {
        }

    });
}











