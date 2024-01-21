import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import theme from '../../../theme'
import { Checkbox/* , Typography */ } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import {get_record} from '../../../db'
import Registration_page_body from '../../Body/Registration/pageBody'


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export function createData(...cells) {
    return   { selected: false, cells}
}


/* function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
} */

/* function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) =>  descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
} */

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


export default function CustomizedTable(props)
{
    // const [order, setOrder] = React.useState('asc');
    // const [orderBy, setOrderBy] = React.useState('calories');
    // const [selected, setSelected] = React.useState([]);
    // const [page, setPage] = React.useState(0);
    // const [dense, setDense] = React.useState(false);
    // const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const { /* onSelectAllClick, */ numSelected, rowCount, /* onRequestSort, */rows,setRows } = props;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    

/*     const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }; */
    const table_ref=React.useRef(null)

    const handleSelectAllClick = () => {
        let newSelected
        window.devMode && console.log(rows[0].selected)
        if (rows[0].selected) {
            newSelected = rows.map((n) =>{return {...n,selected:false}} );
            props.setSelected_count(0)
        }
        else
        {
            newSelected = rows.map((n) =>{return {...n,selected:true}} );
            props.setSelected_count(rows.length)
        }
        // window.devMode && console.log(newSelected);
        setRows(newSelected);
    };
    
    

/*     const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
 */
    /* const handleChangeDense = (event) => {
        setDense(event.target.checked);
    }; */

    // const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
        <TableContainer origin={"indexedDB.sefain_brain.children"} ref={table_ref} component={Paper} style={{ width: 'auto', margin: '10px', alignContent: 'center' }}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={rowCount > 0 && numSelected === rowCount}
                                onChange={handleSelectAllClick}
                                inputProps={{
                                    'aria-label': 'select all desserts',
                                }}
                                disabled={props.rows.length>0?false:true}
                            />
                        </StyledTableCell>
                        {
                            props.header_cells.map((cell_text,cell_index)=><StyledTableCell align={props.columns_align[cell_index]}>{cell_text/*.replace(' ','&nbsp;')*/}</StyledTableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.rows.map(
                            (row) =><TableRecord 
                                        parent_table={table_ref}
                                        align={props.columns_align}
                                        data={row}
                                        rows={props.rows}
                                        setRows={props.setRows}
                                        selected_count={props.selected_count}
                                        setSelected_count={props.setSelected_count}
                                        open={open}
                                        setOpen={setOpen}
                                        handleOpen={handleOpen}
                                        handleClose={handleClose}/>
                        )
                    }
                </TableBody>
            </Table>
        <RecordModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose}/>
        </TableContainer>
    );
}


export function TableRecord(props) {
    let touchtime=0;
    const row_click_handler = async (event) =>{
        if (touchtime === 0) {
            // set first click
            window.devMode && console.log("first click")
            window.devMode && console.log(props.data)
            touchtime = new Date().getTime();
        } else {
            // compare first click to this click and see if they occurred within double click threshold
            if (((new Date().getTime()) - touchtime) < 800) {
                // double click occurred
                window.devMode && console.log("double clicked");
                // window.recordname=props.data.cells[0]
                window.record=await get_record(props.data.cells[0])
                props.handleOpen()
                // show_child_data(event.target.parentElement.childNodes[0].innerText)
                touchtime = 0;
            } else {
                // not a double click so set as a new first click
                touchtime = new Date().getTime();
            }
        }
    }

    const handleClick = React.useCallback((event) =>{
        let toggled ={}
        // window.devMode && console.log(event.target.checked)
        if (props.data.selected)
        {
            toggled = {...props.data,selected:false}
            event.target.checked=false
            props.setSelected_count(props.selected_count>0?props.selected_count-1:0)
        }
        
        else
        {
            toggled = {...props.data,selected:true}
            event.target.checked=true    
            props.setSelected_count(props.selected_count+1)
        }
        let new_rows=props.rows
        new_rows[props.rows.indexOf(props.data)]=toggled
        props.setRows(new_rows.map((e)=>{return e}))
        // window.devMode && console.log(props.data)
        // setSelected(newSelected);
    },[props.data,props.selected_count,props.rows,props.selected]);
    // window.devMode && console.log(props.data )
    return (
        <StyledTableRow key={props.data.cells[0]} onClick={row_click_handler}>{
            //.cells[0]
        }
        <StyledTableCell padding="checkbox">
            <Checkbox
                color="primary"
                checked={props.data.selected}
                onChange={handleClick}
            />
        </StyledTableCell>
        {
            props.data.cells.map((cell_text,cell_index)=><StyledTableCell align={props.align[cell_index]}>{cell_text  }</StyledTableCell>)
        }
    </StyledTableRow>
    )
}

export function RecordModal(props) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        borderRadius:"10px",

    };
    
    
    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
 {/*            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {window.recordname}
            </Typography>
             </Box>
            */}
            <Box sx={style}>
                <Registration_page_body optional_editing={false} default_editing_option={"read_only"} initial_record={window.record} />
            </Box>
        </Modal>
    );
}