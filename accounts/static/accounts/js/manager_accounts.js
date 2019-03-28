function add_account_to_page(user, all_groups) {
    /**
     * function adds row to html accounts table
     * @param user={"id":id, "username":username, "email":email, "group_list":[name_1,name_2,name_3],}
     * @type {HTMLElement}
     */
    var accounts_container = document.getElementById("accounts_container");
    var user_table = accounts_container.querySelector('form[name="delete_user_form"]');
    var row = document.createElement("div");
    row.id = "user_" + user["id"];
    row.className = "user_manage_container_row";
    var delete_btn_cell = document.createElement("div");
    delete_btn_cell.className = "user_manage_container_row_cell";
    var delete_btn = document.createElement("div");
    delete_btn.innerText = "X";
    delete_btn.className = "user_manage_container_row_delete_btn";
    var id = document.createElement("div");
    id.innerText = user["id"];
    id.className = "user_manage_container_row_id";
    var username = document.createElement("div");
    username.innerText = user["username"];
    username.className = "user_manage_container_row_name";
    var email = document.createElement("div");
    email.innerText = user["email"];
    email.className = "user_manage_container_row_email";

    var group_list_dropdown = document.createElement("div");
    group_list_dropdown.className = "group_list_dropdown";
    group_list_dropdown.innerText = "Groups";

    for (var i in all_groups) {
        var group_list_content = document.createElement("div");
        group_list_content.className = "group_list_content";
        var group_name = all_groups[i];
        var group_option = document.createElement("a");
        var group_checkbox = document.createElement("input");
        group_checkbox.setAttribute("type", "checkbox");
        group_checkbox.id = "checkbox_" + group_name;
        group_checkbox.checked = false;

        if (user["group_list"].indexOf(group_name) >= 0) {
            group_checkbox.checked = true;
        }
        group_option.innerText = group_name;
        //click the checkbox twice to counter act.
        group_checkbox.onclick = click_checkbox(group_checkbox);
        group_option.appendChild(group_checkbox);
        //actually control the selection of the checkbox
        group_option.onclick = update_user_group(group_checkbox, group_name, username.innerText);
        group_list_content.appendChild(group_option);
        group_list_dropdown.appendChild(group_list_content);

    }

    delete_btn.onclick = delete_account(user["id"]);
    delete_btn_cell.appendChild(delete_btn);
    row.appendChild(delete_btn_cell);
    row.appendChild(id);
    row.appendChild(username);
    row.appendChild(email);
    row.appendChild(group_list_dropdown);
    user_table.appendChild(row)
}

function update_user_group(checkbox, group_name, user_name) {
    return function () {
        console.log("UPDATING");
        if (!(checkbox.checked)) {
            checkbox.checked = true;
            add_user_to_group(group_name, user_name)
        } else {
            checkbox.checked = false;
            remove_user_from_group(group_name, user_name)
        }

    }
}

function click_checkbox(checkbox) {
    return function () {
        //clicking the checkbox again so it unclicks itself
        if (!(checkbox.checked)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    }
}

function delete_account_from_page(id) {
    console.log("DELETING ACCOUNT");
    document.getElementById("user_" + id).style.display = "none";
}

function load_user_table(user_list, all_groups) {
    console.log(user_list);
    var accounts_container = document.getElementById("accounts_container");
    var user_table = accounts_container.querySelector('form[name="delete_user_form"]');
    for (var i in user_list) {
        var user = user_list[i];
        add_account_to_page(user, all_groups)

    }
}
function submit_add_user_form() {
    var accounts_container = document.getElementById("accounts_container");
    var add_user_form = accounts_container.querySelector('form[name="add_user_form"]');
    console.log(add_user_form);
    var full_name = add_user_form.querySelector('input[name="full_name"]').value;
    var email = add_user_form.querySelector('input[name="email"]').value;
    var account_group = add_user_form.querySelector('select[name="group_name"]').value;
    console.log(full_name + email + account_group);
    add_user(full_name, email, account_group);
}

function show_add_user_form() {
    var add_user_form = document.getElementById("add_user_form");
    if (add_user_form.style.display == "none") {
        add_user_form.style.display = "block";
    } else if (add_user_form.style.display == "block") {
        add_user_form.style.display = "none";
    } else {
        add_user_form.style.display = "block";

    }
}