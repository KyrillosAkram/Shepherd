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
        debugging & console.log("successful");

    };
    request.onerror = (event) => { alert("errooooooooooooooooooooor") }
    switch ($("a.brand-logo").html()) {
        case "index":
           debugging&console.log("index"); 
           break;
        case "Registeration":
           debugging&console.log("Registeration"); 
           Registeration_onLoad();
           break;
        case "Modifing":
           debugging&console.log("Modifing"); 
           break;
        case "Registed":
           debugging&console.log("Registed"); 
           break;
        case "New_session":
           debugging&console.log("New_session"); 
           break;
        case "Setting":
           debugging&console.log("Setting"); 
           break;
        default:
            debugging&console.log($("a.brand-logo").html());
            break;
    }
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
        if(Boolean(window.db))
        {
            try {
                let trx=window.db.transaction("children","readwrite")
                let children=trx.objectStore("children");
                Promise.all([new faceapi.LabeledFaceDescriptors($("#Name").val(), [window.registration_discriptor.descriptor])]).then((values)=>{
                    children.add(
                        {
                            Name        :$("#Name").val(),
                            Address     :$("#Address").val(),
                            Location    :$("#Location").val(),
                            Class       :$("#Class").val(),
                            Discriptor  :values[0],
                            // Discriptor  :window.registration_discriptor,
                        }
                    )
                    debugging&console.log("children.add");

                })
                window.registration_discriptor=null;
            } catch (error) {
                debugging & console.log(error);
                M.toast({html:error})
            }
        }
    } else {
        M.toast({html:"Please fill all filds !!!"})
    }
}

function Registeration_onLoad() {
    let image,canvas;
    debugging&console.log("Registeration_onLoad") 
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
            debugging&console.log("cam change called")
            container=document.getElementById("image_section")
            if (image) image.remove()
            if (canvas) canvas.remove()
            image = await faceapi.bufferToImage(cam.files[0])
            
            container.append(image)
            // canvas = faceapi.createCanvasFromMedia(image)
            // container.append(canvas)
            // var det=await ;
            // registration_discriptor.push(await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().discriptor);
            faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then((event)=>{
                console.log(event)
                window.registration_discriptor= {...event}
                debugging&console.log("remove disable");
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

function Session_Actions_Save(){

}

function Session_Actions_Load(){

}

function Session_Actions_Import(){

}

function Session_Actions_Export(){

}

/********************************************************************************/
primer_color_theme = "indigo"
$(".btn,.btn-floating").addClass("waves-effect waves-light " + primer_color_theme)
$("nav").addClass(primer_color_theme)


var elem = document.querySelector('.sidenav');
var instance = new M.Sidenav(elem);

M.AutoInit();
