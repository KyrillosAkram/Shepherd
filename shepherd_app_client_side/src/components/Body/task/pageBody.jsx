import React from 'react';
import { Box, Button, Container, CssBaseline, Grid, TextField, Typography ,Fab,Input } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
// import {AppGlobalContext} from '../../../context';
import {AppGlobalContext} from '../../../App';
import Switch from '@mui/material/Switch';
import {delete_record,update_record} from '../../../db';

function Registration_page_body(props) {
    console.log(props.initial_record)
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

//multiple istances
// $('.geolocs').leafletLocationPicker();

//custom location format
// $('#geoloc2').leafletLocationPicker({
// 	locationFormat: '{lat}@{lng}#WGS84',
// 	position: 'bottomleft'
// });

//events
// $('#geoloc3').leafletLocationPicker({
// 		locationSep: ' - '
// 	})
// 	.on('show', function(e) {
// 		$(this).siblings('em').text('click on map for insert the location');
// 	})
// 	.on('hide', function(e) {
// 		$(this).siblings('em').text('');
// 	})
// 	.on('changeLocation', function(e) {
// 		$(this)
// 		.siblings('#geolat').val( e.latlng.lat )
// 		.siblings('#geolng').val( e.latlng.lng )
// 		.siblings('i').text('"'+e.location+'"');
// 	});

//callback
//
//fix n alwaysOpen
/* document.querySelector('div#map').leafletLocationPicker({
		alwaysOpen: true,
		mapContainer: "#fixedMapCont"
}); */
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                style={{
                    // marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{ textAlign: "center" }} >
                            <input id="registration_cam" type="file" accept="image/*;capture=camera" hidden={true} onChange={
                                async () => {
                                    //FIXME:[kakram][severity:critical] if cam button is clicked in the second time, the pervious image not deleted before loading another 
                                    // return;
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
                                        (event) => {
                                            console.log(event)
                                            window.registration_discriptor = { ...event }
                                        /*debugging &*/ console.log("remove disable");
                                            setActivation(false)
                                        }
                                    ).catch(
                                        (e) => console.log(e)
                                    ).finally(
                                        () => {
                                            window.faceapi.tf.engine().endScope();//kakram: to deallocate the memory selected in last scope
                                            AppGlobalContxt.Bar.setProgressCircleStateWrapper('done')
                                            console.log('Experiment completed');
                                        }
                                    );
                                }
                            } />
                            <Fab color="primary" aria-label="add" size="medium"
                                onClick={() => document.querySelector('#registration_cam').click()}
                                disabled={props?.default_editing_option === "read_only"}
                            >
                                <PhotoCameraIcon />
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
                                        if (props?.default_editing_option === "read_only" && props?.initial_record?.Name !== e.target.value) {
                                            setActivation(false)
                                        }
                                    }
                                }
                                disabled={!editing}
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
                                        if (props?.default_editing_option === "read_only" && props?.initial_record?.Address !== e.target.value) {
                                            setActivation(false)
                                        }
                                    }
                                }
                                disabled={!editing}
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
                                        if (props?.default_editing_option === "read_only" && props?.initial_record?.Class !== e.target.value) {
                                            setActivation(false)
                                        }
                                    }
                                }
                                disabled={!editing}
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
                                        if (props?.default_editing_option === "read_only" && props?.initial_record?.Birthdate !== e.target.value) {
                                            setActivation(false)
                                        }
                                    }
                                }
                                disabled={!editing}
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
                                        if (props?.default_editing_option === "read_only" && props?.initial_record?.Telephone !== e.target.value) {
                                            setActivation(false)
                                        }
                                    }
                                }
                                disabled={!editing}
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
                                onChange={
                                    (e) => {
                                        setGeoLocation(e.target.value)
                                        if (props?.default_editing_option === "read_only" && props?.initial_record?.Location !== e.target.value) {
                                            console.log(e.target.value)
                                            setActivation(false)
                                        }
                                    }
                                }
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Fab color="primary" aria-label="Submit" size="small" sx={{ mt: 3, mb: 2 }}
                                margin='none' onClick={() => fill_with_current_location()} disabled={!editing}>
                                <MyLocationIcon />
                            </Fab>
                            <span>  </span>
                            <Fab color="primary" aria-label="CheckLocationGoogleMap" size="small" sx={{ mt: 3, mb: 2 }}
                                margin='none' onClick={() => check_direction_on_map()} disabled={!editing} >
                                <MapIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }} hidden={(props.default_editing_option === "read_only")}>
                        <Fab color="primary" variant="extended" aria-label="Submit" size="small" disabled={activation} sx={{ mt: 3, mb: 2 }} onClick={() => submit_registration()}>
                            <CheckIcon />
                            Submit
                        </Fab>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={2} style={{ textAlign: "center" }} hidden={(props.default_editing_option !== "read_only")}>
                            <Fab color="error" /* variant="extended" */ aria-label="Update" size="small" disabled={false} sx={{ mt: 3, mb: 2 }} onClick={async () => { delete_record(props.initial_record.Name) }}>
                                <DeleteOutlineIcon />
                                {/* Update */}
                            </Fab>
                        </Grid>
                        <Grid item xs={8} style={{ textAlign: "center" }} hidden={(props.default_editing_option !== "read_only")}>
                            <span>  </span>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: "center" }} hidden={(props.default_editing_option !== "read_only")}>
                            <Fab color="primary" /* variant="extended" */ aria-label="Update" size="small" disabled={activation} sx={{ mt: 3, mb: 2 }} onClick={async () => {
                                update_record(
                                    personName,
                                    {
                                        Name: personName,
                                        Address: personAddress,
                                        Location: geoLocation,
                                        Class: personClass,
                                        Discriptor: props.initial_record.Discriptor,
                                        Telephone: personPhone,
                                        Birthdate: personBirthdate
                                    }
                                )
                                if (props?.default_editing_option === "read_only" && props?.initial_record?.Name !== personName) {
                                    delete_record(props.initial_record.Name)
                                }
                            }}>
                                <SaveIcon />
                                {/* Update */}
                            </Fab>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <a href="" id="map_link" hidden={true} target="_blank"></a>
            <div class="row" id="image_section"></div>
            <div id="map"></div>
        </Container>
);
}

export default Registration_page_body;

