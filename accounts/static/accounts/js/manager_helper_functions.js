function get_date_list(increments, base_date, time_step, time_spread) {
    var date_list = [];

    while (increments > 0) {
        increments -= 1;
        date_list.push(base_date.toString());
        base_date = offset_time_by(base_date, time_step, time_spread);
    }
    return date_list;
}
function format_date_list(date_list) {
    var formatted = [];
    for (var i = 0; i < date_list.length; i += 1) {
        var date = new Date(date_list[i]);
        formatted.push(date.toLocaleString())
    }
    return formatted;
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
