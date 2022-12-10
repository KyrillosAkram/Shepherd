var debugging = true;
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
var registration_discriptor = [];
function App_onStartUp() {
    // TODO : run loadup codevar db;
    let request = window.indexedDB.open("sefain_brain", 1);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        // const tx=db.transaction("notes","write");
        let children = db.createObjectStore("children", { keyPath: "Name" });

        debugging & console.log("upgrade called")
    };
    request.onsuccess = (event) => {
        var db = event.target.result;
        window.db = db;
        refresh_all_registed_childrens()
        debugging & console.log("successful");
    };
    request.onerror = (event) => { alert("errooooooooooooooooooooor") }
    switch ($("a.brand-logo").html()) {
        case "index":
            debugging & console.log("index");
            break;
        case "Registeration":
            debugging & console.log("Registeration");
            Registeration_onLoad();
            break;
        case "Modifing":
            debugging & console.log("Modifing");
            break;
        case "Registed":
            debugging & console.log("Registed");
            break;
        case "Session":
            debugging & console.log("Session");
            Session_onLoad()
            break;
        case "Setting":
            debugging & console.log("Setting");
            break;
        default:
            debugging & console.log($("a.brand-logo").html());
            break;
    }
}
function refresh_all_registed_childrens() {
    let myreq = window.db.transaction(["children"], "readwrite").objectStore("children").getAll()
    myreq.onerror = (event) => M.toast({ html: event });

    myreq.onsuccess = () => {
        Window.all_registed_childrens = myreq.result
        let obj = {}
        for (record of Window.all_registed_childrens) {
            eval(`obj={...obj,"${record.Name}":null}`)
        }
        for (o of document.querySelectorAll('.autocomplete')) { M.Autocomplete.getInstance(o).updateData(obj) }
    }

    debugging & console.log("refresh_all_registed_childrens");
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
        M.toast({ html: "Geolocation is detected" });
    } else {
        M.toast({ html: "Geolocation is not supported by this browser." });
    }
}



function set_location(position) {
    $("#Location").val(position.coords.latitude + ',' + position.coords.longitude)
}

function x(e) {
    console.log(e)
}

function submit_registration() {
    let check_counter = 5
    Boolean($("#cam").val()) ? check_counter-- : M.toast({ html: "please select/take image" });
    (Boolean($("#Name").val())) ? check_counter-- : M.toast({ html: "please enter the name" });
    (Boolean($("#Address").val())) ? check_counter-- : M.toast({ html: "please enter the address" });
    (Boolean($("#Location").val())) ? check_counter-- : M.toast({ html: "please enter the location" });
    (Boolean($("#Class").val())) ? check_counter-- : M.toast({ html: "please choose class" });
    if (!check_counter) {// if all checks are ok
        if (Boolean(window.db)) {
            try {
                let trx = window.db.transaction("children", "readwrite")
                let children = trx.objectStore("children");
                Promise.all([new faceapi.LabeledFaceDescriptors($("#Name").val(), [window.registration_discriptor.descriptor])]).then((values) => {
                    children.add(
                        {
                            Name: $("#Name").val(),
                            Address: $("#Address").val(),
                            Location: $("#Location").val(),
                            Class: $("#Class").val(),
                            Discriptor: values[0],
                            // Discriptor  :window.registration_discriptor,
                        }
                    )
                    debugging & console.log("children.add");
                    debugging & console.log(values)
                })
                window.registration_discriptor = null;
            } catch (error) {
                debugging & console.log(error);
                M.toast({ html: error })
            }
        }
    } else {
        M.toast({ html: "Please fill all filds !!!" })
    }
}

function Session_onLoad() {
    let image, canvas;
    debugging & console.log("Session_onLoad")
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    ]).then(() => { document.querySelector("div#loading_circle").classList.remove('active'); M.toast({ html: 'you can choose image' }) })
}

function Registeration_onLoad() {
    let image, canvas;
    debugging & console.log("Registeration_onLoad")
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    ]).then(() => { // action event binder for registeration
        const cam = document.getElementById('cam');
        M.toast({ html: 'you can choose image' })
        // var registration_discriptor = [];
        cam.addEventListener('change', async () => {
            //TODO : need async improvment
            debugging & console.log("cam change called")
            container = document.getElementById("image_section")
            if (image) image.remove()
            if (canvas) canvas.remove()
            image = await faceapi.bufferToImage(cam.files[0])

            container.append(image)
            // canvas = faceapi.createCanvasFromMedia(image)
            // container.append(canvas)
            // var det=await ;
            // registration_discriptor.push(await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().discriptor);
            faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then((event) => {
                console.log(event)
                window.registration_discriptor = { ...event }
                debugging & console.log("remove disable");
                $("#registeration_submit").removeClass("disabled")
            })
            /*.then((evnet)=>{
                return event;
            })*/

        })
    })
}

