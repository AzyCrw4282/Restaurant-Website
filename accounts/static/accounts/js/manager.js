const month_names = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function redirect_user() {
    console.log("Order Sent");
    var table_code = document.getElementById("table_code").value;

    window.location += table_code + "/"
}

function banner() {
    $(document).ready(function () {

        $("a").on('click', function (event) {
            var heightofbanner = $("#headerContainer").height() + 30;
            console.log(heightofbanner);
            if (this.hash !== "") {
                event.preventDefault();
                var hashlocation = this.hash;

                $('html, body').animate({
                    scrollTop: $(hashlocation).offset().top - heightofbanner
                }, 800);
            }
        });
    });
}

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


$(document).scroll(function () {
    // console.log($(window).scrollTop());
    if ($(window).scrollTop() === 0) {
        $(".banner").show();
        $(".main_containter").css('margin-top', "175px");
        $(".tabs_header").css('top', "100px");
    } else if (!($(window).scrollTop() === 0)) {
        $(".banner").hide();
        $(".main_containter").css('margin-top', "75px");
        $(".tabs_header").css('top', "0px");

    }
});

function turn_off_all_containers() {
    var container = document.getElementById("statistics_container");
    container.style.display = "none";
    var accounts = document.getElementById("accounts_container");
    accounts.style.display = "none";
}

function show_stats() {
    turn_off_all_containers();
    var container = document.getElementById("statistics_container");
    container.style.display = "block";
}

