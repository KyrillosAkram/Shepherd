import { Context,useState } from "react";
export var VOLANTEER_RUNNABLE_FIRST_DELAY = 15000;
export var VOLANTEER_INTERSPACE_DELAY = 1000;
export var volanteer_id;
export var volanteer_task;
export var volanteer_task_file;
export var volanteer_no_task_counter = 0;
export var volanteer_task_result;
export var volanteer_initial_state=
{
    id:null,
    task:{id:null,file:null,result:null},
    no_task_counter:0,
    enabled:false,
    job_done:0
}
window.volanteer_done_counter = 0;
window.volanteer_done_global_counter = 0;
window.volanteer_switch=false
window.volanteer_max_no_task_counter=60

export function volanteer_reducer(state=volanteer_initial_state,action)
{
    switch(action.type)
    {
        case "volanteer_join":
            return {...state,id:action.id}
        case "new task":
            return {...state,task:action.task}
        case "no task count":
            return {...state,no_task_counter:(state.no_task_counter+1)*!action.clear}
        case "volanteer activation":
            window.devMode && console.log("enabling volanteer")
            localStorage.setItem("volanteer_enabled",1)
            if(state.id==null)
            {
                window.volanteer_timer_id=setTimeout(volanteer_join,VOLANTEER_INTERSPACE_DELAY)
            }
            else
            {
                window.volanteer_timer_id=setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY)
            }
            return {...state,enabled:true}
        case "volanteer deactivation":
            window.devMode && console.log("disabling volanteer")
            localStorage.setItem("volanteer_enabled",0)
            clearTimeout(window.volanteer_timer_id)
            return {...state,enabled:false,task:{id:null,file:null,result:null},id:null}
        case "job done":
            return {...state,job_done:state.job_done++}
        default:
            return state
        
    }
}

export function volanteer_scheduler()
{
    window.devMode && console.log("volanteer_scheduler")
    window.volanteer_timer_id=setTimeout(volanteer_init, VOLANTEER_RUNNABLE_FIRST_DELAY);
}

function volanteer_init()
{
    window.devMode && console.log("volanteer_init")
    if (localStorage.getItem("volanteer_enabled")===null)
    {
        window.devMode && console.log("volanteer_init: enabling volanteer")
        if(performance.memory!==undefined && (performance.memory.jsHeapSizeLimit-performance.memory.usedJSHeapSize) / (1024**3) >= 4.0)
        {
            window.devMode && console.log("enabling volanteer")
            localStorage.setItem("volanteer_enabled",1)
            window.store.dispatch({type:"volanteer activation"})
        }
        else
        {
            // FIXME: the following condition should handle alternative way to detect 
            window.devMode && console.log("disabling volanteer")
            localStorage.setItem("volanteer_enabled",0)
            window.store.dispatch({type:"volanteer deactivation"})
        }
        
    }
    if (localStorage.getItem("volanteer_enabled")==1)
    window.volanteer_timer_id=setTimeout(volanteer_join,VOLANTEER_INTERSPACE_DELAY);
}

export async function volanteer_join()
{
    if(window.store.getState().volanteer?.id==null)
    {
        window.devMode && console.log("volanteer_join")
        let response = window.devMode ? fetch('http://localhost:80/volantiers/join/',
            {
                username: "asd",
                password: "1234"
            },
            {
                mode: 'no-cors',
                url: `http://localhost:80`,
                method: "get"
            }
        ) : fetch('volantiers/join/')

        volanteer_id = await response.then((res) => res.json())
    }
    if(window?.store.getState().volanteer?.enabled)
    {window.volanteer_timer_id=setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY);}
    else{window.devMode && console.log("volanteering disabled")}
    
}

