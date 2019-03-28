var profit_time_chart_data = {};
//format:
// {"waiter":[{"time":time, "total":total},{},{}],{}}

function update_profit_time_chart_data(data) {
    console.log(data);
    profit_time_chart_data = {};
    //data=[{"total":total,"time":time,"waiter":waiter},{}]
    for (var i = 0; i < data.length; i += 1) {
        var dict = data[i];
        var waiter_username = dict["waiter"];

        var time = dict["time"];
        var total = dict["total"];
        if (waiter_username in profit_time_chart_data) {
            profit_time_chart_data[waiter_username].push({"time": time, "total": total});
        } else {
            profit_time_chart_data[waiter_username] = [{"time": time, "total": total}];
        }
    }
    var chart = document.getElementById("profit_time_chart");
    var option_list = chart.querySelector('select[name="waiter_list"]');
    console.log(option_list);
    while (option_list.firstChild) {
        option_list.removeChild(option_list.firstChild);
    }
    for (var i in profit_time_chart_data) {
        var waiter_option = document.createElement("option");
        waiter_option.innerText = i;
        waiter_option.value = i;
        waiter_option.selected = true;
        option_list.appendChild(waiter_option);
    }

    console.log();
    create_data_sets();
}

var profit_price_chart = null;

function create_data_sets() {
    console.log("PROCESSING DATA");
    var chart = document.getElementById("profit_time_chart");
    var increments = chart.querySelector('input[name="increments"]').value;
    var graph_type = chart.querySelector('select[name="graph_type"]').value;
    var time_step = chart.querySelector('select[name="time_step"]').value;
    var time_spread = chart.querySelector('input[name="time_spread"]').value;
    var base_date = chart.querySelector('input[name="start_date"]').value;
    var waiters = [];
    var waiter_selected_list = chart.querySelector('select[name="waiter_list"]');
    var children = waiter_selected_list.children;
    for (var i = 0; i < children.length; i += 1) {
        if (children[i].selected) {
            waiters.push(children[i].value);
        }
    }
    var style = chart.querySelector('select[name="display_style"]').value;

    if (!base_date) {
        base_date = Date.now();
    }
    base_date = new Date(base_date);
    //double check variables to prevent issues.
    if (!(increments > 0 && time_spread > 0)) {
        return;
    }

    // split the data into the list for each increment until all data has been processed:
    // get the list of usernames
    var data_sets = [];
    var date_list = get_date_list(increments, base_date, time_step, time_spread);
    date_list.reverse();
    for (var i = 0; i < waiters.length; i += 1) {
        var waiter_username = waiters[i];
        if (waiter_username in profit_time_chart_data) {
            var data = profit_time_chart_data[waiter_username];

            var data_set = create_dataset(data, date_list, waiter_username);

            data_sets.push(data_set);
        }
    }
    var total_sum = 0;
    for (var i = 0; i < data_sets.length; i += 1) {
        var sum = data_sets[i].data.reduce(function (a, b) {
            return a + b;
        }, 0);
        total_sum += sum
    }

    var average_per_tick = total_sum / increments;
    var av = chart.querySelector('output[name="average"]');
    var tot = chart.querySelector('output[name="total"]');
    av.value = "Average-per-tick: " + average_per_tick.toString();
    tot.value = "Sum: " + total_sum.toString();
    //type, data_set_list,labels, period, period_multiple
    var labels = format_date_list(date_list);
    show_chart(graph_type, style, data_sets, labels, time_step, time_spread)
}

function create_dataset(data, date_list, label) {

    // console.log(data);
    // console.log(date_list);
    var data_list = [];
    var data_dict = {};
    var random_r = Math.floor((Math.random() * 254) + 1);
    var random_g = Math.floor((Math.random() * 254) + 1);
    var random_b = Math.floor((Math.random() * 254) + 1);

    var background_colour = "rgba(" + random_r.toString() + "," + random_g.toString() + "," + random_b.toString() + ",0.6)";
    var border_colour = "rgba(0,100,100,1)";
    // console.log("SORTING +++++++++++++++++++++++++++++++++")
    for (var k = 0; k < date_list.length; k += 1) {
        data_dict[date_list[k]] = 0;
        var older_date = new Date(date_list[k]);
        var newer_date = new Date(date_list[k + 1]);
        // console.log("GETTING DATES BETWEEN: ");
        // console.log(older_date);
        // console.log(newer_date);
        for (var i = 0; i < data.length; i += 1) {
            //prevent overloading the graph with too much data
            var list = data[i];
            var time = list["time"];
            var price = list["total"];
            var date = new Date(time);
            if (date > older_date && date < newer_date) {
                // console.log(date);

                data_dict[date_list[k]] += price
            }
        }
    }
    // console.log(data_dict);
    for (var k in data_dict) {
        data_list.push(data_dict[k])
    }


    // console.log(data_list);

    return {
        label: label,
        data: data_list,
        backgroundColor: background_colour,
        borderColor: border_colour,
        borderWidth: 1
    }
}



function show_chart(type, style, data_set_list, labels, period, period_multiple) {
    // update_profit_time_chart();
    var ctx = document.getElementById('order_chart').getContext('2d');
    if (profit_price_chart != null) {
        profit_price_chart.destroy();
    }
    var user_data = {
        labels: labels,
        datasets: data_set_list
    };
    var chart_options = {
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
    };
    if (style == "stacked") {
        chart_options.scales.xAxes[0]["stacked"] = true;
        chart_options.scales.yAxes[0]["stacked"] = true;
    }
    profit_price_chart = new Chart(ctx, {
        type: type,
        data: user_data,
        options: chart_options
    });

}


