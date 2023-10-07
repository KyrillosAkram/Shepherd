import React from 'react';
import { Box, Button, Container, CssBaseline, Grid, TextField, Typography ,Fab,Input } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
// import {AppGlobalContext} from '../../../context';
import {AppGlobalContext} from '../../../App';
import Switch from '@mui/material/Switch';

function Registration_page_body(props) {
    const [geoLocation, setGeoLocation] = React.useState(props?.initial_record?.Location);
    const [personName, setPersonName] = React.useState(props?.initial_record?.Name);
    const [personAddress, setPersonAddress] = React.useState(props?.initial_record?.Address);
    const [personPhone, setPersonPhone] = React.useState(props?.initial_record?.Telephone);
    const [personClass,setPersonClass] = React.useState(props?.initial_record?.Class);
    const [personBirthdate, setPersonBirthdate] = React.useState(props?.initial_record?.Birthdate);
    const [activation, setActivation] = React.useState(true);
    const [editing,setEditing] = React.useState(props?.optional_editing);
    const [editing_switch,setEditing_switch] = React.useState(props?.default_editing_option === "read_only");
    const AppGlobalContxt = React.useContext(AppGlobalContext);
    const switch_render=(state)=>
    {
        if (state === "read only") {
            return  <Grid item container >
                        <Grid item xs={12}>
                            <Typography>Child data</Typography>
                        </Grid>
                        <Grid>
                            <Typography>Read only</Typography>
                            <Switch checked={editing} />
                            <Typography>Editable</Typography>
                        </Grid>
                    </Grid>
        }
        else
        {
            return // nothing
        }
    }


    function set_location(position) {
        setGeoLocation(position.coords.latitude + ',' + position.coords.longitude)
    }
    async function fill_with_current_location() {
        // console.log(AppGlobalContxt)
        if (navigator.geolocation) {
            console.log(navigator.geolocation.getCurrentPosition)
            navigator.geolocation.getCurrentPosition(set_location);
            console.log("Geolocation is detected")
        } else {
            console.log("Geolocation is not supported by this browser.")
        }
    }
    function check_direction_on_map() {
//TODO: enable and disable of all inputs and buttons depending on switch state
//TODO: render map check related to props.default_editing_option


        // document.querySelector("#Location").value
        const ml = document.querySelector("#map_link")
        const direction = geoLocation
        ml.setAttribute("href", direction)
        // trigger(ml,'click')
        // ml.click()
        window.open(direction)
    }
    

    function submit_registration()
    {
        let check_counter = 7
        //TODO: implement warning on snak bar
        !Boolean(document.getElementById("registration_cam").value == '') ? check_counter-- : console.log("please select/take image");
        (Boolean(personName)) ? check_counter-- : console.log("please enter the name");
        (Boolean(personAddress)) ? check_counter-- : console.log("please enter the address");
        (Boolean(geoLocation)) ? check_counter-- : console.log("please enter the location");
        (Boolean(personClass)) ? check_counter-- : console.log("please choose class");
        (Boolean(personPhone)) ? check_counter-- : console.log("please enter the telephone");
        (Boolean(personBirthdate)) ? check_counter-- : console.log("please enter the birthdate");
        if (!check_counter) {// if all checks are ok
            if (Boolean(window.db)) {
                try {
                    let trx = window.db.transaction("children", "readwrite")
                    let children = trx.objectStore("children");
                    Promise.all([new window.faceapi.LabeledFaceDescriptors(document.querySelector("#Name").value, [window.registration_discriptor.descriptor])]).then((values) => {
                        children.put(
                            {
                                Name: personName,
                                Address: personAddress,
                                Location: geoLocation,
                                Class: personClass,
                                Discriptor: values[0],
                                Telephone: personPhone,
                                Birthdate: personBirthdate
                            }
                        )
                        /*debugging &*/ console.log("children.add");
                        /*debugging &*/ console.log(values)
                    }).finally(() => {
                        window.registration_discriptor = null
                        setPersonName('')
                        setPersonAddress('')
                        setGeoLocation('')
                        setPersonClass('')
                        setPersonPhone('')
                        setPersonBirthdate('')
                        setActivation(true)
                        document.getElementById("image_section").replaceChildren()

                    })
                    window.registration_discriptor = null;
                } catch (error) {
                /*debugging &*/ console.log(error);
                    console.log(error)
                }
            }
        } else {
            console.log("Please fill all filds !!!")
        }

    }
    
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    // marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                            switch_render(props.default_editing_option)
                           



                            
                        

                        <Grid item xs={12} >
                            <input id="registration_cam" type="file" accept="image/*;capture=camera" hidden={true} onChange={
                                async () => {
                                //FIXME:[kakram][severity:critical] if cam button is clicked in the second time, the pervious image not deleted before loading another 
                                AppGlobalContxt.Bar.setProgressCircleStateWrapper('progress')
                                /*debugging &*/ console.log("cam change called")
                                let image;//, canvas;
                                const container = document.getElementById("image_section")
                                if (image) image.remove()
                                // if (canvas) canvas.remove()
                                image = await window.faceapi.bufferToImage(document.getElementById("registration_cam").files[0])
                                image.style.height = 'auto'
                                image.style.width = `${document.querySelector('input#Name').clientWidth}px`
                    
                                container.append(image)
                                //kakram:the following line needed to make the start of the allocated memory for this operation to be freed after finishing
                                //please check the following issue for more details https://github.com/vladmandic/face-api/issues/25
                                window.faceapi.tf.engine().startScope();
                                console.log(AppGlobalContxt)
                                console.log("start scope");
                                await window.faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then(
                                    (event) =>
                                    {
                                        console.log(event)
                                        window.registration_discriptor = { ...event }
                                        /*debugging &*/ console.log("remove disable");
                                        setActivation(false)
                                    }
                                ).catch(
                                    (e)=>console.log(e)
                                ).finally(
                                    () =>
                                    {
                                        window.faceapi.tf.engine().endScope();//kakram: to deallocate the memory selected in last scope
                                            AppGlobalContxt.Bar.setProgressCircleStateWrapper('done')
                                        console.log('Experiment completed');
                                    }
                                  );
                            }
                         }/>
                         <Fab color="primary" aria-label="add" size="medium"
                         onClick={()=>document.querySelector('#registration_cam').click()}
                         >
                            <PhotoCameraIcon/>
                         </Fab>
                         </Grid>
                       <Grid item xs={12} >
                            <TextField
                                autoComplete="name"
                                name="Name"
                                required
                                type='text'
                                fullWidth
                                id="Name"
                                label="Name"
                                autoFocus
                                variant='standard'
                                margin='none'
                                value={personName}
                                onChange={
                                    (e) => {
                                        setPersonName(e.target.value)
                                    }
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="Address"
                                label="Address"
                                name="Address"
                                autoComplete="Address"
                                variant='standard'
                                margin='none'
                                value={personAddress}
                                onChange={
                                    (e) => {
                                        setPersonAddress(e.target.value)
                                    }
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="Class"
                                select
                                label="Class"
                                defaultValue=""
                                variant="standard"
                                fullWidth
                                margin='none'
                                required
                                value={personClass}
                                onChange={
                                    (e) => {
                                        setPersonClass(e.target.value)
                                    }
                                }
                            >
                                
                                <MenuItem key={0} value={0}>0</MenuItem>
                                <MenuItem key={1} value={1}>1</MenuItem>
                                <MenuItem key={2} value={2}>2</MenuItem>
                                <MenuItem key={3} value={3}>3</MenuItem>
                                <MenuItem key={4} value={4}>4</MenuItem>
                                <MenuItem key={5} value={5}>5</MenuItem>
                                <MenuItem key={6} value={6}>6</MenuItem>
                                
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                type='date'
                                defaultValue=""
                                fullWidth
                                id="Birthdate"
                                label="Birthdate"
                                name="Birthdate"
                                // autoComplete="Birthdate"
                                variant='standard'
                                margin='none'
                                focused
                                format="DD-MM-YYYY"
                                value={personBirthdate}
                                onChange={
                                    (e) => {
                                        setPersonBirthdate(e.target.value)
                                    }
                                }
                            />
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                required
                                type='date'
                                defaultValue=""
                                fullWidth
                                id="Birthdate"
                                label="Birthdate"
                                name="Birthdate"
                                // autoComplete="Birthdate"
                                variant='standard'
                                margin='none'
                                focused
                                format="DD-MM-YYYY"
                                value={personBirthdate}
                                onChange={
                                    (e) => {
                                        setPersonBirthdate(e.target.value)
                                    }
                                }
                              />
                            </LocalizationProvider> */}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="WhatsApp_Number"
                                label="WhatsApp_Number"
                                name="WhatsApp_Number"
                                autoComplete="WhatsApp_Number"
                                type='tel'
                                variant='standard'
                                margin='none'
                                value={personPhone}
                                onChange={
                                    (e) => {
                                        setPersonPhone(e.target.value)
                                    }
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="Location"
                                label="Location"
                                name="Location"
                                autoComplete="Location"
                                variant='standard'
                                margin='none'
                                value={geoLocation}
                                onChange={(e)=>setGeoLocation(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Fab color="primary" aria-label="Submit" size="small" sx={{ mt: 3, mb: 2 }}
                                margin='none' onClick={() => fill_with_current_location()} >
                                <MyLocationIcon />
                            </Fab>
                            <Fab color="primary" aria-label="CheckLocationGoogleMap" size="small" sx={{ mt: 3, mb: 2 }}
                                margin='none' onClick={() => check_direction_on_map()} >
                                <MapIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                    <Fab color="primary" variant="extended" aria-label="Submit" size="small" disabled={activation} sx={{ mt: 3, mb: 2 }} onClick={() => submit_registration()}>

                        <CheckIcon />
                        Submit
                    </Fab>
                </Box>
            </Box>
            <a href="" id="map_link" hidden={true} target="_blank"></a>
            <div class="row" id="image_section"></div>
        </Container>
    );
}

export default Registration_page_body;

