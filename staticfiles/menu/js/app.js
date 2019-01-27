/*global document */
//EXAMPLE JAVASCRIPT OR WHATEVER TO BE IMPLEMENTED, FEEL FREE TO USE AJAX,
//BEAR IN MIND, THE METHOD HAS TO WORK WITH CSRF_TOKEN
//FIND ONE ONLINE OR WHATEVER, THIS IS WHAT I FOUND FROM AN ONLINE WEBSITE.
// $.post( "{% url 'add_table' %}",
// {
//     csrfmiddlewaretoken: '{{csrf_token}}' ,
//     max_people : 3, //pass the max number of people here
// },
// function(data) {
//     if(data.status == 1){
//
//     }
//     else{
//         // error! Do something
//     }
// });
//Table( _id , max_customers, )
// function add_table() {
//     $.ajax({
//         type: "POST",
//         url: '{% url add_table %}',
//         dataType: "json",
//         async: true,
//         data: JSON.stringify({
//             csrfmiddlewaretoken: "{{ csrf_token }}",
//             max_customers: $("#max_customers").val()
//         }),
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         success:
//             function () {
//                 allert("successful");
//             },
//         error: function () {
//             allert("failure");
//
//         }
//
//     });
//     alert("sent");
//
// }

jQuery(document).ready(function () {
    $('.bombsaway').click(function (e) {
        e.preventDefault();
        fieldName = $(this).attr('field');
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());

        $.ajax({
            url: '/add_table/',
            data: {
                csrfmiddlewaretoken: '{{ csrf_token }}',
                max_customers: $('#max_customers').val()

            },
            type: 'POST',
            dataType: "json",
        }).done(function (response) {
            alert(response)
        });


    });
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


});
