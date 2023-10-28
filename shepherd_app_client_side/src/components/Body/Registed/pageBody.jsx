import React from 'react';
import { Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CustomizedTable, { createData } from '../../Common_Components/List_Table/list_table';
import { get_all_recorded_rows } from '../../../db';
function Registed_page_body(props)
{
  const [rows, setRows] = React.useState(window.all_registed_childrens.map((data) => createData(...[ data.Name, data.Class, data.Address ])));
  const [selected_count, setSelected_count] = React.useState(0);

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
    </Grid>
  )
}

export default Registed_page_body;
