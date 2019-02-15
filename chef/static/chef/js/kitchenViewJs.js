//     $(function () {
//     $("#header").load("banner.html");
// });
// var table_order_list = [
//     {
//         "order_id": 1,
//         "table_number": 1,
//         "orders": [
//             {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             }, {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             }, {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             }, {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             },
//         ]
//     },
//     {
//         "id": 1,
//         "table_number": 1,
//         "orders": [
//             {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             }, {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             }, {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             }, {
//                 "order_id": "order id", "comment": "its a comment", "food_name": "it's a name"
//             },
//         ]
//     },
// ];

function load_data(table_order_list) {
    load_cards(table_order_list);
    list_toggles();
}
function list_toggles(){
     var list = document.querySelector('ul');
        list.addEventListener('click', function(ev) {
          if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
          }
        }, false);

}
function load_cards(data) {
    console.log(data);
    var table_orders=data["table_orders"];
    console.log(table_orders);

    for (var i in table_orders) {
        var table_order = table_orders[i];
        console.log(table_order);
        var table_order_id = table_order["id"];
        var table_order_comment = table_order["comment"];
        var table_order_time = table_order["time"];
        var table_order_table_number = table_order["table_number"];
        var table_order_order_list = table_order["orders"];
        console.log(table_order_order_list);
        add_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list);
    }
}

function add_card(table_order_id, table_order_comment, table_order_time, table_order_table_number, table_order_order_list) {
    console.log("adding card");
    console.log(table_order_order_list);
    var div = document.createElement("div");
    var time_field=document.createElement("h4");
    time_field.innerText="Time: "+table_order_time;
    div.appendChild(time_field);
    var table_number=document.createElement("h4");
    table_number.innerText="Table Number: "+table_order_table_number;
    div.appendChild(table_number);
    div.id = table_order_id;
    div.className = "card";

    var div_img = document.createElement("div");
    div_img.className = "image";
    var div_img_ul = document.createElement("ul");
    for (var i in table_order_order_list) {
        var order_item = table_order_order_list[i];
        console.log(order_item);
        var order_id = order_item["id"];
        var food_name = order_item["food_name"];
        var comment = order_item["comment"];
        var order_li = document.createElement("li");
        order_li.id = "" + order_id;
        order_li.innerText = food_name + " : " + comment ;
        div_img_ul.appendChild(order_li);
    }
    div_img.appendChild(div_img_ul);
    div.appendChild(div_img);

    var div_container = document.createElement("div");
    div_container.className = "container";
    var div_container_button_c = document.createElement("button");
    div_container_button_c.onclick = confirmCancel(table_order_id);
    div_container_button_c.className = "cancel";
    div_container_button_c.innerText += "Cancel";
    var div_container_p = document.createElement("p");
    div_container_p.appendChild(div_container_button_c);
    div_container.appendChild(div_container_p);

    div_container_p = document.createElement("p");
    var div_container_button = document.createElement("button");
    div_container_button.onclick = confirmDone(table_order_id);
    div_container_button.className = "done";
    div_container_button.innerText += "Done";
    div_container_p.appendChild(div_container_button);
    div_container.appendChild(div_container_p);
    div.appendChild(div_container);


    // div.innerHTML = "" +
    //     "<div class='image'>" +
    //     " <ul>" +
    //     " <li>Table id : " + id + "</li>" +
    //     " <li>" + order1 + "</li>  " +
    //     "</ul>" +
    //     "</div> " +
    //     "<div class='container'> " +
    //     "<p>" +
    //     "<button id=" + id + " class='cancel' onclick='confirmCancel(this.id)'>Cancel" +
    //     "</button>" +
    //     "</p> " +
    //     "<p>" +
    //     "<button id=" + id + " class='done'onclick='confirmDone(this.id)'>Done" +
    //     "</button>" +
    //     " </p>" +
    //     " </div>";
    var a = document.getElementById("card_container");
    a.appendChild(div);



}
function add_listeners(){
     var list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
}