// register ws //
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registed_obj) => console.log("sw registed ", registed_obj))
        .catch((error_obj) => console.log("sw not registed ", error_obj))
}

/*********************************** Session ***********************************/
// TODO: 

function Session_Actions_Save() {

}

function Session_Actions_Load() {

}

function Session_Actions_Import() {

}

function Session_Actions_Export() {

}

// function Session_cherch_table_manual_add(element)
// {
//     Window.Session_children_add=element.id
// }
function Session_check_input_add(input) {
    if (input.files.length) {
        Session_detect_descriptors(input.files)
    }

}

function Session_detect_descriptors(buffers) {
    Window.Session_detect_descriptors_result=[]
    let fake=document.querySelector("div#fake_div")
    let detected_descriotor_arr =// Promise.all(// to await faces detection
    Promise.all(//to await image
    [...buffers].map(faceapi.bufferToImage)
    ).then(
        async (images) => 
        {   
            for (image of images) {
                Window.Session_detect_descriptors_result.push( await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor())
            }
        }
        ).then(async()=>{
            get_all_recoded_children()
            Promise.all(Window.Session_detect_descriptors_result).then(
               setTimeout( async descriptors_arrs=>{
                    let all_recoded_children =Window.session_result_children
                    console.log(all_recoded_children)
                    let registed_d=all_recoded_children.map(record=> {return record.Discriptor})
                    console.log(registed_d)
                    let faceMatcher= new faceapi.FaceMatcher(registed_d, 0.6)
                    let found_children=null
                    console.log(descriptors_arrs)
                    found_children=descriptors_arrs.map(d=> faceMatcher.findBestMatch(d.descriptor))
                    console.log(found_children.map(child_data=>child_data.toString()))
                },10000)
            )
            document.querySelector('div#loading_circle').classList.remove('active');
        }).finally(()=>document.querySelector('div#loading_circle').classList.remove('active'))
}

function Session_get_active_table() {
    return [...document.querySelectorAll("#main_content > div > ul > li.collapsible_li_table.active")]
}
function Session_table_add_btns_state_updater(element) {
    setTimeout(() => {
        let session_table_action_btns = [...document.querySelectorAll(".session_table_action_btn")];
        let active_tables = Session_get_active_table();
        if (active_tables.length > 0) {
            Window.Session_children_add = active_tables[0].id;
            session_table_action_btns.map(btn => {
                if (btn.classList.contains('red')) {
                    if (Boolean(Window.session_row_selection)) btn.classList.remove('disabled');
                }
                else {
                    btn.classList.remove('disabled')
                }
            })
        }
        else {
            session_table_action_btns.map(btn => btn.classList.add('disabled'))
        }
    }, 200)
}

function Session_row_selection_toggle(element) {
    if (!Boolean(Window.session_row_selection)) {
        Window.session_row_selection = 0;
        [...document.querySelectorAll('.table_body_row_action')].map(btn => btn.classList.add('disabled'))
    }
    element.classList.toggle('grey')
    if (element.classList.contains('grey')) {
        Window.session_row_selection++
        [...document.querySelectorAll('.table_body_row_action')].map(btn => btn.classList.remove('disabled'))
    }
    else if (Window.session_row_selection > 0) {
        Window.session_row_selection--
        if (Window.session_row_selection === 0)
            [...document.querySelectorAll('.table_body_row_action')].map(btn => btn.classList.add('disabled'));
    }
    else {
        [...document.querySelectorAll('.table_body_row_action')].map(btn => btn.classList.add('disabled'))
    }
}
function Session_tbody_to_array(tbody) {
    let arr = [];
    [...tbody.querySelectorAll("td.child_name")].map(td => arr.push(td.textContent))
    return arr;
}

function Session_from_active_table_get_listed_children()
{
    // let listed_children=[]
    listed_children= document.querySelectorAll("#main_content > div > ul > li.collapsible_li_table.active > div.collapsible-body >div > div.row.left-align > table > tbody > tr >td.child_name").map(td_child_name=>td_child_name.textContent)
    log(listed_children)
    return listed_children
}

