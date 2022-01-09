import * as React from 'react';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper

} from "@mui/material"

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

import CSS from 'csstype';

import './styles.css'


type Order = 'asc' | 'desc';

export type Column = {
  id: string,
  name: string,
  enableSort?: boolean
  width?: number
  textAlign?: string
}
type Props = {
  headerTitle: string
  columns?: Column[],
  rows: any[]
}

interface EnhancedTableToolbarProps {
  headerTitle: string;
}

//IDataTableHeadProps 
interface EnhancedTableProps {
  columns: Column[],
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof any) => void;
  order: Order;
  orderBy: keyof any;
  rowCount: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof any) => (event: React.MouseEvent<unknown>) => { onRequestSort(event, property); };
  return (
    <React.Fragment>
      <TableHead>
        <TableRow
          sx={
            {
              bgcolor: 'rgba(0, 142, 90, 0.8)',
            }
          }
        >
          {props.columns.map((column) => (
            <TableCell
              key={column.id}
              align='left'
              sortDirection={orderBy === column.id ? order : false}
              sx={{
                padding:'14px'
              }}
            >
              { 
                column.enableSort ? 
                      <TableSortLabel
                        id='table-sort-label'
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={createSortHandler(column.id)}
                        sx={
                          {
                            color: 'white!important'
                          }
                        }
                      >
                        {column.name}
                        {orderBy === column.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                : <span style={{color: 'white'}}>{ column.name }</span>    
              }
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </React.Fragment>
  );
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: 'rgba(0, 142, 90, 1)',
        boxShadow: 3,
        color: 'white'
      }}
    >
      <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.headerTitle}
        </Typography>
      <Tooltip sx={{color:'white'}} title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
    </Toolbar>
  );
};

export default function AppTable(props: Props) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof any>(props.columns ? props.columns[0].id : '');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  let internalColumnData: Column[] = [{
    id: "",
    name: "",
    enableSort: false,
    width: 30
  }];

  if (!props.columns) {
    if (props.rows.length) {
      internalColumnData.length = 0;
      Object.keys(props.rows[0]).map(key => {
        return internalColumnData.push({
          id: String(key),
          name: String(key),
          enableSort: false
        })
      })
    }
  } else {
    internalColumnData = props.columns;
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar headerTitle={props.headerTitle} />
        <TableContainer>
          <Table
            sx={{ minWidth: 800 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              columns={internalColumnData}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={props.rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {
                stableSort(props.rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        sx={{cursor: 'pointer'}}
                        tabIndex={-1}
                        key={index}
                      >
                        {
                          Object.keys(row).map((key, index) => {
                            let colWidth
                            let alignment
                            if(internalColumnData[index]){
                              colWidth = internalColumnData[index].width ? internalColumnData[index].width : 100
                              alignment = internalColumnData[index].textAlign ?  internalColumnData[index].textAlign : ''
                            }
                            return (
                              <TableCell
                                component="th"
                                key={index}
                                scope="row"
                                sx={
                                  {
                                    maxWidth: colWidth,
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    textAlign: alignment as CSS.Properties
                                  }
                                }
                              >
                                {row[key]}
                              </TableCell>
                            );
                          })
                        }

                      </TableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelRowsPerPage="Linhas por página:"
          showFirstButton={true}
          showLastButton={true}
          rowsPerPageOptions={[5,10,25]}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