function show_accounts() {
    turn_off_all_containers();
    var accounts = document.getElementById("accounts_container");
    accounts.style.display = "block";

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

function offset_time_by(date, time_step, time_spread) {

    /**
     * date (time to be offset)
     * time_step (value to be offset (hours/days/year e.t.c.)
     * time_spread (integer i.e. how many days/hour/whatever to offset by)
     */
    var milliseconds = 0;
    switch (time_step) {
        case "months":
            var m = date.getMonth();
            date.setMonth(m - time_spread);
            // If still in same month, set date to last day of
            // previous month'
            if (date.getMonth() == m) {
                date.setDate(0);
                date.setHours(0, 0, 0);
                date.setMilliseconds(0);
            }
            break;
        case "minutes":
            date.setMinutes(date.getMinutes() - time_spread);

            break;
        case "hours":
            date.setHours(date.getHours() - time_spread);

            break;
        case "days":
            date.setHours(date.getHours() - 24 * time_spread);

            break;
        case "weeks":
            date.setHours(date.getHours() - 7 * 24 * time_spread);
            break;
        default:
            console.log("error with key: " + time_spread);

    }
    return date;
}

var profit_time_chart_data = [];

function update_profit_time_chart_data(data) {
    profit_time_chart_data = data.reverse();
    process_data_for_profit_time_chart(profit_time_chart_data);
}

function process_data_for_profit_time_chart() {
    var data = profit_time_chart_data;
    console.log("PROCESSING DATA");
    var chart = document.getElementById("profit_time_chart");
    var increments = chart.querySelector('input[name="increments"]').value;
    var graph_type = chart.querySelector('select[name="graph_type"]').value;
    var time_step = chart.querySelector('select[name="time_step"]').value;
    var time_spread = chart.querySelector('input[name="time_spread"]').value;
    var base_date = chart.querySelector('input[name="start_date"]').value;
    console.log("DATE_");
    console.log(base_date);
    if (!base_date) {
        console.log("success");
        base_date = Date.now();

    }
    base_date = new Date(base_date);
    //double check variables to prevent issues.
    if (!(increments > 0 && time_spread > 0)) {
        console.log("INFINITE LOOP PREVENTION");
        return;
    }
    //list of x values (the times)
    var x_labels = [];
    //list of y_values (the total price for each step
    var y_values = [];
    //list of colours for each bar or whatever
    var colours = [];
    var border_colours = [];


    // console.log(base_date);
    // //data is ordered by oldest first;, we need newest first.
    //
    // console.log(offset_time_by(base_date, time_step, time_spread));
    // console.log(data);

    // split the data into the list for each increment until all data has been processed:
    var total_price = 0;
    var counter = 0;
    var old_base_date = new Date(base_date.valueOf());

    for (var i = 0; i < data.length; i += 1) {
        //prevent overloading the graph with too much data
        if (increments <= 0) {
            break;
        }

        var list = data[i];
        var time = list[0];
        var price = list[1];
        var date = new Date(time);
        // console.log(date);
        if (date > base_date && date < old_base_date) {
            // console.log(list);
            counter += 1;
            total_price += price;
        } else if (date < base_date) {
            increments -= 1;
            y_values.push(total_price);
            x_labels.push(base_date.toLocaleString());
            colours.push("rgba(0,255,140,0.2)");
            border_colours.push("rgba(0,255,140,1)");
            old_base_date = new Date(base_date.valueOf());
            base_date = offset_time_by(base_date, time_step, time_spread);
            // console.log(old_base_date);
            // console.log(base_date);
            // console.log("---");
            i -= 1;
            total_price = 0
        }
    }
    console.log(total_price);
    y_values.push(total_price);
    x_labels.push(base_date.toLocaleString());
    colours.push("rgba(0,255,140,0.2)");
    border_colours.push("rgba(0,255,140,1)");
    //push left overs

    var sum = y_values.reduce(function (a, b) {
        return a + b;
    }, 0);
    var average_per_tick = sum / x_labels.length;
    var av = chart.querySelector('output[name="average"]');
    var tot = chart.querySelector('output[name="total"]');
    av.value = "Average-per-tick: " + average_per_tick.toString();
    tot.value = "Sum: " + sum.toString();
    // console.log("showing chart");
    // console.log(x_labels);
    // console.log(y_values);
    // console.log(border_colours);
    show_chart(graph_type, x_labels.reverse(), y_values.reverse(), colours.reverse(), border_colours.reverse(), time_step, time_spread)
}

var profit_price_chart = null;

function show_chart(type, x_labels, y_values, colours, border_colours, period, period_multiple) {
    // update_profit_time_chart();
    var ctx = document.getElementById('order_chart').getContext('2d');
    //list of labels (total prices)
    //list of data (by day?)
    //list of colours rgba(r,g,b,opacity)
    if (profit_price_chart != null) {
        profit_price_chart.destroy();
    }
    profit_price_chart = new Chart(ctx, {
        type: type,
        data: {
            labels: x_labels,
            datasets: [{
                label: 'Price-Time',
                data: y_values,
                backgroundColor: colours,
                borderColor: border_colours,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'time-period per tick:  ' + period_multiple.toString() + " " + period
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'profit ($)'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
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

function delete_account_from_page(id) {
    console.log("DELETING ACCOUNT");
    document.getElementById("user_" + id).style.display = "none";
}

function add_account_to_page(user, all_groups) {
    /**
     * function adds row to html accounts table
     * @param user={"id":id, "username":username, "email":email, "group_list":[name_1,name_2,name_3],}
     * @type {HTMLElement}
     */
    var accounts_container = document.getElementById("accounts_container");
    var user_table = accounts_container.querySelector('form[name="delete_user_form"]');
    var row = document.createElement("div");
    row.id = "user_" + user["id"];
    row.className = "user_manage_container_row";
    var delete_btn_cell = document.createElement("div");
    delete_btn_cell.className = "user_manage_container_row_cell";
    var delete_btn = document.createElement("div");
    delete_btn.innerText = "X";
    delete_btn.className = "user_manage_container_row_delete_btn";
    var id = document.createElement("div");
    id.innerText = user["id"];
    id.className = "user_manage_container_row_id";
    var username = document.createElement("div");
    username.innerText = user["username"];
    username.className = "user_manage_container_row_name";
    var email = document.createElement("div");
    email.innerText = user["email"];
    email.className = "user_manage_container_row_email";
    // insert the group select here
    //<div class="group_list_content">
    //             <button class="table_filter_button" id="table_filter_button">Select Tables</button>
    //             <div class="group_list_dropdown" id="table_filter_content">
    //             </div>
    // </div>

    var group_list_dropdown = document.createElement("div");
    group_list_dropdown.className = "group_list_dropdown";
    group_list_dropdown.innerText = "Groups";
    console.log(user);
    console.log("ALL GROUPS: ");
    console.log(all_groups);
    for (var i in all_groups) {
        var group_list_content = document.createElement("div");
        group_list_content.className = "group_list_content";
        var group_name = all_groups[i];
        console.log(group_name);
        var group_option = document.createElement("a");
        var group_checkbox = document.createElement("input");
        group_checkbox.setAttribute("type", "checkbox");
        group_checkbox.id = "checkbox_" + group_name;
        group_checkbox.checked = false;
        console.log(user["group_list"]);
        console.log(group_name);
        if (user["group_list"].indexOf(group_name)>=0) {
            console.log("HORRAY");
            group_checkbox.checked = true;
        }
        group_option.innerText = group_name;
        //click the checkbox twice to counter act.
        group_checkbox.onclick = click_checkbox(group_checkbox);
        group_option.appendChild(group_checkbox);
        //actually control the selection of the checkbox
        group_option.onclick = update_user_group(group_checkbox, group_name, username.innerText);
        group_list_content.appendChild(group_option);
        group_list_dropdown.appendChild(group_list_content);

    }

    delete_btn.onclick = delete_account(user["id"]);
    delete_btn_cell.appendChild(delete_btn);
    row.appendChild(delete_btn_cell);
    row.appendChild(id);
    row.appendChild(username);
    row.appendChild(email);
    row.appendChild(group_list_dropdown);
    user_table.appendChild(row)
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

function update_user_group(checkbox, group_name, user_name) {
    return function () {
        console.log("UPDATING");
        if (!(checkbox.checked)) {
            checkbox.checked = true;
            add_user_to_group(group_name, user_name)
        } else {
            checkbox.checked = false;
            remove_user_from_group(group_name, user_name)
        }

    }
}


function click_checkbox(checkbox) {
    return function () {
        //clicking the checkbox again so it unclicks itself
        if (!(checkbox.checked)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    }
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


function load_user_table(user_list, all_groups) {
    console.log(user_list);
    var accounts_container = document.getElementById("accounts_container");
    var user_table = accounts_container.querySelector('form[name="delete_user_form"]');
    for (var i in user_list) {
        var user = user_list[i];
        add_account_to_page(user, all_groups)

    }


//                      <div id=user_id class="user_manage_container_row">
//                         <div class="user_manage_container_row_cell">
//                             <div class="user_manage_container_row_delete_btn">X</div>
//                         </div>
//                         <div class="user_manage_container_row_id">12</div>
//                         <div class="user_manage_container_row_name">Octavio</div>
//                         <div class="user_manage_container_row_email">octavio.delser@gmail.com</div>
//                         <div class="user_manage_container_row_group">waiter</div>
//                     </div>

}

function submit_add_user_form() {
    var accounts_container = document.getElementById("accounts_container");
    var add_user_form = accounts_container.querySelector('form[name="add_user_form"]');
    console.log(add_user_form);
    var full_name = add_user_form.querySelector('input[name="full_name"]').value;
    var email = add_user_form.querySelector('input[name="email"]').value;
    var account_group = add_user_form.querySelector('select[name="group_name"]').value;
    console.log(full_name + email + account_group);
    add_user(full_name, email, account_group);
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

function show_add_user_form() {
    var add_user_form = document.getElementById("add_user_form");
    if (add_user_form.style.display == "none") {
        add_user_form.style.display = "block";
    } else if (add_user_form.style.display == "block") {
        add_user_form.style.display = "none";
    } else {
        add_user_form.style.display = "block";

    }
}