// var main  = {"orders":[
//                { "foodname":"Tacos with cereal", "price":"£5" },
//                { "foodname":"Tacos", "price":"£2" },
//                { "foodname":"Tacos with toast", "price":"£3" }]}
//
//        var side  = {"sides":[
//                { "sidename":"Cereal with no Tacos", "price":"£5" },
//                { "sidename":"Tacos with no Tacos", "price": "£2" },
//                { "sidename":"Toast with no Tacos", "price":"£3" }]}
//
//        var drink  = {"drinks":[
//                { "drinnkname":"Vodka", "price":"£5" },
//                { "drinkname":"Pepsi", "price":"£2" },
//                { "drinkname":"7up", "price":"£3" }]}
//
//        var deal  = {"deals":[
//                { "dealname":"The non-non-mexican", "deal":"10% off " },
//                { "dealname":"The non-mexican", "deal":"%50 off" },
//                { "dealname":"The mexican", "deal":"100% off" }]}
//
//        function newCard(id,menuitem,price) {
//            console.log("test");
//            var div = document.createElement("div");
//            //div.id = id;
//            div.className = "card";
//        div.innerHTML = "<div class='image'><h1>"+ menuitem +"</h1></div> <div class='container'> <h4>" + price + "</h4> <p><button>Cancel</p> <p><button>Done</button> </p> </div>";
//            return div;
//        }
//
// for (var i in main.mains) {
//     var item = main.mains[i].foodname;
//     var price = main.mains[i].price;
//     var card = newCard(i,item,price);
//     document.getElementById("main").appendChild(card);
// }
// for (var i in side.sides) {
//     var item = side.sides[i].sidename;
//     var price = side.sides[i].price;
//     var card = newCard("side"+i,item,price);
//     document.getElementById("main").appendChild(card);
// }
// for (var i in drink.drinks) {
//     var item = drink.drinks[i].drinkname;
//     var price = drink.drinks[i].price;
//     var card = newCard("drinks"+i,item,price);
//     document.getElementById("main").appendChild(card);
// }
// for (var i in deal.deals) {
//     var item = deal.deals[i].dealname;
//     var itemdeal = deal.deals[i].deal;
//     var card = newCard("deals"+i,item,itemdeal);
//     document.getElementById("main").appendChild(card);
// }


// function newCard(id,order1,order2,order3,order4) {
//     console.log("test");
//     var div = document.createElement("div");
//     div.id = id;
//     div.className = "card";
//     div.innerHTML = "<div class='image'><nav><ul> <li>"+ order1 +"</li> <li>"+ order2 +"</li> <li>" +order3+ "</li> <li>"+ order4 +"</li> " +
//         "<li>"+ order1 +"</li> <li>"+ order2 +"</li> <li>" +order3+ "</li> <li> "+ order4 +"</li> " +
//         "<li>"+ order1 +"</li> <li>"+ order2 +"</li> <li>" +order3+ "</li> <li>"+ order4 +"</li> </ul> </nav> " +
//         "</div> <div class='container'> <p><button class='cancel' onclick='confirmCancel(this)'>Cancel</button></p> " +
//         "<p><button class='done'onclick='confirmDone(this)'>Done</button> </p> </div>";
//     return div;
// }
function addChecked() {
    var list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
}

function confirmCancel(objid) {
    return function () {


        var cancel = confirm("Are you sure you want to cancel this order");


        if (cancel == true) {
            document.getElementById(objid).style.backgroundColor = "#ee8400";
            setTimeout(removeCard, 2200, objid, "Cancelled");
            console.log("Order Cancelled");
        }
        if (cancel == false) {
            document.getElementById(objid).style.backgroundColor = "#ffffff";
        }
    }
}

function confirmDone(objid) {
    return function () {

        var done = confirm("Are you sure you want to complete this order");

        if (done == true) {
            document.getElementById(objid).style.backgroundColor = "#329c37";
            setTimeout(removeCard, 4000, objid, "Completed");
        }
        if (done == false) {
            document.getElementById(objid).style.backgroundColor = "#ffffff";

        }
    }
}

function removeCard(objid, typestr) {

    var cardobj = document.getElementById(objid)
    cardobj.parentElement.removeChild(cardobj);
    alert(typestr + ": Table " + objid + " order has been removed ");
}


// function newCardSmall(id,order1,order2,order3,order4) {
//       var div = document.createElement("div");
//       div.id = id;
//       div.className = "card";
//       div.innerHTML = "<div class='image'> <ul> <li>"+ order1 +"</li> <li>"+ order2 +"</li> <li>" +order3+ "</li> <li>"+ order4 +"</li> </ul>" +
//           "</div> <div class='container'> <p><button  id="+id+" class='cancel' onclick='confirmCancel(this.id)'>Cancel</button></p> " +
//           "<p><button id="+id+" class='done'onclick='confirmDone(this.id)'>Done</button> </p> </div>";
//       return div;
//   }


