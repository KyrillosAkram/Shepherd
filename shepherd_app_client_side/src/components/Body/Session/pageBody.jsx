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
// import ActionMenu from "./ActionMenu";
// import Paper from '@mui/material/Paper';
// import MenuList from '@mui/material/MenuList';
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
import { AppGlobalContext } from "../../../App";

//FIXME: incase adding multi images doublicated faces added
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
  const [Going_list, setGoing_list] = React.useState([]);
  
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
  const AppCTRL=React.useContext(AppGlobalContext)
  useEffect(()=>{
    refGoing_list.current=Going_list
    refReturning_list.current=Returning_list
    refOpenGoing.current=openGoing
    refOpenReturning.current=openReturning
    window.devMode && console.log("session page body rendered")
  })

  /**
   * Sets the going list wrapper.
   *
   * @param {type} newState - the new state
   * @return {type} undefined
   * 
   * @description setGoing_list_wrapper that takes a parameter newState. It sets the value of Going_list to the newState and updates Going_count based on the length of newState.
   */
  const setGoing_list_wrapper= async (newState)=>{
    await setGoing_list(newState)
    window.devMode && console.log(newState.Length)
    await setGoing_count(newState.length);
    await Session_update_missing_table(newState.map(recored=>{return recored.cells[0]}),Returning_list.map(recored=>{return recored.cells[0]}));
}

  const setReturning_list_wrapper=async (newState)=>{
    await setReturning_list(newState)
    await setReturning_count(newState.length);
    await Session_update_missing_table(Going_list.map(recored =>{return recored.cells[0]}),newState.map(recored =>{return recored.cells[0]}));
  }

  const setMissing_list_wrapper=(newState)=>{
    setMissing_list(newState)
    setMissing_count(newState.length);
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
  window.devMode && console.log(input_element)
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
  window.devMode && console.log(document.querySelector("input#json_input"))
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


/**
 * Retrieves the specified children from the 'children' store in the IndexedDB.
 *
 * @param {Array} children_array - An array of child keys to retrieve.
 * @return {Array} An array of child objects matching the specified keys.
 */
async function Session_get_children(children_array) {
  let result_children = [];
  let cursor = await window.idb.transaction('children', 'readwrite').store.openCursor();

  while (cursor) {
    if(children_array.includes(cursor.key)){
      let record = cursor.value;
      result_children.push({ ...record, Discriptor: new window.faceapi.LabeledFaceDescriptors(record.Discriptor._label, [new Float32Array(Discriptor_parser(record.Discriptor._descriptors[0]))]) })
    }
    cursor = await cursor.continue();
  }
  return result_children
}


function Session_get_missing(big_array, small_array) {
  if (big_array.length ===0 && small_array.length ===0)
  {
    return []
  }
  else
  {
    return big_array.filter(child => !small_array.includes(child))
  }
}

async function Session_update_missing_table(Going_names, Returning_names)
{
  window.devMode && console.log(Going_names.length, Returning_names.length)
  if (Going_names.length === 0 && Returning_names.length === 0)
  {
    window.devMode && console.log("no missing")
    setMissing_list_wrapper([])
  }
  else
  {
    let missing_names = await Session_get_missing(Going_names, Returning_names)
    window.devMode && console.log(missing_names)
    let missing_recoreds = await Session_get_children(missing_names)
    let missing_data = missing_recoreds.map(record => { return createData(...[record.Name, record.Class, record.Address]) })
    setMissing_list_wrapper(missing_data)
  }
}

function Session_check_input_add(input) {
  window.devMode && console.log(input)
  if (input?.files?.length) {
      Session_detect_descriptors(input.files)
      input.value='' //[kakram] to reset the input file to prevent redetection on same image
  }
}

async function get_all_recoded_discriptors()
{
  
  const obj = window.idb.transaction('children', 'readwrite').objectStore('children')
  let records = await obj.getAll()
  records = records.map(record => { return { ...record, Discriptor: new window.faceapi.LabeledFaceDescriptors(record.Discriptor._label, [new Float32Array(Discriptor_parser(record.Discriptor._descriptors[0]))]) } })
  return records

}

function Discriptor_parser(Discriptor) {
  let a = []
  for (let i in Discriptor) {
      a.push(Discriptor[i])
  }//if(typeof(Discriptor)!=)
  return a
}



async function Session_detect_descriptors(buffers) {
  try
  {
      Window.Session_detect_descriptors_result = []
      // let fake = document.querySelector("div#fake_div")
      let detected_descriotor_arr = await Promise.all(//to await image
          [...buffers].map(window.faceapi.bufferToImage)
      )
      for (let image of detected_descriotor_arr) {
          Window.Session_detect_descriptors_result.push(await window.faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors())
      }
      const descriptors_arrs = Window.Session_detect_descriptors_result.flat()
      let all_recoded_children = await get_all_recoded_discriptors()
      let registed_d = all_recoded_children.map(record => { return record.Discriptor })
      let faceMatcher = new window.faceapi.FaceMatcher(registed_d, 0.6)
      let found_children = null
      found_children = descriptors_arrs.map(d => faceMatcher.findBestMatch(d.descriptor))
      Session_active_table_add_children(found_children.map(child => child._label))
      AppCTRL.Bar.setProgressCircleStateWrapper("Done")
      // setTimeout(() => {
      //     tbodys = document.querySelectorAll('tbody')
      //     document.querySelector("span#Going").innerText = tbodys[0].getElementsByTagName("tr").length
      //     document.querySelector("span#Returning").innerText = tbodys[1].getElementsByTagName("tr").length
      //     document.querySelector("span#Missing").innerText = '?'
      // }, 500)
  }
  catch (error)
  {
      console.error(error)
      AppCTRL.Bar.setProgressCircleStateWrapper("Done")
  }
  finally
  {
      // document.querySelector('div#loading_circle').classList.remove('active');
      
  }
}

/**
 * Adds children to the active table in the session.
 *
 * @param {Array} children_name - An array of children names to be added.
 * @return {void}
 */
async function Session_active_table_add_children(children_name) {
    AppCTRL.Bar.setProgressCircleStateWrapper('progress')
    children_name = children_name.filter(child => child !== "unknown")
    const obj = window.idb.transaction('children', 'readwrite').objectStore('children')
    let active_table_existed_children = Session_from_active_table_get_listed_children_name();
    let new_detected_children =[]
    if (active_table_existed_children.length > 0) {
        for (let child of children_name) {
            if (!active_table_existed_children.includes(child)) {
                let child_data = await obj.get(child)
                let child_raw = [child_data.Name, child_data.Class, child_data.Address]
                window.devMode && console.log(child_data)
                new_detected_children.push(createData(...child_raw))
            }
        }
    }
    else {
        for (let child of children_name) {
            if (!active_table_existed_children.includes(child)) {
              let child_data = await obj.get(child)
              let child_raw = [child_data.Name, child_data.Class, child_data.Address]
              window.devMode && console.log(child_data)
              new_detected_children.push(createData(...child_raw))
            }
        }
    }

    window.devMode && console.log(new_detected_children)
    if(openGoing)
    {
      setGoing_list_wrapper([...Going_list, ...new_detected_children])
    }
    else if(openReturning) {
      setReturning_list_wrapper([...Returning_list, ...new_detected_children])
    }
}

/**
 * Retrieves the listed children from the active table session.
 *
 * @return {Array} An array of the names of the listed children.
 */
function Session_from_active_table_get_listed_children_name() {
    let listed_children=null
    if(openGoing)
    {
      listed_children = Going_list
    }
    else if(openReturning)
    {
      listed_children = Returning_list
    }
    return listed_children.map(record => record.Name)
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
        <Fab disabled={!(openGoing || openReturning)} color="primary" aria-label="add" size="small"
        onClick={()=>document.querySelector('#session_cam').click()}
        >
          <AddAPhotoIcon />
        </Fab>
          <input id="session_cam" type="file" multiple accept="image/*;capture=camera"  hidden={true} onChange={
            async()=>
            {
              AppCTRL.Bar.setProgressCircleStateWrapper("progress")
              Session_check_input_add(document.getElementById('session_cam'))
            }
          } />
        <Fab disabled={/*!(( Going_count > 0 && openGoing ) || ( Returning_count>0 && openReturning ) )*/ Going_selected_count == 0 && Returning_selected_count == 0} color="primary" aria-label="add" size="small"
          onClick={async function()
            {
              // FIXME:[kakram](Minor bug)(reversable) when clear both list in session missing never clear due setter racing fixed 
              await setGoing_list_wrapper(Going_list.filter(
                (record)=>!record.selected
              ))
              await setReturning_list_wrapper(Returning_list.filter(
                (record)=>!record.selected
              ))
              await Session_update_missing_table(Going_list.map(recored =>{return recored.cells[0]}),Returning_list.map(recored =>{return recored.cells[0]}));
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
                onchange={ (e)=>{window.devMode && console.log(e);Session_check_import_json(this)}}/>
        <ManualAddModal open={manualAdd} setOpen={setManualAdd} setGoing_list={setGoing_list_wrapper} setReturning_list={setReturning_list_wrapper} refGoing_list={refGoing_list} refReturning_list={refReturning_list} refOpenGoing={refOpenGoing} refOpenReturning={refOpenReturning}/>
        <div id="fake_div"></div>
    </div>
  )
}