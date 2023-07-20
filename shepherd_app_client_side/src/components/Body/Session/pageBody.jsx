import React from "react";
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
import CustomizedTable, { createData } from "./list_table";
function NestedList() {
  const [openGoing, setOpenGoing] = React.useState(false);
  const [openReturning, setOpenReturning] = React.useState(false);
  const [openMissing, setOpenMissing] = React.useState(false);
  const [Going_count, setGoing_count] = React.useState(0);
  const [Going_list, setGoing_list] = React.useState([
    createData('Frozen yoghurt', 159, 6.0),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Eclair', 262, 16.0),
    createData('Cupcake', 305, 3.7),
    createData('Frozeyoghurt', 159, 6.0),
    createData('Ice sandwich', 237, 9.0),
    createData('Eclir', 262, 16.0),
    createData('Cupake', 305, 3.7),
    createData('Gingerbread', 356, 16.0)
  ]);
  //TODO:hook updating counter once any change takes place to any of list
/**
 * 
 */
  const [Missing_count, setMissing_count] = React.useState(0);
  const [Returning_count, setReturning_count] = React.useState(0);
  const [Returning_list, setReturning_list] = React.useState([]);
  const [Missing_list, setMissing_list] = React.useState([]);

  const setGoing_list_wrapper=(newState)=>{
    setGoing_list(newState)
    if(newState.length)setGoing_count(newState.length);
  }

  const setReturning_list_wrapper=(newState)=>{
    setReturning_list(newState)
    if(newState.length)setReturning_count(newState.length);
  }

  const setMissing_list_wrapper=(newState)=>{
    setMissing_list(newState)
    if(newState.length)setMissing_count(newState.length);
  }
  
  const handleClick = (e) => {
    switch (e.target.innerText) {
      case "Going":
        setOpenGoing(!openGoing);
        break;
      case "Returning":
        setOpenReturning(!openReturning);
        break;
      case "Missing":
        setOpenMissing(!openMissing);
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
          {openGoing ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openGoing} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <CustomizedTable header_cells={[
                "Name",
                "Class",
                "Address"
              ]} columns_align={['left','right','right']} rows={Going_list} setRows={setGoing_list_wrapper} />
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
          {openReturning ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openReturning} timeout="auto" unmountOnExit>
          <List component='div' disablePadding>
            <CustomizedTable header_cells={[
                "Name",
                "Class",
                "Address"
              ]} columns_align={['left','right','right']} rows={Returning_list} setRows={setReturning_list_wrapper} />

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
          {openMissing ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMissing} timeout="auto" unmountOnExit>
          <List component='div' disablePadding>
            <CustomizedTable header_cells={[
                "Name",
                "Class",
                "Address"
              ]} columns_align={['left','right','right']} rows={Missing_list} setRows={setMissing_list_wrapper} />

          </List>
        </Collapse>
      </List>
      <div style={{ margin: " 10px 0 10px 0" }}></div>
      <Typography>[ Going: {Going_count} | Returning: {Returning_count} | Missing: {Missing_count} ]</Typography>
    </>
  );
}

export default function Session_page_body() {
  return (
    <div>
      <Stack
        direction="row-reverse"
        spacing={0.5}
        alignItems={"right"}
      >
        <Fab disabled={false} loading color="primary" aria-label="add" size="small">
          <MoreHorizIcon />
        </Fab>
        <Fab disabled={true} color="primary" aria-label="add" size="small">
          <GroupAddIcon />
        </Fab>
        <Fab disabled={true} color="primary" aria-label="add" size="small">
          <AddAPhotoIcon />
        </Fab>
        <Fab disabled={true} color="primary" aria-label="add" size="small">
          <GroupRemoveIcon />
        </Fab>

      </Stack>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
      // spacing={2}
      >
        <NestedList />

      </Stack>
    </div>
  )
}