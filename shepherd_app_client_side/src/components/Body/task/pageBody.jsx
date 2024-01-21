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

function Task_page_body(props) {
    window.devMode && console.log(props.initial_record)
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
                            <input id="demo" type="file" accept="image/*;capture=camera" hidden={false} onChange={
                                async () => {

                                }
                            } />
                            <Fab color="primary" aria-label="add" size="medium"
                                onClick={async() => window.submit_task_response=await fetch("/Task/submit",
                                { method: "POST",body:document.getElementById("demo").files[0]}) }
                                
                            >
                                S
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

export default Task_page_body;

