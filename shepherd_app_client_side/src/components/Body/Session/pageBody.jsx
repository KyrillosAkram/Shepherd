import React, { useEffect } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Fab from '@mui/material/Fab';
import { Stack } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import RuleIcon from '@mui/icons-material/Rule';
import Typography from "@mui/material/Typography";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CustomizedTable, { createData } from "../../Common_Components/List_Table/list_table";
import ActionMenu from "./ActionMenu";
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemIcon from '@mui/material/ListItemIcon';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ManualAddModal from "../../Common_Components/manual_add_Modal/ManualAddModal";


/**
 * Renders a nested list component with collapsible sections.
 *
 * @param {object} props - The properties passed to the component.
 * @return {JSX.Element} The rendered nested list component.
 */
function NestedList(props) {
 
  const handleClick = (e) => {
    switch (e.target.innerText) {
      case "Going":
        props.setOpenGoing(!props.openGoing);
        break;
      case "Returning":
        props.setOpenReturning(!props.openReturning);
        break;
      case "Missing":
        props.setOpenMissing(!props.openMissing);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div style={{ margin: " 10px 0 10px 0" }}></div>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 3 }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <ChecklistRtlIcon />
          </ListItemIcon>
          <ListItemText primary="Going" />
          {props.openGoing ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={props.openGoing} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <CustomizedTable header_cells={[
                "Name",
                "Class",
                "Address"
              ]} columns_align={['left','right','right']} rows={props.Going_list} setRows={props.setGoing_list_wrapper}  selected_count={props.Going_selected_count} setSelected_count={props.setGoing_selected_count} />
          </List>
        </Collapse>
      </List>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 3 }}
        component="nav"
        aria-labelledby="nested-list-subheader">
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <RuleIcon />
          </ListItemIcon>
          <ListItemText primary='Returning' />
          {props.openReturning ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={props.openReturning} timeout="auto" unmountOnExit>
          <List component='div' disablePadding>
            <CustomizedTable header_cells={[
                "Name",
                "Class",
                "Address"
              ]} columns_align={['left','right','right']} rows={props.Returning_list} setRows={props.setReturning_list_wrapper} selected_count={props.Returning_selected_count} setSelected_count={props.setReturning_selected_count} />

          </List>
        </Collapse>
      </List>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 3 }}
        component="nav"
        aria-labelledby="nested-list-subheader">
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <PersonSearchIcon />
          </ListItemIcon>
          <ListItemText primary='Missing' />
          {props.openMissing ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={props.openMissing} timeout="auto" unmountOnExit>
          <List component='div' disablePadding>
            <CustomizedTable header_cells={[
                "Name",
                "Class",
                "Address"
              ]} columns_align={['left','right','right']} rows={props.Missing_list} setRows={props.setMissing_list_wrapper} />

          </List>
        </Collapse>
      </List>
      <div style={{ margin: " 10px 0 10px 0" }}></div>
      <Typography>[ Going: {props.Going_count} | Returning: {props.Returning_count} | Missing: {props.Missing_count} ]</Typography>
    </>
  );
}


/**
 * Renders a nested list component with collapsible sections for "Going", "Returning", and "Missing".
 *
 * @param {object} props - The props object containing the data and state for the component.
 * @param {boolean} props.openGoing - The state for the "Going" section's open/closed state.
 * @param {boolean} props.openReturning - The state for the "Returning" section's open/closed state.
 * @param {boolean} props.openMissing - The state for the "Missing" section's open/closed state.
 * @param {function} props.setOpenGoing - The function to update the "Going" section's open/closed state.
 * @param {function} props.setOpenReturning - The function to update the "Returning" section's open/closed state.
 * @param {function} props.setOpenMissing - The function to update the "Missing" section's open/closed state.
 * @param {array} props.Going_list - The data for the "Going" section.
 * @param {function} props.setGoing_list_wrapper - The function to update the data for the "Going" section.
 * @param {array} props.Returning_list - The data for the "Returning" section.
 * @param {function} props.setReturning_list_wrapper - The function to update the data for the "Returning" section.
 * @param {array} props.Missing_list - The data for the "Missing" section.
 * @param {function} props.setMissing_list_wrapper - The function to update the data for the "Missing" section.
 * @param {number} props.Going_count - The count for the "Going" section.
 * @param {number} props.Returning_count - The count for the "Returning" section.
 * @param {number} props.Missing_count - The count for the "Missing" section.
 * @return {JSX.Element} The rendered nested list component.
 *
 * @plantuml
 * class NestedList {
 *   props: object
 *   handleClick(): void
 * }
 */
