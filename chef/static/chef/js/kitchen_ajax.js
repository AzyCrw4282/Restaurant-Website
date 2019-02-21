function change_table_order_state(table_order_id, state) {
    return function () {
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

}

function change_order_state(order_id, state) {
    return function () {
        $.ajax({
            type: "post",
            url: 'change_order_state/',
            data: {
                 csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "order_id": order_id,
                "state": state
            }
        });
    }
}


function get_order_states() {
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
                //    enter your function with what you wanna do with the data here e.g.:
                //    do_something(data)
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