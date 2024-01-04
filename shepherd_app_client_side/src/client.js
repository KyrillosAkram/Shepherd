// the following prototype is used for testing purposes
await fetch('/Task/submit?' + new URLSearchParams({
    type: 'facial_landmark@128'
}),
                                { method: "POST",body:document.getElementById("demo").files[0]}).then(async res=>res.text())