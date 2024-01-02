
var VOLANTEER_RUNNABLE_FIRST_DELAY = 15000;
var VOLANTEER_INTERSPACE_DELAY = 1000;
var volanteer_id;
var volanteer_task;
var volanteer_no_task_counter = 0;
var volanteer_task_result;
export function volanteer_scheduler()
{
    console.log("volanteer_scheduler")
    setTimeout(volanteer_init, VOLANTEER_RUNNABLE_FIRST_DELAY);
}

function volanteer_init()
{
    console.log("volanteer_init")
    if (localStorage.getItem("volanteer_enabled")===null)
    {
        if((performance.memory.jsHeapSizeLimit-performance.memory.usedJSHeapSize) / (1024**3) >= 4.0)
        {
            console.log("enabling volanteer")
            localStorage.setItem("volanteer_enabled",1)
        }
        else
        {
            console.log("disabling volanteer")
            localStorage.setItem("volanteer_enabled",0)
        }
        
    }
    if (localStorage.getItem("volanteer_enabled")==1)
    setTimeout(volanteer_join,VOLANTEER_INTERSPACE_DELAY);
}

async function volanteer_join()
{
    console.log("volanteer_join")
    volanteer_id=await fetch('volantiers/join/').then((res)=> res.json())
    setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY);
    
}

async function volanteer_get_task()
{
    console.log("volanteer_get_task")    
    volanteer_task= await fetch(`volantier/${volanteer_id}/task`).then((res)=> res.json())
    if(Object.keys(volanteer_task).length !==0)
    {
        console.log(volanteer_task)
        setTimeout(volanteer_process_task,VOLANTEER_INTERSPACE_DELAY);
        volanteer_no_task_counter=0;
    }
    else
    {
        console.log("no task")
        if(volanteer_no_task_counter < 5)
        {
            volanteer_no_task_counter++;
            setTimeout(volanteer_get_task,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);
        }
        else
        {
            setTimeout(volanteer_join,VOLANTEER_INTERSPACE_DELAY+volanteer_no_task_counter*1000);  
        }
    }

}

async function volanteer_process_task()
{
    let buffers = volanteer_task.payload
    console.log(`start working on ${volanteer_task}`)
    let detected_descriotor_arr = await Promise.all(//to await image
          [...buffers].map(window.faceapi.bufferToImage)
        )
    volanteer_task.result=[]

    for (let image of detected_descriotor_arr)
    {
        volanteer_task.result.push(await window.faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors())
    }
    
}