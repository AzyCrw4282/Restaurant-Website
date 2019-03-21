//======== AJAX REQUESTS ================================
function delete_food_from_menu(id) {

    return function () {

        $.ajax({
            //Post request made here
            type: "post",
            url: 'delete_food_from_menu/',
            data: {
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "food_id": id
            }
        })

    }
}


function delete_food_from_order(order_id) {
    return function () {
        $.ajax({
            //Post request made here
            type: "post",
            url: 'delete_food_from_order/',
            data: {
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                "order_id": order_id
            },
            success: function (data) {
                console.log(data);
                update_menu_popup_data();
            },
        });
    }
}

function submit_order() {
    // var today = new Date();
    //     var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    //     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //     var date_time = date + ' ' + time;
    console.log("submitting order");
    window.location += "submit_order/"
}


function add_food_to_order(food_id, comment_id) {
    return function () {
        var comment = document.getElementById(comment_id).value;
        var context = {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "food_id": food_id,
            "comment": comment,
        };
        $.ajax({
            //Post request made here
            type: "post",
            url: 'add_food_to_order/',
            data: context,
            success: function (data) {
                console.log(data);
                update_menu_popup_data();
            },
        });
    }
}

//the bellow function is not nice, however I made it as reference in 15 minutes, this is to be reformatted.
//if you do not understand why this is how it is implemented please refer to the following link:
//http://www.howtocreate.co.uk/referencedvariables.html
// this function should be a miniature basket instead of an offline thing,
// sync request all items in a specific order currently stored in the database
//how does one retrieve the correct order?

function update_menu_popup_data() {
    $.ajax({
        url: 'get_menu_popup_data/',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            if (JSON.parse(data["success"]) == "1") {
                try {
                    populate_popup(JSON.parse(data['message']));
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




