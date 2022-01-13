/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Paper, Box, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';
import AssigmentId from '@mui/icons-material/AccountCircle';
import CreditCard from '@mui/icons-material/CreditCard';
import LocalAtm from '@mui/icons-material/LocalAtm';
import Event from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';

import { useTranslation, TFunction } from 'react-i18next';
import { getCards } from 'src/service/api/cards';
import { getUserByDocument } from 'src/service/api/users';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { setCards } from 'src/app/store/slices/cards';
import { Card, Cards as CardsType, User } from 'src/app/definitions';
import { getUserById } from 'src/service/api/users';
import AppModal from 'src/components/AppModal';
import AppInput from 'src/components/AppInput'


type DataGridType = {
  columns: GridColDef[],
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
    let cardHolderName = card.metaDatas.name
    if (!card.metaDatas.name) {
      getUserById(card.userId).then((cardHolder) => {
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
        updatedAt: card.updatedAt ? new Date(card.updatedAt) : '-'
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
  const [open, setOpen] = useState(false)
  const [document, setDocument] = useState('')
  const [formError, setFormError] = useState(false)
  const [user, setUser] = useState<User>({
    id: 0,
    document: '',
    name: ''
  })

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const dispatch = useAppDispatch()
  const cards = useAppSelector((state) => state.cards)
  const [gridData, setGridData] = useState<DataGridType>({ columns: [], rows: [] })

  useEffect(() => {
    getCards().then((response) => {
      dispatch(setCards(response))
    })
  }, [])

  useEffect(() => {
    const gridData = configureGridData(cards, t)
    setGridData(gridData)
  }, [cards])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>

      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '60px',
          height: '600px'
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            padding: '20px'
          }}
        >
          <Button
            onClick={ handleOpen }
            endIcon={<Add />}
            aria-label='Novo'
            size='medium'
            variant='contained'
            color='primary'
          >
            { t('card.actions.new') }
          </Button>
          <Button
            endIcon={<Delete />}
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
             { t('card.actions.delete') }
          </Button>
          <Button
            endIcon={<Visibility />}
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
             { t('card.actions.details') }
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
      </Paper>
      <AppModal handleClose={handleClose} open={open} title={t('card.add.title')}>
          <>
            <Box 
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gap={2} component="form" 
            >
              <Box gridColumn="span 3">
                <AppInput 
                  type='number'
                  handleChange={(value: string) => setDocument(value)}
                  label='Documento'
                  required={true}
                  endAdornment={
                    <IconButton
                      onClick={() => {
                        if(!document) return;
                        getUserByDocument(document).then((user: Array<User>) =>{
                          if(user.length){
                            setUser(user[0])
                            return
                          }
                          setUser(
                            {
                              id: 0,
                              document: '',
                              name: ''
                            }
                          )
                        })
                      }}
                      aria-label="search"
                      edge="end"
                    >
                      <SearchIcon/>
                    </IconButton>
                  }
                />
              </Box>
              <Box gridColumn="span 9">
                <TextField
                  value={user.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssigmentId/>
                      </InputAdornment>
                     ),
                  }}
                  fullWidth
                  label="Pessoa"
                  variant="outlined"
                ></TextField>
              </Box>
              <Box gridColumn="span 8">
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalAtm/>
                      </InputAdornment>
                    ),
                  }}
                  required={true}
                  fullWidth
                  label="Limite pretendido"
                  variant="outlined"
                ></TextField>
              </Box>
              <Box gridColumn="span 4">
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard/>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  label="Digitos gerados"
                  variant="outlined"
                ></TextField>
              </Box>
              <Box gridColumn="span 4">
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event/>
                      </InputAdornment>
                    ),
                  }}
                  required={true} 
                  fullWidth
                  label="Data do pedido"
                  variant="outlined"
                ></TextField>
              </Box>
              <Box gridColumn="span 8">
                <TextField 
                  InputProps={{
                    readOnly: true,
                  }} 
                  value="Solicitado"
                  fullWidth label="Status"
                  variant="outlined"
                ></TextField>
              </Box>
            </Box>
          </>
      </AppModal>
    </div>
  );
}
