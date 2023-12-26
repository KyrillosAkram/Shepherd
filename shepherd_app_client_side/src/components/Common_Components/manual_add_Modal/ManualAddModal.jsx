import * as React from 'react';
// import { useRef } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { Stack } from "@mui/material";
// import { Autocomplete } from '@material-ui/lab';
// import  theme from '../../../theme';
import SearchName from '../Search_Name/SearchName';
import {createData} from '../List_Table/list_table';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


/**
 * Renders a modal component for manually adding items.
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.open - Flag indicating whether the modal is open or not.
 * @param {function} props.setOpen - Function to set the open state of the modal.
 * @return {JSX.Element} The modal component.
 */
export default function ManualAddModal(props) {
  const [searchValue, setSearchValue] = React.useState('');
  const refsearchValue=React.useRef(searchValue);
  async function addHandler() {
    let myidb = window.idb
    let tx = myidb.transaction(['children'], 'readwrite')
    let ob = tx.objectStore('children')
    let child_record = await ob.get(searchValue)
    console.log(child_record)
    //console.log(child_record)
    // console.log(props.refListsState.current)
    // console.log(props.refGoing_list.current)
    if (child_record) {
      let record = [child_record.Name,child_record.Class,child_record.Address]
      if (props.refOpenGoing.current)
      {
        console.log([...props.refGoing_list.current,createData(...record)])
        props.setGoing_list([...props.refGoing_list.current, createData(...record)])
      }
      else if (props.refOpenReturning.current)
      {
        props.setReturning_list([...props.refReturning_list.current, createData(...record)])
      }
      else
      {
        console.log("error")
      }
    }
  }
  const handleClose = () => props.setOpen(false);
  return (
    <div>
      
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
          Adding by Name
          </Typography>
          <br />
          <Stack direction={'row'}>
            <SearchIcon hight={'auto'}/>
            <SearchName refsearchValue={refsearchValue} searchValue={searchValue} setSearchValue={setSearchValue}/>
          </Stack>
          <Stack direction={'row-reverse'}>
            <Button onClick={handleClose} color='danger' bgcolor='background'>Close</Button>
            <Button onClick={addHandler} color='primary' bgcolor='background'>Add</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}