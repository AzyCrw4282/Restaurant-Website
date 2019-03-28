function delete_old_table_orders() {
    var container = document.getElementById("database_management");
    var num_days = container.querySelector('input[name="delete_archived_days"]').value;
    $.ajax({
        //Post request made here
        type: "post",
        url: 'delete_old_table_orders/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "days": num_days
        },
        success: function (data) {
            console.log(data);
            update_profit_time_chart();
        },
    });

}
function update_profit_time_chart() {
    /**
     * returns list of date:price of all orders e.g.:
     * [{date1:price},{date2:price},{date3:price}]
     */
    console.log("getting data ");
    $.ajax({
        url: 'get_all_orders_cost_date/',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            if (JSON.parse(data["success"]) == "1") {
                try {
                    console.log("SUCCESS ");
                    update_profit_time_chart_data(JSON.parse(data['message']));
                } catch (e) {
                    //    data is empty
                }
            } else {
                console.log("NO DATA")

            }
        },
        error: function (data) {
            console.log(data)
        }
    });
}
function generate_random_orders() {

    $.ajax({
        //Post request made here
        type: "post",
        url: 'generate_random_orders/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
        },
        success: function (data) {
            console.log(data);
            update_profit_time_chart();
        },
    });
}
function remove_user_from_group(group_name, user_name) {
    $.ajax({
        //Post request made here
        type: "post",
        url: 'remove_from_group/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "user_name": user_name,
            "group_name": group_name
        },
        success: function (data) {
            console.log(data);

        },
    });
}
function delete_account(id) {
    return function () {
        $.ajax({
            //Post request made here
            type: "post",
            url: 'delete_account/',
            data: {
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "id": id,
            },
            success: function (data) {
                delete_account_from_page(id);
            },
        });
    }
}
function delete_fake_orders() {

    $.ajax({
        //Post request made here
        type: "post",
        url: 'delete_fake_orders/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
        },
        success: function (data) {
            console.log(data);
            update_profit_time_chart()
        },
    });
}

function add_user(full_name, email, account_group) {
    add_account_to_page({"username": full_name, "email": email, "group_name": account_group, "id": "reload plz"});
    $.ajax({
        //Post request made here
        type: "post",
        url: 'create_account/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "group_name": account_group,
            "user_name": full_name,
            "email": email,
        },
        success: function (data) {

        },
    });
}
function add_user_to_group(group_name, user_name) {
    $.ajax({
        //Post request made here
        type: "post",
        url: 'add_to_group/',
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "user_name": user_name,
            "group_name": group_name
        },
        success: function (data) {
            console.log(data);
        },
    });
}