export default function Session_page_body() {
  const [openGoing, setOpenGoing] = React.useState(false);
  const [openReturning, setOpenReturning] = React.useState(false);
  const [openMissing, setOpenMissing] = React.useState(false);
  const [Going_count, setGoing_count] = React.useState(0);
  const [Going_list, setGoing_list] = React.useState([
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Gingerbread', 356, 16.0)
  ]);
  
  //TODO: [implemented to be tested] hook updating counter once any change takes place to any of list
  
  const [Missing_count, setMissing_count] = React.useState(0);
  const [Returning_count, setReturning_count] = React.useState(0);
  const [Returning_list, setReturning_list] = React.useState([]);
  const [Missing_list, setMissing_list] = React.useState([]);
  const [Going_selected_count,setGoing_selected_count]= React.useState([]);
  const [Returning_selected_count,setReturning_selected_count]= React.useState([]);
  const [manualAdd, setManualAdd] = React.useState(false);
  const refGoing_list = React.useRef(Going_list);
  const refReturning_list = React.useRef(Returning_list);
  const refOpenGoing=React.useRef(openGoing)
  const refOpenReturning=React.useRef(openReturning)
  useEffect(()=>{
    refGoing_list.current=Going_list
    refReturning_list.current=Returning_list
    refOpenGoing.current=openGoing
    refOpenReturning.current=openReturning
    console.log("session page body rendered")
  })

  /**
   * Sets the going list wrapper.
   *
   * @param {type} newState - the new state
   * @return {type} undefined
   * 
   * @description setGoing_list_wrapper that takes a parameter newState. It sets the value of Going_list to the newState and updates Going_count based on the length of newState.
   */
  const setGoing_list_wrapper=(newState)=>{
    setGoing_list(newState)
    // refGoing_list.current = newState
    if(newState.length)setGoing_count(newState.length);
  }

  const setReturning_list_wrapper=(newState)=>{
    setReturning_list(newState)
    // refReturning_list.current = newState
    if(newState.length)setReturning_count(newState.length);
  }

  const setMissing_list_wrapper=(newState)=>{
    setMissing_list(newState)
    if(newState.length)setMissing_count(newState.length);
  }
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
  setAnchorEl(null);
  };
  
function Session_state_to_obj() {
    return {
        Going_list: [...Going_list] ,
        Returning_list: [...Returning_list] ,
        Missing_list: [...Missing_list]
    }
}
function Session_Actions_Start() {
    if (Boolean(localStorage.getItem("session_running")) & Boolean(localStorage.getItem("last_session"))) {
        if (window.confirm("found last session saved with running state, Do you want to resume last session ?")) {
            Session_Actions_Load();
            window.session_running = setInterval(Session_Actions_Save, 1000);
            // M.toast({ html: "last session resumed" })
        }
        else {
            localStorage.setItem("session_running", true)
            localStorage.removeItem("last_session")
            window.session_running = setInterval(Session_Actions_Save, 1000);
        }
    }
    else {
        localStorage.setItem("session_running", true)
        localStorage.removeItem("last_session")
        window.session_running = setInterval(Session_Actions_Save, 1000);
    }

}
function Session_Actions_End() {
    localStorage.removeItem("session_running")
    localStorage.removeItem("last_session")
    clearInterval(window.session_running);
    window.session_running = undefined

}
function Session_Actions_Save() {
    localStorage.setItem("last_session", JSON.stringify(Session_state_to_obj()))
}
function read_file_as_string(file) {
    let reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reject(new DOMException("Problem parsing input file."))
        }
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsText(file)
    })
}
function Session_Actions_Load()
{
  let last_session = localStorage.getItem("last_session")
  last_session = last_session ? JSON.parse(last_session) : null;
  if (last_session)
  {
      if (last_session.Going_list)
      {
        setGoing_list_wrapper(last_session.Going_list)
        setReturning_list_wrapper(last_session.Returning_list)
        setMissing_list_wrapper(last_session.Missing_list)
      }
  }
}
async function Session_check_import_json(event) {
  let input_element =event.target
  console.log(input_element)
  try {
      if (input_element.files.length) {
        let json_content = await read_file_as_string(input_element.files[0])
        let sessionObj = JSON.parse(json_content)
        if (sessionObj)
        {
            if (sessionObj.Going_list)
            {
              setGoing_list_wrapper(sessionObj.Going_list)
              setReturning_list_wrapper(sessionObj.Returning_list)
              setMissing_list_wrapper(sessionObj.Missing_list)
            }
        }
      }
  }
  catch (any) {
      console.error(any)
  }
}
function Session_Actions_Import() {
  console.log(document.querySelector("input#json_input"))
  let input_element = document.querySelector("input#json_input")
  input_element.addEventListener("change", Session_check_import_json)
    document.querySelector("input#json_input").click()
}

