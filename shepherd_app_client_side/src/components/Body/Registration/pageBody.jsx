import React from 'react';
import { Box, /* Button, */ Container, CssBaseline, Grid, TextField, Typography, Fab/* , Input */ } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DateField } from '@mui/x-date-pickers/DateField';
// import {AppGlobalContext} from '../../../context';
import { AppGlobalContext } from '../../../App';
import Switch from '@mui/material/Switch';
import { delete_record, update_record } from '../../../db';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, /* useMap, */ useMapEvents, Marker } from 'react-leaflet'
import { Icon /* ,LatLngExpression,latLng */ } from 'leaflet';


function LocationMarker(props) {
    const markerIcon = new Icon
        ({
            iconUrl: "crosshair.png",
            iconSize: [38, 38],
        });
        
    const map = useMapEvents({
        click(e) {
            props.setMapPosition(e.latlng)
            window.devMode && console.log(e.latlng)
            props.setGeoLocation(`${e.latlng.lat},${e.latlng.lng}`)
            
        },
        locationfound(e) {
            props.setMapPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom(10),{duration: 1})
        },
    })

    React.useEffect(() => {
        if(window.map_rencount === null){map.locate({setView: true});window.map_rencount=1}

    })

    return props.mapPosition === null ? null : (
        <Marker position={props.mapPosition} icon={markerIcon} >
            {/* <Popup>You are here</Popup> */}
        </Marker>
    )
}


function Registration_page_body(props) {
    window.devMode && console.log(props.initial_record)
    const [geoLocation, setGeoLocation] = React.useState(props?.initial_record?.Location);
    const [personName, setPersonName] = React.useState(props?.initial_record?.Name);
    const [personAddress, setPersonAddress] = React.useState(props?.initial_record?.Address);
    const [personPhone, setPersonPhone] = React.useState(props?.initial_record?.Telephone);
    const [personClass, setPersonClass] = React.useState(props?.initial_record?.Class);
    const [personBirthdate, setPersonBirthdate] = React.useState(props?.initial_record?.Birthdate);
    const [activation, setActivation] = React.useState(true);
    const [editing, setEditing] = React.useState(props?.optional_editing);
    const [editing_switch, setEditing_switch] = React.useState(props?.default_editing_option === "read_only");
    const AppGlobalContxt = React.useContext(AppGlobalContext);
    const [mapPosition, setMapPosition] = React.useState(null)
    
    const switch_render = (state) => {
        window.devMode && console.log(state)
        if (state === "read_only") {
            return <Grid item container >
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Typography variant="h5" >Child data</Typography>
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                    <Typography>Read only</Typography>
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                    <Switch checked={editing} onChange={() => setEditing(!editing)} />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                    <Typography>Editable</Typography>
                </Grid>
            </Grid>
        }
        else {
            return // nothing
        }
    }


    function set_location(position) {
        const new_position = position.coords.latitude + ',' + position.coords.longitude
        setGeoLocation(new_position)
        setMapPosition([position.coords.latitude, position.coords.longitude])
        if (geoLocation !== new_position) {
            setActivation(false)
        }
    }
    async function fill_with_current_location() {
        if (navigator.geolocation) {
            window.devMode && console.log(navigator.geolocation.getCurrentPosition)
            navigator.geolocation.getCurrentPosition(set_location);
            window.devMode && console.log("Geolocation is detected")
        } else {
            window.devMode && console.log("Geolocation is not supported by this browser.")
        }
    }
    function check_direction_on_map() {
        //TODO: enable and disable of all inputs and buttons depending on switch state
        //TODO: render map check related to props.default_editing_option

        const ml = document.querySelector("#map_link")
        const direction = geoLocation
        ml.setAttribute("href", "https://www.google.com/maps/dir//" + direction)
        window.open("https://www.google.com/maps/dir//" + direction)
    }


    function submit_registration() {
        let check_counter = 7
        //TODO: implement warning on snak bar
        !Boolean(document.getElementById("registration_cam").value == '') ? check_counter-- : window.devMode && console.log("please select/take image");
        (Boolean(personName)) ? check_counter-- : window.devMode && console.log("please enter the name");
        (Boolean(personAddress)) ? check_counter-- : window.devMode && console.log("please enter the address");
        (Boolean(geoLocation)) ? check_counter-- : window.devMode && console.log("please enter the location");
        (Boolean(personClass)) ? check_counter-- : window.devMode && console.log("please choose class");
        (Boolean(personPhone)) ? check_counter-- : window.devMode && console.log("please enter the telephone");
        (Boolean(personBirthdate)) ? check_counter-- : window.devMode && console.log("please enter the birthdate");
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
                         window.devMode && console.log("children.add");
                         window.devMode && console.log(values)
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
                 window.devMode && console.log(error);
                    window.devMode && console.log(error)
                }
            }
        } else {
            window.devMode && console.log("Please fill all filds !!!")
        }

    }

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
                        {switch_render(props.default_editing_option)}
                        <Grid item xs={12} style={{ textAlign: "center" }} >
                            <input id="registration_cam" type="file" accept="image/*;capture=camera" hidden={true} onChange={
                                async () => {
                                    //FIXME:[kakram][severity:critical] if cam button is clicked in the second time, the pervious image not deleted before loading another 
                                    AppGlobalContxt.Bar.setProgressCircleStateWrapper('progress')
                                 window.devMode && console.log("cam change called")
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
                                    window.devMode && console.log(AppGlobalContxt)
                                    window.devMode && console.log("start scope");
                                    await window.faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then(
                                        (event) => {
                                            window.devMode && console.log(event)
                                            window.registration_discriptor = { ...event }
                                         window.devMode && console.log("remove disable");
                                            setActivation(false)
                                        }
                                    ).catch(
                                        (e) => window.devMode && console.log(e)
                                    ).finally(
                                        () => {
                                            window.faceapi.tf.engine().endScope();//kakram: to deallocate the memory selected in last scope
                                            AppGlobalContxt.Bar.setProgressCircleStateWrapper('done')
                                            window.devMode && console.log('Experiment completed');
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
                                            window.devMode && console.log(e.target.value)
                                            setActivation(false)
                                        }
                                    }
                                }
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <MapContainer center={[27.176469131898898, 31.18359368294478]} zoom={5} scrollWheelZoom={false} style={{ height: "300px" }} >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker mapPosition={mapPosition} setMapPosition={setMapPosition} setGeoLocation={setGeoLocation} />
                            </MapContainer>
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
        </Container>
    );
}

export default Registration_page_body;

