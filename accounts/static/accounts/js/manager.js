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
                    process_data_for_profit_time_chart(JSON.parse(data['message']));
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
            date.setMonth(date.getMonth() - time_step);
            // If still in same month, set date to last day of
            // previous month'
            if (date.getMonth() == m) {
                date.setDate(0);
                date.setHours(0, 0, 0);
                date.setMilliseconds(0);
            }
            break;
        case "minutes":
            milliseconds = 1000 * 60;
            date -= milliseconds * time_spread;

            break;
        case "hours":
            milliseconds = 1000 * 60 * 60;
            date.setHours(date.getHours() - time_step);
            date -= milliseconds * time_spread;

            break;
        case "days":
            milliseconds = 1000 * 60 * 60 * 24;
            date -= milliseconds * time_spread;
            break;
        case "weeks":
            milliseconds = 1000 * 60 * 60 * 24 * 7;
            date -= milliseconds * time_spread;
            break;
        default:
            console.log("error with key: "+time_step);

    }
    return date;

}

function process_data_for_profit_time_chart(data) {
    console.log("PROCESSING DATA");
    var chart = document.getElementById("profit_time_chart");
    var increments = chart.querySelector('input[name="increments"]').value;
    var graph_type = chart.querySelector('select[name="graph_type"]').value;
    var time_step = chart.querySelector('select[name="time_step"]').value;
    var time_spread = chart.querySelector('input[name="time_spread"]').value;
    console.log(increments);
    console.log(graph_type);
    console.log(time_step);
    console.log(time_spread);
    //list of x values (the times)
    var x_labels = [];
    //list of y_values (the total price for each step
    var y_values = [];
    //list of colours for each bar or whatever
    var colours = [];

    get_time_offset(time_step, time_spread);
    var date_offset = offset;
    var base_date = new Date(Date.now());
    console.log(base_date);
    //data is ordered by oldest first;, we need newest first.
    data = data.reverse();
    console.log(data);
    for (var i in data) {
        var list = data[i];
        var time = list[0];
        var price = list[1];
        var date = new Date(time);
        console.log(date);
        console.log(date.getFullYear());
        console.log(month_names[date.getMonth()]);
        console.log(date.getDay());
        console.log(date.getHours());
        console.log(price);


    }
}

function show_chart() {
    update_profit_time_chart();
    var ctx = document.getElementById('order_chart').getContext('2d');
    //list of labels (total prices)
    //list of data (by day?)
    //list of colours rgba(r,g,b,opacity)
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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