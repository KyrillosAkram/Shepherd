import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import theme from '../../../theme'
import { Checkbox, Typography } from '@mui/material';


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

export function createData(name, calories, fat, carbs, protein,selected=false) {
    return   { selected: false, name, calories, fat, carbs, protein }
}


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) =>  descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

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


export default function CustomizedTables(props)
{
    //TODO: modify this component to be more generic by taking the header column and the initial body value
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const { onSelectAllClick, numSelected, rowCount, onRequestSort,rows,setRows } = props;
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = () => {
        let newSelected
        console.log(rows[0].selected)
        if (rows[0].selected) {
            newSelected = rows.map((n) =>{return {...n,selected:false}} );
        }
        else
        {
            newSelected = rows.map((n) =>{return {...n,selected:true}} );
        }
        console.log(newSelected);
        setRows(newSelected);
    };

    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    // const visibleRows = React.useMemo(
    //     () =>
    //         stableSort(rows, getComparator(order, orderBy)).slice(
    //             page * rowsPerPage,
    //             page * rowsPerPage + rowsPerPage,
    //         ),
    //     [order, orderBy, page, rowsPerPage],
    // );
    return (
        <TableContainer component={Paper} style={{ width: 'auto', margin: '10px', alignContent: 'center' }}>
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
                            />
                        </StyledTableCell>
                        <StyledTableCell>Dessert (100g serving)</StyledTableCell>
                        <StyledTableCell align="right">Calories</StyledTableCell>
                        <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
                        <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                        <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* <Typography>{props.rows.length}</Typography> */}
                    {
                        props.rows.map(
                            (row) =><TableRecord data={row} rows={props.rows} setRows={props.setRows}/>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}


export function TableRecord(props) {
    function handleClick(event) {
        let toggled ={}
        console.log(event.target.checked)

        if (props.data.selected)
        {
            toggled = {...props.data,selected:false}
            event.target.checked=false
        }
        
        else
        {
            toggled = {...props.data,selected:true}
            event.target.checked=true    
        }
        let new_rows=props.rows
        new_rows[props.rows.indexOf(props.data)]=toggled
        props.setRows(new_rows.map((e)=>{return e}))
        console.log(props.data)

        // setSelected(newSelected);
    };
    // console.log(props.data )
    return (
        <StyledTableRow key={props.data.name}>
        <StyledTableCell padding="checkbox">
            <Checkbox
                color="primary"
                checked={props.data.selected}
                // inputProps={{
                //     'aria-labelledby': labelId,
                // }}
                onChange={handleClick}
            />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row"  >
            {props.data.name}
        </StyledTableCell>
        <StyledTableCell align="right">{props.data.calories  }</StyledTableCell>
        <StyledTableCell align="right">{props.data.fat       }</StyledTableCell>
        <StyledTableCell align="right">{props.data.carbs     }</StyledTableCell>
        <StyledTableCell align="right">{props.data.protein   }</StyledTableCell>
    </StyledTableRow>
)
}