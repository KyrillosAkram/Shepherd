var l = console.log
var current_page = "Home"
var pages = {
    Home: { page_content: {} },
    Registeration: { page_content: {} },
    Modifing: { page_content: {} },
    Registed: { page_content: {} },
    New_session: { page_content: {} },
    Setting: { page_content: {} }
}

function swap_current_page_content(event) {
    pages[current_page].page_content = $("#main_container")
}

function display_append(char) {
    $("#display").val($("#display").val() + char)
    console.log(char)
}

function calculate() {
    l($("#display").val())
    $("#display").val(
        eval(
            $("#display").val()
        )
    )
}

function fill_with_current_location() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(set_location);
        M.toast({html:"Geolocation is detected" });
    } else {
        M.toast({html:"Geolocation is not supported by this browser." });
    }
}



function set_location(position) {
    $("#Location").val( position.coords.latitude + ',' + position.coords.longitude)
}

function x(e) {
    console.log(e)
}

function submit_registration(){
    let check_counter=5
    (Boolean($("#cam").val()))?check_counter--:M.toast({html:"please select/take image"});
    (Boolean($("#Name").val()))?check_counter--:M.toast({html:"please enter the name"});
    (Boolean($("#Address").val()))?check_counter--:M.toast({html:"please enter the address"});
    (Boolean($("#Location").val()))?check_counter--:M.toast({html:"please enter the location"});
    (Boolean($("#Class").val()))?check_counter--:M.toast({html:"please choose class"});
    if(!check_counter){
        
    }
}

// register ws //
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registed_obj) => console.log("sw registed ", registed_obj))
        .catch((error_obj) => console.log("sw not registed ", error_obj))
}

primer_color_theme = "indigo"
$(".btn,.btn-floating").addClass("waves-effect waves-light " + primer_color_theme)
$("nav").addClass(primer_color_theme)


var elem = document.querySelector('.sidenav');
var instance = new M.Sidenav(elem);

M.AutoInit();
