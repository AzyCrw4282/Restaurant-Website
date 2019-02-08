/*global document */
//EXAMPLE JAVASCRIPT OR WHATEVER TO BE IMPLEMENTED, FEEL FREE TO USE AJAX,
//BEAR IN MIND, THE METHOD HAS TO WORK WITH CSRF_TOKEN

// #
// #
// #
// # waiter( _id , Order_id , Table_id , Customer_id )
/*
I'M SEPARATING ALL THE ADD FUNCTIONS, THIS COULD BE COMBINED WITH A SWITCH
STATEMENT, THIS WILL MAKE THE CODE MUCH SHORTER AND EVERYTHING ELSE
WOULD ONLY BE NEEDED TO BE CODED ONCE, HOWEVER THIS IS UP TO THE PERSON DOING JS
TO DECIDE, I'M JUST DOING THESE SO THERE IS NO EXCUSE FOR DB COMMUNICATION.
 */

// # Order( _id , Food_id , Table_id , Customer_id , time_of_order )

//Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )

// # Customer ( _id , name , Table_id)

// FoodCategory( _id, name)
// function add_table_order(time, orders) {
//
//     $.ajax({
//         //Post request made here
//         type: "post",
//         url: 'delete_table_order/',
//         data: {
//             csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
//             "time": time,
//             "orders": orders,
//
//             success:
//                 function () {
//                     console.log("successful");
//                 },
//             error: function () {
//                 console.log("failure");
//
//             }
//
//         });
// }


jQuery(document).ready(function () {
// This button will increment the value
    $('.qtyplus').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name=' + fieldName + ']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[name=' + fieldName + ']').val(0);
        }
    });
// This button will decrement the value till 0
    $(".qtyminus").click(function (e) {

        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            $('input[name=' + fieldName + ']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[name=' + fieldName + ']').val(0);
        }
    });


    document.querySelector('.btn-hold').addEventListener('click', function () {
        document.querySelector('.btn-hold').textContent = 'Order Sent';
        document.querySelector('.final-score').placeholder = 'Pending';

    });


    document.querySelector('.btn-new').addEventListener('click', function () {
        document.querySelector('.btn-hold').textContent = 'Send to Chef';
        document.querySelector('.final-score').placeholder = 'Order Status';
        $('input[name=' + fieldName + ']').val(0);
        //document.querySelector('.player-current-score').textContent = '0';
        //document.querySelector('.player-current-score2').textContent = '0';


    });


})
;
