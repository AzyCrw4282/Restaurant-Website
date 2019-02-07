function add_table_options(tables) {
    // tables= [{},{},{"id":id}]
    var select = document.getElementById(id = "table_option_list");

    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        // <option value="saab">Saab</option>
        var option = document.createElement("OPTION");
        option.value = table["id"];
        option.innerText = "table number: " + id;
        option.href = "id/";
        select.appendChild(option)
    }

}