import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function SearchName(props) {
  const [value, setValue] = React.useState('');
  const opts=[...window.all_registed_childrens.map((option) => option.Name)]
  return (
    <Autocomplete
      disablePortal
      options={opts}
      sx={{ width: '100%' }}
      renderInput={(params) => <TextField 
      {...params} variant='standard' />}

      value={props.searchValue} onChange={
        
        (event,newSelectedValue) => {


          props.setSearchValue(newSelectedValue)
        }
    }
    />
  );
}

