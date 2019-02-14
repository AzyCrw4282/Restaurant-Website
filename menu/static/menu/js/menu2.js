var foodCard = {
    "orders": [
        {"price": "8.00", "foodtype": "moRE MORE More", "allergens": "nuts"},
        {"price": "5.00", "foodtype": "Rice and NO MORE", "allergens": "nuts"},
        {"price": "10.00", "foodtype": "Rice and More MSn", "allergens": "protien"}]
}

var sidesCard = {
    "sides": [
        {"price": "1.00", "foodtype": "coke", "allergens": "coke"},
        {"price": "1.00", "foodtype": "fanta", "allergens": "orange"},
        {"price": "1.00", "foodtype": "tango", "allergens": "orange"}]
}

function createCard(id, price, foodtype, allergens) {

    var div = document.createElement("div");
    div.className = "food_card";
    div.innerHTML = "<div> <h3 id=" + id + "> " + foodtype + " </h3> </div> " +
        "<div class='food_card_img_border'> <img class= 'food_card_img' src='https://www.mexicanplease.com/wp-content/uploads/2017/09/mexican-picadillo-after-cooking-over-rice.jpg' alt='burger'> " +
        "</div> <div> <button onclick='addToPrice(" + price + "," + id + ")' type='button' class='block'> Add to Order " + price + " </button> </div>";
    return div;


}

function myFunction(element) {
    var popup = document.getElementById(element);
    popup.classList.toggle("show");
}

function card_gen() {

    for (var x in foodCard.orders) {

        var price = foodCard.orders[x].price;
        var foodtype = foodCard.orders[x].foodtype;
        var allergens = foodCard.orders[x].allergens;
        var ordercard = createCard(x, price, foodtype, allergens);
        document.getElementById("main").appendChild(ordercard);
    }

}

function addToPrice(foodprice, foodID) {
    var curPrice = document.getElementById("total").textContent;
    var newPrice = parseInt(curPrice) + parseInt(foodprice);
    document.getElementById("total").innerHTML = newPrice;
    var id = document.getElementById(foodID).innerText;
    addToCart(id)
}

function addToCart(foodname, comment_id) {
    let list = document.createElement("ul");
    list.className = "card";
    list.innerHTML = "<li>" + foodname + "</li>";
    let element = document.getElementById("basketInfo");
    element.appendChild(list);

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var date_time = date + ' ' + time;
    var context = {
        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
        "food_id": food_id,
        "comment": comment,
        "time": date_time

    };


    $.ajax({
        //Post request made here
        type: "post",
        url: 'add_food_to_order/',
        data: context
    });



}