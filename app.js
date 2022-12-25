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
    let check_counter =7 
    Boolean(document.querySelector("#cam").value) ? check_counter-- : M.toast({ html: "please select/take image" });
    (Boolean(document.querySelector("#Name").value)) ? check_counter-- : M.toast({ html: "please enter the name" });
    (Boolean(document.querySelector("#Address").value)) ? check_counter-- : M.toast({ html: "please enter the address" });
    (Boolean(document.querySelector("#Location").value)) ? check_counter-- : M.toast({ html: "please enter the location" });
    (Boolean(document.querySelector("#Class").value)) ? check_counter-- : M.toast({ html: "please choose class" });
    (Boolean(document.querySelector("#telephone").value)) ? check_counter-- : M.toast({ html: "please enter the telephone" });
    (Boolean(document.querySelector("#birthdate").value)) ? check_counter-- : M.toast({ html: "please enter the birthdate" });
    if (!check_counter) {// if all checks are ok
        if (Boolean(window.db)) {
            try {
                let trx = window.db.transaction("children", "readwrite")
                let children = trx.objectStore("children");
                Promise.all([new faceapi.LabeledFaceDescriptors(document.querySelector("#Name").value, [window.registration_discriptor.descriptor])]).then((values) => {
                    children.add(
                        {
                            Name:document.querySelector("#Name").value,
                            Address:document.querySelector("#Address").value,
                            Location:document.querySelector("#Location").value,
                            Class:document.querySelector("#Class").value,
                            Discriptor: values[0],
                            Telephone:document.querySelector("#telephone").value,
                            Birthdate:document.querySelector("#birthdate").value
                        }
                    )
                    debugging & console.log("children.add");
                    debugging & console.log(values)
                    document.querySelector("#Name").value=''
                    document.querySelector("#Address").value=''
                    document.querySelector("#Location").value=''
                    document.querySelector("#Class").value='?'
                    document.querySelector("li.selected").classList.remove("selected")
                    document.querySelector("li.disabled").classList.add("selected")
                    document.querySelector("#registeration_submit").classList.add("disabled")
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
    Window.Birthdate_instances = M.Datepicker.init(document.querySelectorAll('.datepicker'),{format:"dd-mm-yyyy"});
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
            faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then((event) => {
                console.log(event)
                window.registration_discriptor = { ...event }
                debugging & console.log("remove disable");
                $("#registeration_submit").removeClass("disabled")
            })
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
function generate_direction(latitude_longitude)
{
    return "https://www.google.com/maps/dir//latitude_longitude/"
}

function Session_Actions_Save() 
{
    localStorage.setItem("last_session",JSON.stringify(Session_tables_to_obj()))
}

function Session_Actions_Load() 
{
    last_session=localStorage.getItem("last_session")
    last_session=last_session?JSON.parse(last_session):null;
    if(last_session)
    {
        if(last_session.church_table)
            {
                church_table=document.querySelector("tbody#church_table")
                home_table=document.querySelector("tbody#home_table")
                missing_table=document.querySelector("tbody#missing_table")
                if(last_session.church_table.length)
                {
                    for(child of last_session.church_table)
                    {
                        church_table.append(Session_generat_table_row_from_childObj(child))
                    }
                }
                if(last_session.home_table.length)
                {
                    for(child of last_session.home_table)
                    {
                        home_table.append(Session_generat_table_row_from_childObj(child))
                    }
                }
                if(last_session.missing_table.length)
                {
                    for(child of last_session.missing_table)
                    {
                        missing_table.append(Session_generat_table_row_from_childObj(child))
                    }
                }

            }
    }

}

function Session_Actions_Import()
{
    document.querySelector("input#json_input").click()
}

function Session_Actions_Export()
{
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Session_tables_to_obj()));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "session"+Date.now().toString()+".json");
    dlAnchorElem.click();

}

function Session_tables_to_obj()
{
    return {
        church_table: [...document.querySelector("#church_table").getElementsByTagName("tr")].map(childRow_to_obj),
        home_table:[...document.querySelector("#home_table").getElementsByTagName("tr")].map(childRow_to_obj),
        missing_table:[...document.querySelector("#missing_table").getElementsByTagName("tr")].map(childRow_to_obj)
    }
}

function childRow_to_obj(tr)
{
    let tds=tr.getElementsByTagName("td")
    return {
        child_name:tds[0].innerText,
        child_class:tds[1].innerText,
        child_Address:tds[2].innerText
    }
}

// function Session_cherch_table_manual_add(element)
// {
//     Window.Session_children_add=element.id
// }
function Session_check_input_add(input)
{
    if (input.files.length)
    {
        Session_detect_descriptors(input.files)
    }

}

async function Session_detect_descriptors(buffers) {
    try {
        Window.Session_detect_descriptors_result = []
        let fake = document.querySelector("div#fake_div")
        let detected_descriotor_arr = await Promise.all(//to await image
            [...buffers].map(faceapi.bufferToImage)
        )
        for (image of detected_descriotor_arr ) {
            Window.Session_detect_descriptors_result.push(await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors())
        }
        console.log(Window.Session_detect_descriptors_result)
        const descriptors_arrs=Window.Session_detect_descriptors_result.flat()
        console.log(descriptors_arrs)
        let all_recoded_children=await get_all_recoded_children()
        console.log(all_recoded_children)
        let registed_d = all_recoded_children.map(record => { return record.Discriptor })
        console.log(registed_d)
        let faceMatcher = new faceapi.FaceMatcher(registed_d, 0.6)
        let found_children = null
        found_children = descriptors_arrs.map(d => faceMatcher.findBestMatch(d.descriptor))
        console.log(found_children) //.map(child_data => child_data.toString()))
        Session_active_table_add_children(found_children.map(child=>child._label))
        }
    catch (error)
    {
        console.error(error)
    }
    finally
    {
        document.querySelector('div#loading_circle').classList.remove('active');
    }
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
    listed_children= [...document.querySelectorAll("#main_content > div > ul > li.collapsible_li_table.active > div.collapsible-body >div > div.row.left-align > table > tbody > tr >td.child_name")].map(td_child_name=>td_child_name.textContent)
    console.log(listed_children)
    return listed_children
}

function Session_get_missing(big_array, small_array)
{
    return big_array.filter(child => !small_array.includes(child))
}

async function Session_check_import_json(input_element)
{
    try
    {
        if (input_element.files.length)
        {
            json_content=await read_file_as_string(input_element.files[0])        
            sessionObj = JSON.parse(json_content)
            if(sessionObj.church_table)
            {
                church_table=document.querySelector("tbody#church_table")
                home_table=document.querySelector("tbody#home_table")
                missing_table=document.querySelector("tbody#missing_table")
                if(sessionObj.church_table.length)
                {
                    for(child of sessionObj.church_table)
                    {
                        church_table.append(Session_generat_table_row_from_childObj(child))
                    }
                }
                if(sessionObj.home_table.length)
                {
                    for(child of sessionObj.home_table)
                    {
                        home_table.append(Session_generat_table_row_from_childObj(child))
                    }
                }
                if(sessionObj.missing_table.length)
                {
                    for(child of sessionObj.missing_table)
                    {
                        missing_table.append(Session_generat_table_row_from_childObj(child))
                    }
                }

            }
        }
    }
    catch(any)
    {
        console.error(any)
    }
}

function read_file_as_string(file)
{
    let reader=new FileReader()
    return new Promise((resolve,reject)=>
    {
        reader.onerror=()=>
        {
            reject(new DOMException("Problem parsing input file."))
        }
        reader.onload=()=>
        {
            resolve(reader.result)
        }
        reader.readAsText(file)
    })
}

function Session_generat_table_row_from_childObj(childObj)
{
    let tr = document.createElement("tr")
    tr.setAttribute('class', 'child_row')
    tr.setAttribute('onclick', 'Session_row_selection_toggle(this)')
    tr.setAttribute('ondblclick', 'console.log("dblclick action tobe implemented")')
    let td_n = document.createElement("td")
    td_n.setAttribute('class', 'child_name')
    td_n.append(document.createTextNode(childObj.child_name))
    tr.appendChild(td_n)
    let td_c = document.createElement("td")
    td_c.setAttribute('class', 'child_class')
    td_c.append(document.createTextNode(childObj.child_class))
    tr.appendChild(td_c)
    td_c = document.createElement("td")
    td_c.setAttribute('class', 'child_Address')
    td_c.append(document.createTextNode(childObj.child_Address))
    tr.appendChild(td_c)
    // tr.appendChild(document.createElement("td").setAttribute('class','child_class').append(document.createTextNode(child_record.Class)))

    return tr
}

function Session_generat_table_row_from_record(child_record) {
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
    setTimeout(() => console.log(missed_children.map(child => tbody.append(Session_generat_table_row_from_record(child)))), 200)
}

async function get_all_recoded_children()
{
    let result_children=null
    Window.session_result_children=null
    const myidb= idb.wrap(window.db)
    ob=myidb.transaction(['children'],'readwrite').objectStore('children')
    let request=await ob.getAll()
    request=request.map(record=>{return{...record,Discriptor:new faceapi.LabeledFaceDescriptors(record.Discriptor._label,record.Discriptor._descriptors)}})
    return request
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
        tbody.appendChild(Session_generat_table_row_from_record(request.result))
    }
}

async function Session_active_table_add_children(children_name)
{
    children_name=children_name.filter(child=>child!=="unknown")
    const db=idb.wrap(window.db)
    const obj=db.transaction('children', 'readwrite').objectStore('children')
    let active_table_existed_children=Session_from_active_table_get_listed_children();
    let active_table_body = Session_get_active_table()[0].getElementsByTagName("tbody")[0];
    if(active_table_existed_children.length>0)
    {
        for (child of children_name)
        {
            if(! active_table_existed_children.includes(child))
            {
                active_table_body.append(Session_generat_table_row_from_record(await obj.get(child)))
            }
        }
    }
    else
    {
        for (child of children_name)
        {
            if(! active_table_existed_children.includes(child))
            {
                active_table_body.append(Session_generat_table_row_from_record(await obj.get(child)))
            }
        }
    }
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
setTimeout(()=>{Window.Birthdate_instances = M.Datepicker.init(document.querySelectorAll('.datepicker'),{format:"dd-mm-yyyy"});},1000)
M.AutoInit();

/********************************************************************************/