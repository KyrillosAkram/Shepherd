import {wrap,openDB} from 'idb'
import { createData } from './components/Common_Components/List_Table/list_table'
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
function Discriptor_parser(Discriptor) {
    let a = []
    for (let i in Discriptor) {
        a.push(Discriptor[i])
    }//if(typeof(Discriptor)!=)
    return a
}

async function get_all_recoded_discriptors()
{
    const obj = window.idb.transaction('children', 'readwrite').objectStore('children')
    let records = await obj.getAll()
    records = records.map(record => { return { ...record, Discriptor: new window.faceapi.LabeledFaceDescriptors(record.Discriptor._label, [new Float32Array(Discriptor_parser(record.Discriptor._descriptors[0]))]) } })
    return records
}

async function get_all_recorded_rows()
{
    const obj = window.idb.transaction('children', 'readwrite').objectStore('children')
    let records = await obj.getAll()
    records.map(record => createData(...[record.Name,record.Class,record.Address]))
}
async function get_all_recoded_children_names() {
    const myidb = window.idb//.wrap(await open_db("sefain_brain"))
    const tx = myidb.transaction(['children'], 'readwrite')
    const ob = tx.objectStore('children')
    return [...await ob.getAll()].map(record => record.Name)
}

async function get_all_recoded_children() {
    try {
        const myidb = window.idb//.wrap(await open_db("sefain_brain"))
        const ob = myidb.transaction(['children'], 'readwrite').objectStore('children')
        let request = await ob.getAll()
        return request
    }
    catch (any) {
        console.error(any)
    }
}

export {open_db,get_all_recoded_discriptors,get_all_recorded_rows,get_all_recoded_children_names,get_all_recoded_children}