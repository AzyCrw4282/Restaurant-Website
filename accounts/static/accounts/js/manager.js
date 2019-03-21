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

function show_stats() {
    var container = document.getElementById("statistics_container");
    container.style.display = "block";
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
    var base_date =  chart.querySelector('input[name="start_date"]').value;
    console.log("DATE_");
    console.log(base_date);
    if(!base_date){
        console.log("success");
        base_date=Date.now();

    }
    base_date=new Date(base_date);
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


    console.log(base_date);
    //data is ordered by oldest first;, we need newest first.

    console.log(offset_time_by(base_date, time_step, time_spread));
    console.log(data);

    // split the data into the list for each increment until all data has been processed:
    var total_price = 0;
    var counter = 0;
    for (var i = 0; i < data.length; i += 1) {
        //prevent overloading the graph with too much data
        if (increments <= 0) {
            break;
        }

        var list = data[i];
        var time = list[0];
        var price = list[1];
        var date = new Date(time);
        if (date > base_date) {
            // console.log(list);
            counter += 1;
            total_price += price;
        } else {
            increments -= 1;
            y_values.push(total_price);
            x_labels.push(base_date.toLocaleString());
            colours.push("rgba(0,255,140,0.2)");
            border_colours.push("rgba(0,255,140,1)");
            base_date = offset_time_by(base_date, time_step, time_spread);
            i -= 1;
            total_price = 0
        }
    }
    console.log(counter);
    y_values.push(total_price);
    x_labels.push(base_date.toLocaleString());
    colours.push("rgba(0,255,140,0.2)");
    border_colours.push("rgba(0,255,140,1)");
    //push left overs

    // console.log("showing chart");
    // console.log(x_labels);
    // console.log(y_values);
    // console.log(border_colours);
    show_chart(graph_type, x_labels.reverse(), y_values.reverse(), colours.reverse(), border_colours.reverse())
}
var profit_price_chart=null;
function show_chart(type, x_labels, y_values, colours, border_colours) {
    // update_profit_time_chart();
    var ctx = document.getElementById('order_chart').getContext('2d');
    //list of labels (total prices)
    //list of data (by day?)
    //list of colours rgba(r,g,b,opacity)
    if(profit_price_chart!=null){
        profit_price_chart.destroy();
    }
    profit_price_chart =new Chart(ctx, {
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
                yAxes: [{
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