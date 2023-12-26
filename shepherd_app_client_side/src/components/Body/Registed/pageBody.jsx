import React from 'react';
import { Box/* , Button, Container, CssBaseline */, Grid/* , TextField, Typography */ } from '@mui/material';
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
import CustomizedTable, { createData } from '../../Common_Components/List_Table/list_table';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileDownload from '@mui/icons-material/FileDownload'
import FileUpload from '@mui/icons-material/FileUpload'
import { /* get_all_recorded_rows, */get_all_recoded_children_names,get_all_recoded_children } from '../../../db';
import { read_file_as_string } from '../../../util';





// const actions = [
//   { icon: < FileUpload/>, name: 'Import'   ,callback:},
//   { icon: < FileDownload/>, name: 'Export' ,callback:},
// ];

export function SpeedDialTooltipOpen(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <SpeedDialAction
        key={'Export'}
        icon={< FileDownload/>}
        tooltipTitle={'Export'}
        tooltipOpen
        onClick={()=>{props.Registed_Actions_Export();console.log('Export')}/*()=>{props.Registed_check_import_json(document.querySelector('input#json_input'))}*/}
        />
        <SpeedDialAction
        key={'Import'}
        icon={< FileUpload/>}
        tooltipTitle={'Import'}
        tooltipOpen
        onClick={()=>document.querySelector('input#json_input').click() /*()=>{props.Registed_check_import_json(document.querySelector('input#json_input'))}*/}
        />
      </SpeedDial>
    </Box>
  );
}


function Registed_page_body(props)
{
  const [rows, setRows] = React.useState(window.all_registed_childrens.map((data) => createData(...[ data.Name, data.Class, data.Address ])));
  const [selected_count, setSelected_count] = React.useState(0);
  const [, forceRender] = React.useState(undefined);
  
  const Registed_table_refresh = () => {
      forceRender((prev) => !prev);
  }
      async function Registed_check_import_json(input_element) {
        try {
            if (input_element.files.length) {
                const json_content = await read_file_as_string(input_element.files[0])
                const ImportedObj = JSON.parse(json_content)
                if (ImportedObj.length) {
                    const recorded_names = await get_all_recoded_children_names()
                    const new_records = ImportedObj.filter((imported_record) => !recorded_names.includes(imported_record.Name))
                    const myidb = window.idb.wrap(window.db)
                    const tx = myidb.transaction(['children'], 'readwrite')
                    const ob = tx.objectStore('children')
      
                    let adding_promises = new_records.map((new_record) => ob.put(new_record))
                    await Promise.all([...adding_promises, tx.done])
                    // M.toast({ html: `found new ${adding_promises.length} , Importing db Done !!` })
                    Registed_table_refresh()
                }
            }
        }
        catch (any) {
            console.error(any)
        }
      }
      
      async function Registed_Actions_Import() {
        document.querySelector("input#json_input").click()
      }
      async function Registed_Actions_Export() {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(await get_all_recoded_children()));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "children_db" + Date.now().toString() + ".json");
        dlAnchorElem.click();
      }


  return (
    <Grid container>
      <Grid item xs={12}>
      <CustomizedTable 
        header_cells={[
                "Name",
                "Class",
                "Address"
              ]} 
        columns_align={['left','right','right']}
        rows={rows}
        setRows={setRows}
        selected_count={selected_count}
        setSelected_count={setSelected_count} />
      </Grid>
      <Grid item minHeight={0}> </Grid>
      <Grid item>
        <Box>
          <SpeedDialTooltipOpen Registed_check_import_json={Registed_check_import_json} Registed_Actions_Export={Registed_Actions_Export} />
          <input type="file" id="json_input" hidden={true} accept=".json,application/json"
                    onchange="Registed_check_import_json(this)"></input>
          <a id="downloadAnchorElem" hidden={true}></a>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Registed_page_body;
