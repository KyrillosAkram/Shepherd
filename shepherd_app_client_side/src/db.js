import {wrap,openDB} from 'idb'

function refresh_all_registed_childrens() {
    let myreq = window.db.transaction(["children"], "readwrite").objectStore("children").getAll()
    // myreq.onerror = (event) => M.toast({ html: event });

    myreq.onsuccess = () => {
        window.all_registed_childrens = myreq.result
        let obj = {}
        // for (record of Window.all_registed_childrens) {
        //     eval(`obj={...obj,"${record.Name}":null}`)
        // }
        // for (o of document.querySelectorAll('.autocomplete')) { M.Autocomplete.getInstance(o).updateData(obj) }
    }

    /*debugging &*/ console.log("refresh_all_registed_childrens");
}
async function open_db(db_name) {
    let request = window.indexedDB.open("sefain_brain", 1);
    return new Promise((resolve, reject) => {

        request.onupgradeneeded = (event) => {
            var db = event.target.result;
            // window.idb = wrap(db);
            // const tx=db.transaction("notes","write");
            let children = db.createObjectStore("children", { keyPath: "Name" });

            /*debugging &*/ console.log("upgrade called")
        };
        request.onsuccess = (event) => {
            var db = event.target.result;
            window.db = db;// backward compatiblity
            window.idb = wrap(window.db);
            refresh_all_registed_childrens()
            /*debugging &*/ console.log("successful");
            resolve(db)
        };
        request.onerror = (event) => {
            alert("errooooooooooooooooooooor")
            reject(event)
        }
    })

}

export {open_db}