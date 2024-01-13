import * as React from 'react';
import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Session_page_body from './Body/Session/pageBody';
import Registed_page_body from './Body/Registed/pageBody';
import Registration_page_body from './Body/Registration/pageBody';
import Task_page_body from './Body/task/pageBody';
import Volanteering_page_body from './Body/Volanteering/pageBody';
// import { createData } from './Common_Components/List_Table/list_table';
// import {get_all_recorded_rows} from '../db';
// import { createData } from './Common_Components/List_Table/list_table';




export default function AppBody(props) {
  const [value, setValue] = React.useState('1');
  // const [rows, setRows] = React.useState(window.all_registed_childrens.map((data) => createData(...[ data.Name, data.Class, data.Address ])));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={props.page}>
        <TabPanel value="Login">
          Login content
        </TabPanel>
        <TabPanel value="Session">
          <Session_page_body />
        </TabPanel>
        <TabPanel value="Registed">
          <Registed_page_body />
        </TabPanel>
        <TabPanel value="Registration">
          <Registration_page_body optional_editing={true} default_editing_option={""} initial_record={undefined}/>
        </TabPanel>
        <TabPanel value="Task">
          <Task_page_body optional_editing={true} default_editing_option={""} initial_record={undefined}/>
       </TabPanel>
        <TabPanel value="Volanteering">
          <Volanteering_page_body optional_editing={true} default_editing_option={""} initial_record={undefined}/>
       </TabPanel>
      </TabContext>
      {/* <CustomizedSnackbars/> */}
    </Box>
  );
}