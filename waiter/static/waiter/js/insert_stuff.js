function food_to_information_choice(food_information, food) {
    var food_list = food["food_list"];
    var select_information = document.getElementById('food_information_option_list');
    var select_food = document.getElementById('food_option_list');
    console.log(food_information);
    console.log(food);
    for (var i in food_information) {
        var info_dict = food_information[i];
        var info_id = info_dict["id"];
        var info_name = info_dict["name"];
        var option = document.createElement('option');
        option.value = info_id;
        option.innerText = info_name;
        select_information.appendChild(option);
    }
    console.log(food_list);
    for (var j in food_list) {
        var food_dict = food_list[j];
        console.log(food_dict);
        var food_id = food_dict["id"];
        var food_name = food_dict["name"];
        var option = document.createElement('option');
        option.value = food_id;
        option.innerText = food_name;
        select_food.appendChild(option);
    }
}

function load_categories(data) {
    console.log(data);
    var select_information = document.getElementById('delete_food_category_name');
    for (var i = 0; i < data.length; i += 1) {
        var cat = data[i];
        var opt = document.createElement("option");
        opt.innerText = cat["name"];
        opt.value = cat["id"];
        select_information.appendChild(opt);
    }

}

function food_information_delete() {
    var select_information = document.getElementById('food_information_option_delete_list');
    delete_food_information(select_information.value);

}

function load_food_info_delete_list(data) {

    console.log(data);
    var select_information = document.getElementById('food_information_option_delete_list');
    for (var i = 0; i < data.length; i += 1) {
        var cat = data[i];
        var opt = document.createElement("option");
        opt.innerText = cat["name"];
        opt.value = cat["id"];
        select_information.appendChild(opt);
    }

}

function delete_food_category_id() {
    var select_information = document.getElementById('delete_food_category_name');
    delete_food_category(select_information.value);
}

function food_information_choice_submit() {
    var select_information = document.getElementById('food_information_option_list');
    var select_food = document.getElementById('food_option_list');
    var info_id_list = [];
    var food_id_list = [];
    for (var i = 0; i < select_information.children.length; i++) {
        if (select_information[i].selected) {
            info_id_list.push(select_information[i].value);
        }
    }
    for (var i = 0; i < select_food.children.length; i++) {
        if (select_food[i].selected) {
            food_id_list.push(select_food[i].value);
        }
    }
    console.log(info_id_list);
    console.log((food_id_list));
    add_food_information_to_food(food_id_list, info_id_list);

}