var qty=0;

function take_order(val){
    qty += val;
        $.ajax({
        //Post request made here
        type: "post",
        url: 'add_table_order/',// To be changed here

        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),





            //"food_id": food_id,
            //"food_comment" : comment
        }


})

}