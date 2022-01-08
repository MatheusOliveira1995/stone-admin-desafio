import * as React from 'react';
import { DataGrid, GridColDef, GridRowId, GridValueGetterParams } from '@mui/x-data-grid';
import { Paper, Box, Button } from '@mui/material';

import { Add, Delete } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 9 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  { id: 10, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 11, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 12, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  { id: 13, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 14, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 15, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  { id: 16, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 17, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 18, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  { id: 19, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 20, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 21, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataGridDemo() {
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection:'column',
        marginTop: '70px',
        height:'600px'
      }}
    >
      <Box
        component="div"
        sx={{
          display: 'flex',
          padding:'20px'
        }}
      >
        <Button
          endIcon={<Add/>}
          aria-label='Novo'
          size='medium'
          variant='contained'
          color='primary'
        >
          Novo
        </Button>
        <Button
          endIcon={<Delete/>}
          aria-label='Deletar'
          size='medium'
          variant='contained'
          color='error'
          sx={
            {
              marginLeft: '10px'
            }
          }
        >
          Deletar
        </Button>
      </Box>
      <Box component="div" sx={{
        height: '100%',
        backgroundColor: 'white',
        padding: '18px 18px 30px 18px',
        width: 1,
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoPageSize
          rowsPerPageOptions={[30]}
          checkboxSelection
          selectionModel={selectionModel}
          hideFooterSelectedRowCount
          onSelectionModelChange={(selection) => {
            if (selection.length === rows.length) {
              setSelectionModel([])
              return
            }
            if (selection.length > 1) {
              const selectionSet = new Set(selectionModel);
              const result = selection.filter((s) => !selectionSet.has(s));

              setSelectionModel(result);
            } else {
              setSelectionModel(selection);
            }
          }}
          sx={
            {
              '& .grid-header': {
                bgcolor: 'rgba(76, 182, 170, 1)!important',
                opacity: 0.8
              },
            }
          }
        />
      </Box>
    </Paper >
  );
}
