import React from 'react';
import { Box, Button, Container, CssBaseline, Grid, TextField, Typography ,Fab,Input } from '@mui/material';
// import {AppGlobalContext} from '../../../context';
import {AppGlobalContext} from '../../../App';
import Switch from '@mui/material/Switch';
import { volanteer_join, volanteer_get_task, volanteer_process_task,volanteer_id,VOLANTEER_INTERSPACE_DELAY/* ,volanteer_done_counter */} from '../../../volanteer';
import { sleep } from '../../../util';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';


const page_state_selector = createSelector(
    [ (state) => state.volanteer.enabled ],(volanteer_enabled)=>volanteer_enabled
)

function Volanteering_page_body(props) {
    const volanteer_enabled = useSelector(page_state_selector)
    async function changeAction(event)
    {
        window.devMode && console.log(event)
        // window.volanteer_switch = event.target.checked
        // setdummy4render(event.target.checked)
        window.devMode && console.log(window.volanteer_switch)
        window.devMode && console.log("changed")
        window.devMode && console.log(props.volanteering)
        // if(volanteer_id === undefined || volanteer_id === null)
        // {
        //     //FIXME: the following line throw error
        //     await volanteer_join()
        //     window.devMode && console.log("handle volanteer ID")
        // }
        // await volanteer_get_task()
        // while(window.volanteer_switch)
        // {
        //     await volanteer_process_task()
        //     await sleep(VOLANTEER_INTERSPACE_DELAY)
        // }
        return props.volanteer_enable_toggle()
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
                        <Grid item xs={12} style={{ textAlign: "center" }} >
                            <Switch checked={volanteer_enabled} onChange={changeAction} inputProps={{ 'aria-label': 'controlled' }} />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center" }} >
                            <Typography variant="h5" >finished tasks : {window.volanteer_done_counter} </Typography>
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

function mapStateToProps(state) {
    return {
        volanteering: state.volanteering,
    };
}
function volanteer_enable_toggle()
{
    window.devMode && console.log("volanteer_enable_toggle")
    return window.store.getState().volanteer.enabled?{type:"volanteer deactivation"}:{type:"volanteer activation"}
}
const mapDispatchToProps = {
    volanteer_enable_toggle
}
export default connect(mapStateToProps, mapDispatchToProps)(Volanteering_page_body); //Volanteering_page_body;