//
//  for (var i in smallorder.orders) {
//     var order1 = smallorder.orders[i].order1;
//     var order2 = smallorder.orders[i].order2;
//     var order3 = smallorder.orders[i].order3;
//     var order4 = smallorder.orders[i].order4;
//     var card =  newCardSmall(i,order1,order2,order3,order4);
//     document.getElementById("main").appendChild(card);
// }

//
// <div class="col-md-6 px-5 mt-3 border-dark" style="">
//         <div class="row">
//           <div class="col-md-6 border-dark">
//             <h4 class="">OrderNo</h4>
//           </div>
//           <div class="col-md-6">
//             <h4 class="">Timestamp<br></h4>
//           </div>
//         </div>
//         <h5 class="">ORDER ITEMS</h5>
//         <div class="pre-scrollable">
//           <ul class="list-group list-group-flush">
//             <li class="list-group-item">Item1</li>
//             <li class="list-group-item"> Item2</li>
//             <li class="list-group-item">Item3</li>
//             <li class="list-group-item"> Item4</li>
//             <li class="list-group-item"> Item5</li>
//             <!--More items can be added here if needed, the box is scrollable -Juusoh-->
//           </ul>
//         </div>
//         <a class="btn btn-outline-success" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//       </div>
//       <div class="mx-auto col-lg-6" style="">
//         <div class="row border-dark">
//           <div class="col-md-12 px-5 mt-3 border-dark border-left" style="">
//             <div class="row">
//               <div class="col-md-6">
//                 <h4 class="">OrderNo</h4>
//               </div>
//               <div class="col-md-6">
//                 <h4 class="">Timestamp<br></h4>
//               </div>
//             </div>
//             <h5 class="">ORDER ITEMS</h5>
//             <div class="pre-scrollable">
//               <ul class="list-group list-group-flush">
//                 <li class="list-group-item">Item1</li>
//                 <li class="list-group-item"> Item2</li>
//                 <li class="list-group-item">Item3</li>
//                 <li class="list-group-item"> Item4</li>
//                 <li class="list-group-item"> Item5</li>
//                 <!--More items can be added here if needed, the box is scrollable-->
//               </ul>
//             </div>
//             <a class="btn btn-outline-success px-2" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div class="row">
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//     </div>
//   </div>
// </div>
// <div class="py-5 text-center border-dark">
//   <div class="container border-dark shadow bg-light">
//     <div class="row border-dark">
//       <div class="col-md-6 px-5 mt-3 border-dark" style="">
//         <div class="row">
//           <div class="col-md-6 border-dark">
//             <h4 class="">OrderNo</h4>
//           </div>
//           <div class="col-md-6">
//             <h4 class="">Timestamp<br></h4>
//           </div>
//         </div>
//         <h5 class="">ORDER ITEMS</h5>
//         <div class="pre-scrollable">
//           <ul class="list-group list-group-flush">
//             <li class="list-group-item">Item1</li>
//             <li class="list-group-item"> Item2</li>
//             <li class="list-group-item">Item3</li>
//             <li class="list-group-item"> Item4</li>
//             <li class="list-group-item"> Item5</li>
//             <!--More items can be added here if needed, the box is scrollable-->
//           </ul>
//         </div>
//         <a class="btn btn-outline-success" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//       </div>
//       <div class="mx-auto col-lg-6" style="">
//         <div class="row border-dark">
//           <div class="col-md-12 px-5 mt-3 border-dark border-left" style="">
//             <div class="row">
//               <div class="col-md-6">
//                 <h4 class="">OrderNo</h4>
//               </div>
//               <div class="col-md-6">
//                 <h4 class="">Timestamp<br></h4>
//               </div>
//             </div>
//             <h5 class="">ORDER ITEMS</h5>
//             <div class="pre-scrollable">
//               <ul class="list-group list-group-flush">
//                 <li class="list-group-item">Item1</li>
//                 <li class="list-group-item"> Item2</li>
//                 <li class="list-group-item">Item3</li>
//                 <li class="list-group-item"> Item4</li>
//                 <li class="list-group-item"> Item5</li>
//                 <!--More items can be added here if needed, the box is scrollable-->
//               </ul>
//             </div>
//             <a class="btn btn-outline-success px-2" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div class="row">
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//     </div>
//   </div>
// </div>
// <div class="py-5 text-center border-dark">
//   <div class="container border-dark shadow bg-light">
//     <div class="row border-dark">
//       <div class="col-md-6 px-5 mt-3 border-dark" style="">
//         <div class="row">
//           <div class="col-md-6 border-dark">
//             <h4 class="">OrderNo</h4>
//           </div>
//           <div class="col-md-6">
//             <h4 class="">Timestamp<br></h4>
//           </div>
//         </div>
//         <h5 class="">ORDER ITEMS</h5>
//         <div class="pre-scrollable">
//           <ul class="list-group list-group-flush">
//             <li class="list-group-item">Item1</li>
//             <li class="list-group-item"> Item2</li>
//             <li class="list-group-item">Item3</li>
//             <li class="list-group-item"> Item4</li>
//             <li class="list-group-item"> Item5</li>
//             <!--More items can be added here if needed, the box is scrollable-->
//           </ul>
//         </div>
//         <a class="btn btn-outline-success" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//       </div>
//       <div class="mx-auto col-lg-6" style="">
//         <div class="row border-dark">
//           <div class="col-md-12 px-5 mt-3 border-dark border-left" style="">
//             <div class="row">
//               <div class="col-md-6">
//                 <h4 class="">OrderNo</h4>
//               </div>
//               <div class="col-md-6">
//                 <h4 class="">Timestamp<br></h4>
//               </div>
//             </div>
//             <h5 class="">ORDER ITEMS</h5>
//             <div class="pre-scrollable">
//               <ul class="list-group list-group-flush">
//                 <li class="list-group-item">Item1</li>
//                 <li class="list-group-item"> Item2</li>
//                 <li class="list-group-item">Item3</li>
//                 <li class="list-group-item"> Item4</li>
//                 <li class="list-group-item"> Item5</li>
//                 <!--More items can be added here if needed, the box is scrollable-->
//               </ul>
//             </div>
//             <a class="btn btn-outline-success px-2" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div class="row">
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//     </div>
//   </div>
// </div>
// <div class="py-5 text-center border-dark">
//   <div class="container border-dark shadow bg-light">
//     <div class="row border-dark">
//       <div class="col-md-6 px-5 mt-3 border-dark" style="">
//         <div class="row">
//           <div class="col-md-6 border-dark">
//             <h4 class="">OrderNo</h4>
//           </div>
//           <div class="col-md-6">
//             <h4 class="">Timestamp<br></h4>
//           </div>
//         </div>
//         <h5 class="">ORDER ITEMS</h5>
//         <div class="pre-scrollable">
//           <ul class="list-group list-group-flush">
//             <li class="list-group-item">Item1</li>
//             <li class="list-group-item"> Item2</li>
//             <li class="list-group-item">Item3</li>
//             <li class="list-group-item"> Item4</li>
//             <li class="list-group-item"> Item5</li>
//             <!--More items can be added here if needed, the box is scrollable-->
//           </ul>
//         </div>
//         <a class="btn btn-outline-success" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//       </div>
//       <div class="mx-auto col-lg-6" style="">
//         <div class="row border-dark">
//           <div class="col-md-12 px-5 mt-3 border-dark border-left" style="">
//             <div class="row">
//               <div class="col-md-6">
//                 <h4 class="">OrderNo</h4>
//               </div>
//               <div class="col-md-6">
//                 <h4 class="">Timestamp<br></h4>
//               </div>
//             </div>
//             <h5 class="">ORDER ITEMS</h5>
//             <div class="pre-scrollable">
//               <ul class="list-group list-group-flush">
//                 <li class="list-group-item">Item1</li>
//                 <li class="list-group-item"> Item2</li>
//                 <li class="list-group-item">Item3</li>
//                 <li class="list-group-item"> Item4</li>
//                 <li class="list-group-item"> Item5</li>
//                 <!--More items can be added here if needed, the box is scrollable-->
//               </ul>
//             </div>
//             <a class="btn btn-outline-success px-2" href="#">ACCEPT ORDER</a><a class="btn btn-dark" href="#">CANCEL ORDER</a>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div class="row">
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//       <div class="col-md-6 border-dark"><a class="btn btn-primary w-50" href="#">ORDER READY</a></div>
//     </div>
//   </div>
// </div>