function Session_Actions_Export() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Session_state_to_obj()));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "session" + Date.now().toString() + ".json");
    dlAnchorElem.click();

}


  return (
    <div>
      <Stack
        direction="row-reverse"
        spacing={0.5}
        alignItems={"right"}
      >
        <Fab disabled={false} loading color="primary" aria-label="add" size="small"
         id="action-button"
        aria-controls={open ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        >
          <MoreHorizIcon />
        </Fab>
        {/* the ^ operator is used to prevent the button from being activated when going and returning are opened in the same time and the end used add by wrong manually to both of them and this simple operation reduce alot of logical code to handle this */}
        <Fab disabled={!(openGoing ^ openReturning)} color="primary" aria-label="add" size="small"
          onClick={()=>setManualAdd(true)}
          >
          <GroupAddIcon />
        </Fab>
        <Fab disabled={!(openGoing || openReturning)} color="primary" aria-label="add" size="small">
          <AddAPhotoIcon />
        </Fab>
        <Fab  disabled={/*!(( Going_count > 0 && openGoing ) || ( Returning_count>0 && openReturning ) )*/ Going_selected_count==0 && Returning_selected_count==0} color="primary" aria-label="add" size="small"
          onClick={function()
            {
              setGoing_list_wrapper(Going_list.filter(
                (record)=>!record.selected
              ))
              setReturning_list_wrapper(Returning_list.filter(
                (record)=>!record.selected
              ))
            }}
        >
          <GroupRemoveIcon />
        </Fab>
      <Menu 
              id="action-menu"
              aria-labelledby="action-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
      >
        <MenuItem onClick={Session_Actions_Start}>
          <ListItemIcon>
            <PlayArrowIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Start Session</ListItemText>
        </MenuItem>
        <MenuItem onClick={Session_Actions_End}>
          <ListItemIcon>
            <StopIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>End Session</ListItemText>
        </MenuItem>
        <MenuItem onClick={Session_Actions_Save}>
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save Session</ListItemText>
        </MenuItem>
        <MenuItem onClick={Session_Actions_Load} >
          <ListItemIcon>
            <SettingsBackupRestoreIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Load Session</ListItemText>
        </MenuItem>
        <MenuItem 
        onClick={Session_Actions_Import}
        >
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import</ListItemText>
        </MenuItem>
        <MenuItem onClick={Session_Actions_Export}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </Menu>
  

      </Stack>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
      // spacing={2}
      >
        <NestedList
          setOpenGoing={setOpenGoing}
          openGoing={openGoing}
          setOpenReturning={setOpenReturning}
          openReturning={openReturning}
          setOpenMissing={setOpenMissing}
          openMissing={openMissing}
          Going_list={Going_list}
          setGoing_list_wrapper={setGoing_list_wrapper}
          Returning_list={Returning_list}
          setReturning_list_wrapper={setReturning_list_wrapper}
          Missing_list={Missing_list}
          setMissing_list_wrapper={setMissing_list_wrapper}
          Going_count={Going_count}
          Returning_count={Returning_count}
          Missing_count={Missing_count}
          Going_selected_count={Going_selected_count}
          setGoing_selected_count={setGoing_selected_count}
          Returning_selected_count={Returning_selected_count}
          setReturning_selected_count={setReturning_selected_count}
        />
      </Stack>
          <a id={"downloadAnchorElem"} class={"hidden"}  ></a>
          <input type={"file"} id={"json_input"} class={ "hidden" } accept={ ".json,application/json" }
                onchange={ (e)=>{console.log(e);Session_check_import_json(this)}}/>
        <ManualAddModal open={manualAdd} setOpen={setManualAdd} setGoing_list={setGoing_list_wrapper} setReturning_list={setReturning_list_wrapper} refGoing_list={refGoing_list} refReturning_list={refReturning_list} refOpenGoing={refOpenGoing} refOpenReturning={refOpenReturning}/>
    </div>
  )
}