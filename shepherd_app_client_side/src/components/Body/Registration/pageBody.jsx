import React from 'react';
import { Box, Button, Container, CssBaseline, Grid, TextField, Typography ,Fab,Input } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import MyLocationIcon from '@mui/icons-material/MyLocation';

function Registration_page_body() {
    const [geoLocation, setGeoLocation] = React.useState();
    function set_location(position) {
        // console.log('set_location')
        // console.log(position)
        setGeoLocation(position.coords.latitude + ',' + position.coords.longitude)
    }
    async function fill_with_current_location() {
      if (navigator.geolocation) {
        console.log(navigator.geolocation.getCurrentPosition)
          navigator.geolocation.getCurrentPosition(set_location);
    //        console.log( "Geolocation is detected" );
        console.log("Geolocation is detected")
      } else {
    //        console.log( "Geolocation is not supported by this browser." );
        console.log("Geolocation is not supported by this browser.")
      }
    }

    function submit_registration() {
    let check_counter = 7
    Boolean(document.querySelector("#registration_cam").value) ? check_counter-- : console.log( "please select/take image" );
    (Boolean(document.querySelector("#Name").value)) ? check_counter-- : console.log( "please enter the name" );
    (Boolean(document.querySelector("#Address").value)) ? check_counter-- : console.log( "please enter the address" );
    (Boolean(document.querySelector("#Location").value)) ? check_counter-- : console.log( "please enter the location" );
    (Boolean(document.querySelector("#Class").value)) ? check_counter-- : console.log( "please choose class" );
    (Boolean(document.querySelector("#telephone").value)) ? check_counter-- : console.log( "please enter the telephone" );
    (Boolean(document.querySelector("#birthdate").value)) ? check_counter-- : console.log( "please enter the birthdate" );
    if (!check_counter) {// if all checks are ok
        if (Boolean(window.db)) {
            try {
                let trx = window.db.transaction("children", "readwrite")
                let children = trx.objectStore("children");
                Promise.all([new window.faceapi.LabeledFaceDescriptors(document.querySelector("#Name").value, [window.registration_discriptor.descriptor])]).then((values) => {
                    children.put(
                        {
                            Name: document.querySelector("#Name").value,
                            Address: document.querySelector("#Address").value,
                            Location: document.querySelector("#Location").value,
                            Class: document.querySelector("#Class").value,
                            Discriptor: values[0],
                            Telephone: document.querySelector("#telephone").value,
                            Birthdate: document.querySelector("#birthdate").value
                        }
                    )
                    /*debugging &*/ console.log("children.add");
                    /*debugging &*/ console.log(values)
                    window.registration_discriptor = null
                    document.querySelector("#Name").value = ''
                    document.querySelector("#Address").value = ''
                    document.querySelector("#Location").value = ''
                    document.querySelector("#Class").value = '?'
                    document.querySelector("li.selected").classList.remove("selected")
                    document.querySelector("li.disabled").classList.add("selected")
                    document.querySelector("#telephone").value = ''
                    document.querySelector("#birthdate").value = ''
                    document.querySelector("#registeration_submit").classList.add("disabled")
                })
                window.registration_discriptor = null;
            } catch (error) {
                /*debugging &*/ console.log(error);
                console.log( error )
            }
        }
    } else {
        console.log( "Please fill all filds !!!" )
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
                <Box component="form"  sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                         <Grid item xs={12} >
                         <input id="registration_cam" type="file" accept="image/*;capture=camera" hidden={true} onChange={
                             async () => {
                                //TODO : need async improvment
                                /*debugging &*/ console.log("cam change called")
                                let image, canvas;
                                const container = document.getElementById("image_section")
                                if (image) image.remove()
                                if (canvas) canvas.remove()
                                image = await window.faceapi.bufferToImage(document.getElementById("registration_cam").files[0])
                    
                                container.append(image)
                                window.faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then((event) => {
                                    console.log(event)
                                    window.registration_discriptor = { ...event }
                                    /*debugging &*/ console.log("remove disable");
                                    // document.querySelector("#registeration_submit").removeClass("disabled")
                                }).catch((e)=>console.log(e))
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="Class"
                                select
                                label="Class"
                                defaultValue=""
                                // SelectProps={{
                                //     native: true,
                                // }}
                                // helperText="Please select your currency"
                                variant="standard"
                                fullWidth
                                // size='medium'
                                margin='none'
                                required
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
                                // value={}
                                // onChange={}
                                id="Birthdate"
                                label="Birthdate"
                                name="Birthdate"
                                // autoComplete="Birthdate"
                                variant='standard'
                                margin='none'
                                focused
                            />
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
                    <Fab color="primary" aria-label="Submit" size="small"  sx={{ mt: 3, mb: 2 }}
                    margin='none' onClick={() =>fill_with_current_location()} >
                    <MyLocationIcon/>
                    </Fab>
                    </Grid>                   
                    </Grid>
                    <Fab color="primary" variant="extended" aria-label="Submit" size="small" disabled={false} sx={{ mt: 3, mb: 2 }} >
                        
                    <CheckIcon/>
                    Submit
                    </Fab>
                        <div class="row" id="image_section"></div>
                </Box>
            </Box>
        </Container>
    );
}

export default Registration_page_body;

