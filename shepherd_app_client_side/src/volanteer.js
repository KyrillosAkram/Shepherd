
var VOLANTEER_RUNNABLE_FIRST_DELAY = 15000;
var VOLANTEER_INTERSPACE_DELAY = 1000;
var volanteer_id;
var volanteer_task;
var volanteer_task_file;
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
        volanteer_task_file= await fetch(`volantier/${volanteer_id}/task_file/0`).then((res)=> res.blob())


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
    console.log(`start working on ${volanteer_task}`)
    let img=await faceapi.bufferToImage(volanteer_task_file)
    volanteer_task_result = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()
    console.log(volanteer_task_result)
    let quit = await localStorage.getItem("volanteer_enabled")==1 ? 0 : 1 ; 
    console.log("sending result and getting new task")
    volanteer_task=await fetch(`/Volanteer/Task/result?Id=${volanteer_id}&Task_Id=${volanteer_task.task_id}&Quit=${quit}`,
    {
        method: 'POST',
        body: volanteer_task_result[0]
    }).then(res=> res.json())
}