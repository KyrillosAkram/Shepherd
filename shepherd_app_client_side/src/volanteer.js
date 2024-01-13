import {signal} from '@preact/signals' 
export var VOLANTEER_RUNNABLE_FIRST_DELAY = 15000;
export var VOLANTEER_INTERSPACE_DELAY = 1000;
export var volanteer_id;
export var volanteer_task;
export var volanteer_task_file;
export var volanteer_no_task_counter = 0;
export var volanteer_task_result;
export var volanteer_done_counter = signal(0);
export var volanteer_done_global_counter = signal(0);
export var volanteer_switch=signal(false)

export function volanteer_scheduler()
{
    console.log("volanteer_scheduler")
    setTimeout(volanteer_init, VOLANTEER_RUNNABLE_FIRST_DELAY);
    volanteer_switch= signal(false);
    window.volanteer_switch= volanteer_switch;
}

function volanteer_init()
{
    console.log("volanteer_init")
    if (localStorage.getItem("volanteer_enabled")===null)
    {
        if(performance.memory!==undefined && (performance.memory.jsHeapSizeLimit-performance.memory.usedJSHeapSize) / (1024**3) >= 4.0)
        {
            console.log("enabling volanteer")
            localStorage.setItem("volanteer_enabled",1)
        }
        else
        {
            // FIXME: the following condition should handle alternative way to detect 
            console.log("disabling volanteer")
            localStorage.setItem("volanteer_enabled",0)
        }
        
    }
    if (localStorage.getItem("volanteer_enabled")==1)
    setTimeout(volanteer_join,VOLANTEER_INTERSPACE_DELAY);
}

export async function volanteer_join()
{
    console.log("volanteer_join")
    volanteer_id=await fetch('volantiers/join/').then((res)=> res.json())
    if(window.volanteer_switch!== undefined && !window.volanteer_switch.value)
    setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY);
    
}

export async function volanteer_get_task()
{
    console.log("volanteer_get_task")    
    volanteer_task= await fetch(`volantier/${volanteer_id}/task`).then((res)=> res.json())
    if(Object.keys(volanteer_task).length !==0)
    {
        console.log(volanteer_task)
        volanteer_task_file= await fetch(`volantier/${volanteer_id}/task_file/0`).then((res)=> res.blob())


        if(window.volanteer_switch!== undefined && !volanteer_switch.value)
        setTimeout(volanteer_process_task,VOLANTEER_INTERSPACE_DELAY);
        volanteer_no_task_counter=0;
    }
    else
    {
        console.log("no task")
        if(volanteer_no_task_counter < 5)
        {
            volanteer_no_task_counter++;
            if(window.volanteer_switch!== undefined && !volanteer_switch.value)
            setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);
        }
        else
        {
            if(window.volanteer_switch!== undefined && !volanteer_switch.value)
            setTimeout(volanteer_join,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);  
        }
    }

}

export async function volanteer_process_task()
{
    console.log(`start working on ${volanteer_task}`)
    let img=await window.faceapi.bufferToImage(volanteer_task_file)
    volanteer_task_result = await window.faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()
    console.log(volanteer_task_result)
    let quit = await localStorage.getItem("volanteer_enabled")==1 ? 0 : 1 ; 
    console.log("sending result and getting new task")
    if (window.current_page.value=="Volanteering")
    {
        volanteer_done_counter.value++
    }
    volanteer_done_global_counter.value++
    volanteer_task=await fetch(`/Volanteer/Task/result/Id_${volanteer_id}/Task_Id_${volanteer_task.task_id}/Quit_${quit}`,
    {
        method: 'POST',
        body: JSON.stringify(volanteer_task_result)
    }).then(res=> {
        console.log(res)
        if(window.current_page.value=="Volanteering")
        {
            volanteer_done_counter.value++
        }
        volanteer_done_global_counter.value++
        res.json() })
        
        if(window.volanteer_switch!== undefined && !volanteer_switch.value && !quit )
        setTimeout(volanteer_process_task,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);  

        if(quit)
        {
            volanteer_id=null;
            volanteer_task=null;
            volanteer_task_file=null;
            volanteer_no_task_counter = 0;
            volanteer_task_result=null;
            volanteer_done_counter = 0;

           
        }
}