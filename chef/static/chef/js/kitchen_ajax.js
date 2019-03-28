/**
 * This function is used to change the state of the table order in the backend.
 * @param table_order_id - this represents a value for the id for the order linked to a table.
 * @param state - this represents a value for the state of the food i.e cooked.
 * @returns {Function}
 */

function change_table_order_state(table_order_id, state) {
    return function () {
        $.ajax({
            type: "post",
            url: 'change_table_order_state/',
            data: {
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "table_order_id": table_order_id,
                "state": state
            },
            success: function(data){
                console.log("SUCCESS IN CHANGING STATE: ",data);
                //reload the page to remove the card from all the items :D
                location.reload();
            }
        });

    }

}

/**
 * This function is used to change the state of the order in the back end
 * @param order_id - this represents a value for the id of the order.
 * @param state - this represents a value for the state of the food i.e, cooked.
 * @returns {Function}
 */

function change_order_state(order_id, state) {
    return function () {
        console.log("changing state of: "+order_id+" : "+state);
        $.ajax({
            type: "post",
            url: 'change_order_state/',
            data: {
                 csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "order_id": order_id,
                "state": state
            },
            success: function(data){
                update_order_states();
            }

        });


    }

}


function update_table_order_states() {
//    returns a dictionary the id being the order id and the state as per the config file
//    example return:
//     [
//         id,id,id,id
//     ]
    $.ajax({
        url: 'get_table_order_states/',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            if (JSON.parse(data["success"]) == "1") {
                try {
                    var orders=JSON.parse(data["message"]);
                    update_table_order_cards(orders);
                //    enter your function with what you wanna do with the data here e.g.:
                //    do_something(orders)
                } catch (e) {
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

function update_order_states() {
//    returns a dictionary the id being the order id and the state as per the config file
//    example return:
//     {
//         "1":"done",
//         "2":"cooking",
//         "3":"cooking",
//         "4":"done"
//     }
    $.ajax({
        url: 'get_order_states/',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            if (JSON.parse(data["success"]) == "1") {
                try {
                    var orders=JSON.parse(data["message"]);
                    update_order_list_items(orders);
                //    enter your function with what you wanna do with the data here e.g.:
                //    do_something(orders)
                } catch (e) {
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






