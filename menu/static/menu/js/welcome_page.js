function add_table_options(tables) {
    // tables= [{},{},{"id":id}]
    var select = document.getElementById(id = "table_option_list");

    for (var i = 0; i < tables.length; i++) {
        console.log("var: "+i);
        var table = tables[i];
        console.log("table: "+table);
        console.log("table_id: "+table["id"]);

        // <option value="saab">Saab</option>
        var option = document.createElement("a");
        var button=document.createElement("button");
        option.value = table["id"];
        button.innerText = "table number: " + table["id"];
        option.href = ""+table["id"]+"/";
        option.appendChild(button);

        select.appendChild(option)
    }

}