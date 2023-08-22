import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Session_page_body from './Body/Session/pageBody';
import Registed_page_body from './Body/Registed/pageBody';
import Registration_page_body from './Body/Registration/pageBody';






export default function AppBody(props) {
  const [value, setValue] = React.useState('1');

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
          <Registration_page_body/>
        </TabPanel>
      </TabContext>
      <CustomizedSnackbars/>
    </Box>
  );
}