export async function volanteer_get_task()
{
    window.devMode && console.log("volanteer_get_task")    
    let response=window.devMode? fetch(`http://localhost:80/volantier/${volanteer_id}/task`,
    {
        username: "asd",
        password: "1234"
    },
    {
        mode: 'no-cors',
        url:`http://localhost:80`,
        method:"get"
    }
    ):fetch(`volantier/${volanteer_id}/task`)
    
    volanteer_task= await response.then((res)=> res.json())
    if(Object.keys(volanteer_task).length !==0)
    {
        window.devMode && console.log(volanteer_task)
        let response=window.devMode?fetch(`http://localhost:80/volantier/${volanteer_id}/task_file/0`,
                {
                    username: "asd",
                    password: "1234"
                },
                {
                    mode: 'no-cors',
                    url:`http://localhost:80`,
                    method:"get"
                }
            ):fetch(`volantier/${volanteer_id}/task_file/0`);
        volanteer_task_file = await response.then((res)=> res.blob());
        // volanteer_task_file= await fetch(`volantier/${volanteer_id}/task_file/0`).then((res)=> res.blob())


        if(window?.store.getState().volanteer?.enabled)
        window.volanteer_timer_id=setTimeout(volanteer_process_task,VOLANTEER_INTERSPACE_DELAY);
        volanteer_no_task_counter=0;
    }
    else
    {
        window.devMode && console.log("no task")
        if(volanteer_no_task_counter < window.volanteer_max_no_task_counter)
        {
            volanteer_no_task_counter++;
            if(window?.store.getState().volanteer?.enabled)
            window.volanteer_timer_id=setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);
        }
        else
        {
            if(window?.store.getState().volanteer?.enabled)
            window.volanteer_timer_id=setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);  
        }
    }

}

export async function volanteer_process_task()
{
    window.devMode && console.log(`start working on ${volanteer_task}`)
    let img=await window.faceapi.bufferToImage(volanteer_task_file)
    volanteer_task_result = await window.faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()
    window.devMode && console.log(volanteer_task_result)
    let quit = await localStorage.getItem("volanteer_enabled")==1 ? 0 : 1 ; 
    window.devMode && console.log("sending result and getting new task")
    if (window.current_page=="Volanteering")
    {
        window.volanteer_done_counter++
    }
    window.volanteer_done_global_counter++
    
    let response=window.devMode?fetch(`http://localhost:80/Volanteer/Task/result/Id_${volanteer_id}/Task_Id_${volanteer_task.task_id}/Quit_${quit}`,
    {
        username: "asd",
        password: "1234"
    },
    {
        mode: 'no-cors',
        url:`http://localhost:80`,
        method:"post",
        body: JSON.stringify(volanteer_task_result)
    }
    ):fetch(`Volanteer/Task/result/Id_${volanteer_id}/Task_Id_${volanteer_task.task_id}/Quit_${quit}`,
    {
        method: 'POST',
        body: JSON.stringify(volanteer_task_result)
    })
    volanteer_task=await response.then((res)=> {
        window.devMode && console.log(res)
        if(window.current_page=="Volanteering")
        {
            window.volanteer_done_counter++
        }
        window.volanteer_done_global_counter++
        res.json() })
/*     volanteer_task=await fetch(`/Volanteer/Task/result/Id_${volanteer_id}/Task_Id_${volanteer_task.task_id}/Quit_${quit}`,
    {
        method: 'POST',
        body: JSON.stringify(volanteer_task_result)
    }).then(res=> {
        window.devMode && console.log(res)
        if(window.current_page=="Volanteering")
        {
            window.volanteer_done_counter++
        }
        window.volanteer_done_global_counter++
        res.json() })
 */        
        if(window?.store.getState().volanteer?.enabled)
        window.volanteer_timer_id=setTimeout(volanteer_process_task,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);  

        if(quit)
        {
            volanteer_id=null;
            volanteer_task=null;
            volanteer_task_file=null;
            volanteer_no_task_counter = 0;
            volanteer_task_result=null;
            window.volanteer_done_counter = 0;
        }
}