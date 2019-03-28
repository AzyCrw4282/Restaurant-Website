function turn_off_all_containers() {
    var container = document.getElementById("statistics_container");
    container.style.display = "none";
    var accounts = document.getElementById("accounts_container");
    accounts.style.display = "none";
}

function show_stats() {
    turn_off_all_containers();
    var container = document.getElementById("statistics_container");
    container.style.display = "block";
}

function show_accounts() {
    turn_off_all_containers();
    var accounts = document.getElementById("accounts_container");
    accounts.style.display = "block";

}
