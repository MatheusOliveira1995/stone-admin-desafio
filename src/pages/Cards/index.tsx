import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowId, GridRow } from '@mui/x-data-grid';
import { Paper, Box, Button } from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';

import { useTranslation, TFunction } from "react-i18next";

import { getCards } from 'src/service/api/cards';
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { setCards } from "src/app/store/slices/cards";
import { Card, Cards as CardsType } from "src/app/definitions";

import { getUser } from "src/service/api/users";

type DataGridType = {
  columns: GridColDef[] ,
  rows: any[]
}
const configureGridData = (data: CardsType, t: TFunction<"translation", undefined>): DataGridType => {  
  const dataGridColumns: GridColDef[] = [
    { 
      field: 'id',
      headerName: 'ID',
      width: 15 
    },
    {
      field: 'cardHolderName',
      minWidth: 300,
      headerName: 'Titular do cartão',
      width: 150,
      editable: false,
    },
    {
      field: 'digits',
      headerName: 'Número do cartão',
      width: 150,
      type: 'number',
      editable: false,
    },
    {
      field: 'limit',
      headerName: 'Limite do cartão',
      type: 'number',
      width: 200,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status do pedido',
      sortable: true,
      width: 160,
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      sortable: true,
      width: 100,
    },
    {
      field: 'updatedAt',
      headerName: 'Atualizado em',
      sortable: true,
      width: 150,
    },
  ];

  const dataGridRows = data.cards.map((card: Card) => {
      let cardHolderName =  card.metaDatas.name
      if(!card.metaDatas.name){
        getUser(card.userId).then((cardHolder) => {
          cardHolderName = cardHolder.name
        })
      }
      
      return (
        {
          id: card.id,
          cardHolderName: cardHolderName,
          digits: card.metaDatas.digits ? card.metaDatas.digits : '-',
          limit: card.metaDatas.limit ? card.metaDatas.limit : '-',
          status: card.status,
          createdAt: new Date(card.createdAt),
          updatedAt: card.updatedAt ? new Date( card.updatedAt ) : '-'
        }
      )
  })

  return {
    columns: dataGridColumns,
    rows: dataGridRows
  }
}
export default function Cards() {
  const { t } = useTranslation();

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const dispatch = useAppDispatch()
  const cards = useAppSelector((state) => state.cards)
  const [gridData, setGridData] = useState<DataGridType>({columns: [], rows: []})

  useEffect(() => {
    const gridData = configureGridData(cards, t)
    setGridData(gridData)
  }, [cards])

  
  useEffect(() => {
    getCards().then((response) => {
      dispatch(setCards(response))
    })
  }, [])

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection:'column',
        marginTop: '60px',
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
        <Button
          endIcon={<Visibility/>}
          aria-label='Detalhes'
          size='medium'
          variant='contained'
          color='info'
          sx={
            {
              marginLeft: '10px'
            }
          }
        >
          Detalhes
        </Button>
      </Box>
      <Box component="div" sx={{
        height: '100%',
        backgroundColor: 'white',
        padding: '18px 18px 30px 18px',
        width: 1,
        display: 'flex'
      }}>
        <DataGrid
          rows={gridData.rows}
          columns={gridData.columns}
          autoPageSize
          rowsPerPageOptions={[30]}
          checkboxSelection
          selectionModel={selectionModel}
          hideFooterSelectedRowCount
          onSelectionModelChange={(selection) => {
            if (selection.length === gridData.rows.length) {
              setSelectionModel([])
              return
            }
            if (selection.length > 1) {
              const selectionSet = new Set(selectionModel);
              const result = selection.filter((selected) => !selectionSet.has(selected));

              setSelectionModel(result);
            } else {
              setSelectionModel(selection);
            }
          }}
        />
      </Box>
    </Paper >
  );
}