function Session_get_missing(big_array, small_array) {
    return big_array.filter(child => !small_array.includes(child))
}

function Session_generat_table_row(child_record) {
    let tr = document.createElement("tr")
    tr.setAttribute('class', 'child_row')
    tr.setAttribute('onclick', 'Session_row_selection_toggle(this)')
    tr.setAttribute('ondblclick', 'console.log("dblclick action tobe implemented")')
    let td_n = document.createElement("td")
    td_n.setAttribute('class', 'child_name')
    td_n.append(document.createTextNode(child_record.Name))
    tr.appendChild(td_n)
    let td_c = document.createElement("td")
    td_c.setAttribute('class', 'child_class')
    td_c.append(document.createTextNode(child_record.Class))
    tr.appendChild(td_c)
    td_c = document.createElement("td")
    td_c.setAttribute('class', 'child_Address')
    td_c.append(document.createTextNode(child_record.Address))
    tr.appendChild(td_c)
    // tr.appendChild(document.createElement("td").setAttribute('class','child_class').append(document.createTextNode(child_record.Class)))

    return tr
}

function Session_missing_table_update() {
    let big_arr = Session_tbody_to_array(document.querySelector("#church_table"))
    let small_arr = Session_tbody_to_array(document.querySelector("#home_table"))
    Session_missing_table_update_callback(Session_get_children(Session_get_missing(big_arr, small_arr), Session_missing_table_update_callback))
}

function Session_missing_table_update_callback(missed_children) {
    console.log(missed_children)
    let trs = [];
    let tbody = document.getElementById("missing_table")
    tbody.innerHTML = ''
    setTimeout(() => console.log(missed_children.map(child => tbody.append(Session_generat_table_row(child)))), 200)
}

function get_all_recoded_children()
{
    let result_children=null
    Window.session_result_children=null
    tx=window.db.transaction(['children'],'readwrite')
    ob=tx.objectStore('children')
    const request=ob.getAll()
    request.onsuccess=(event)=>{
        result_children= event.target.result.map(record=>{return{...record,Discriptor:new faceapi.LabeledFaceDescriptors(record.Discriptor._label,record.Discriptor._descriptors)}})
        Window.session_result_children=result_children
        console.log(result_children)
    }
    return result_children
}
function Session_get_children(children_array, callback) {
    let result_children = [];
    let tx = window.db.transaction(['children'], 'readwrite');
    let request = tx.objectStore('children').openCursor();
    request.onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
            if (children_array.includes(cursor.value.Name)) {
                result_children.push(cursor.value)
            }
            cursor.continue()
        }
        else {
            // callback(result_children)
        }
    }
    return result_children
}

function Session_table_manual_add_btn() {
    let tbody = null
    switch (Window.Session_children_add) {
        case "li_church":
            tbody = document.getElementById("church_table")
            break
        case "li_home" :
            tbody = document.getElementById("home_table")
            break
        default:
            return
            break
    }
    console.log(tbody)
    let request = window.db.transaction(["children"], "readwrite").objectStore("children").get(document.querySelector("#autocomplete-input-search-manual-add").value)
    request.onsuccess = () => {
        tbody.appendChild(Session_generat_table_row(request.result))
    }
}

function Session_active_table_add_children(children_name)
{
    let active_table_existed_children=Session_from_active_table_get_listed_children();

    
}
/********************************************************************************/


/************************************ db routins ********************************************/
// function get_child_recored(child_name)
// {
//     request.onsuccess=()=>{
//         return request.result
//     }
// }
/********************************************************************************/

/*********************************** Javascript style modifiers ***********************************/
primer_color_theme = "indigo"
$(".btn,.btn-floating").addClass("waves-effect waves-light " + primer_color_theme)
$("nav").addClass(primer_color_theme)

/********************************************************************************/

/*********************************** Materialize javascript initializers ***********************************/

Window.Collapsible_instances = M.Collapsible.init(document.querySelectorAll('.collapsible'));
Window.Modal_instances = M.Modal.init(document.querySelectorAll('.modal'));
Window.autoComplete_instances = M.Autocomplete.init(document.querySelectorAll('.autocomplete', { data: {} }));
Window.FAB_instances = M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {
    direction: 'up',
    hoverEnabled: false
});
Window.instance = new M.Sidenav(document.querySelector('.sidenav'));

M.AutoInit();

/********************************************************************************/