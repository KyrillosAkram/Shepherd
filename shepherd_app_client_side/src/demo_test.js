async function test()
{
	var VOLANTEER_RUNNABLE_FIRST_DELAY = 15000;
	var VOLANTEER_INTERSPACE_DELAY = 1000;
	var volanteer_id;
	var volanteer_task;
	var volanteer_task_file;
	volanteer_id=await fetch('volantiers/join/').then((res)=> res.json())
	console.log(volanteer_id)
	volanteer_task_id=await fetch('/Task/submit?' + new URLSearchParams({
    type: 'facial_landmark@128'}),
		{ method: "POST",body:document.getElementById("demo").files[0]}).then(async res=>res.text())
	console.log(volanteer_task_id)
	volanteer_task= await fetch(`volantier/${volanteer_id}/task`).then((res)=> res.json()) 
	console.log(volanteer_task)
	volanteer_task_file= await fetch(`volantier/${volanteer_id}/task_file/0`).then((res)=> res.blob())
	console.log(volanteer_task_file)
	let img=await window.faceapi.bufferToImage(volanteer_task_file)
	console.log(img)
	volanteer_task_result = await window.faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors() 
	console.log(volanteer_task_result)
	volanteer_task=await fetch(`/Volanteer/Task/result/Id_${volanteer_id}/Task_Id_${volanteer_task.task_id}/Quit_${0}`,
    {
        method: 'POST',
        body: JSON.stringify( volanteer_task_result[0])
    }).then(res=> res.json())
	console.log(volanteer_task)
}
await test()