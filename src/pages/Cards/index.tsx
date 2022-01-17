/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, SyntheticEvent } from 'react';
import { DataGrid, GridCellValue, GridColDef, GridComparatorFn, GridRowId } from '@mui/x-data-grid';
import { Paper, Box, Button, IconButton, Tabs, Tab } from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';
import AssigmentId from '@mui/icons-material/AccountCircle';
import CreditCard from '@mui/icons-material/CreditCard';
import LocalAtm from '@mui/icons-material/LocalAtm';
import Event from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';

import { useTranslation, TFunction } from 'react-i18next';
import { getCards, createCard } from 'src/service/api/cards';
import { getUserByDocument } from 'src/service/api/users';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { setCards } from 'src/app/store/slices/cards';
import { Card, Cards as CardsType, Status, User } from 'src/app/definitions';
import { getUserById } from 'src/service/api/users';
import AppModal from 'src/components/AppModal';
import AppInput from 'src/components/AppInput'
import { SubmitHandler, useForm } from "react-hook-form";

import { formatDate } from 'src/util/date';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type CardForm = {
  document: string,
  limit: number,
  name: string,
  digits: string,
  status: string,
  createdAt: Date
}

type GridConfigType = {
  columns: GridColDef[],
  requestedRows: any[],
  approvedRows: any [],
  rejectedRows: any []
}
type DataGridType = {
  columns: GridColDef[],
  rows: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Paper>
      )}
    </div>
  );
}

const configureGridData = (data: CardsType, t: TFunction<"translation", undefined>): GridConfigType => {
  let requested: any =[]
  let approved: any = []
  let rejected: any = []

  const dateComparator = (v1: GridCellValue, v2: GridCellValue) => {
    if (!v1) v1 = '';
    if (!v2) v2 = '';
    v1 = v1.toString().split('/').reverse().join('');
    v2 = v2.toString().split('/').reverse().join('');
    return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
  }
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
      sortComparator: dateComparator
    },
    {
      field: 'updatedAt',
      headerName: 'Atualizado em',
      sortable: true,
      width: 150,
      sortComparator: dateComparator
    },
  ];

  data.cards.forEach((card: Card) => {
    let cardHolderName = card.metaDatas.name

    if (!card.metaDatas.name) {
      getUserById(card.userId).then((cardHolder) => {
        cardHolderName = cardHolder.name
      })
    }

    const data = {
      id: card.id,
      cardHolderName: cardHolderName,
      digits: card.metaDatas.digits ? card.metaDatas.digits : '-',
      limit: card.metaDatas.limit ? card.metaDatas.limit : '-',
      status: t(`card.add.statuses.${card.status}`),
      createdAt: card.createdAt ? formatDate({ dateValue: card.createdAt }) : '-',
      updatedAt: card.updatedAt ? formatDate({ dateValue: card.updatedAt }) : '-'
    }

    if(card.status === Status.REQUESTED){
      requested.push(data)
      return
    }
    if(card.status === Status.APPROVED){
      approved.push(data)
      return
    }

    rejected.push(data)

  })

  return {
    columns: dataGridColumns,
    requestedRows: requested,
    rejectedRows: rejected,
    approvedRows: approved
  }
}

function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function Cards() {
  const { t } = useTranslation();
  const { register, formState: { errors }, handleSubmit, setError, clearErrors, reset } = useForm<CardForm>({
    defaultValues: {
      createdAt: undefined,
      digits: '',
      document: '',
      limit: undefined,
      status: t('card.add.statuses.requested')
    }
  })
  const [open, setOpen] = useState(false)
  const [document, setDocument] = useState('')
  const [tabState, setTabState] = useState(0)
  const [user, setUser] = useState<User>({
    id: 0,
    document: '',
    name: ''
  })
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const dispatch = useAppDispatch()
  const cards = useAppSelector((state) => state.cards)
  const [requestedGridData, setRequestedGridData] = useState<DataGridType>({ columns: [], rows: [] })
  const [approvedGridData, setApprovedGridData] = useState<DataGridType>({ columns: [], rows: [] })
  const [ rejectedGridData, setRejectedGridData] = useState<DataGridType>({ columns: [], rows: []})
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const handleChangeTab = (event: SyntheticEvent, newState: number) => {
    setTabState(newState)
  }

  const fetchData = () => {
    getCards().then((response) => {
      dispatch(setCards(response))
    })
  }

  const submit: SubmitHandler<CardForm> = (data) => {
    const payload = {
      ...data,
      userId: user.id,
      userName: user.name,
    }
    try {
      createCard(payload)
      handleClose()
      fetchData()
    } catch (error) {

    }

  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const gridData = configureGridData(cards, t)
    setApprovedGridData({columns: gridData.columns, rows: gridData.approvedRows})
    setRejectedGridData({ columns: gridData.columns, rows: gridData.rejectedRows})
    setRequestedGridData({ columns: gridData.columns, rows: gridData.requestedRows})
  }, [cards])

  return (
    <Box component="div" sx={{ backgroundColor: '#fff' }}>
      <Box
        component="div"
        sx={{
          display: 'flex',
          padding: '20px',
        }}
      >
        <Button
          onClick={handleOpen}
          endIcon={<Add />}
          aria-label='Novo'
          size='medium'
          variant='contained'
          color='primary'
        >
          {t('card.actions.new')}
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
          {t('card.actions.delete')}
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
          {t('card.actions.details')}
        </Button>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabState} onChange={handleChangeTab} variant="fullWidth">
          <Tab label="Solicitações em aberto" {...tabProps(0)} />
          <Tab label="Solicitações aceitas" {...tabProps(1)} />
          <Tab label="Solicitações recusadas" {...tabProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabState} index={0}>
        <Box component="div"
          sx={{
            display: 'flex',
            backgroundColor: 'white',
            flexDirection: 'column',
            padding: '18px 18px 30px 18px',
            height: '600px',
          }}
        >
          <DataGrid
            rows={ requestedGridData.rows }
            columns={ requestedGridData.columns }
            autoPageSize
            rowsPerPageOptions={[30]}
            checkboxSelection
            selectionModel={selectionModel}
            hideFooterSelectedRowCount
            onSelectionModelChange={(selection) => {
              if (selection.length === requestedGridData.rows.length) {
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
      </TabPanel>

      <TabPanel value={tabState} index={1}>
        <Box component="div"
          sx={{
            display: 'flex',
            backgroundColor: 'white',
            flexDirection: 'column',
            padding: '18px 18px 30px 18px',
            height: '600px',
          }}
        >
          <DataGrid
            rows={ approvedGridData.rows }
            columns={ approvedGridData.columns }
            autoPageSize
            rowsPerPageOptions={[30]}
            checkboxSelection
          />
        </Box>
      </TabPanel>

      <TabPanel value={tabState} index={2}>
        <Box component="div"
          sx={{
            display: 'flex',
            backgroundColor: 'white',
            flexDirection: 'column',
            padding: '18px 18px 30px 18px',
            height: '600px',
          }}
        >
          <DataGrid
            rows={ rejectedGridData.rows }
            columns={ rejectedGridData.columns }
            autoPageSize
            rowsPerPageOptions={[30]}
            checkboxSelection
          />
        </Box>
      </TabPanel>


      <AppModal
        handleClose={handleClose}
        open={open}
        title={t('card.add.title')}
      >
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
            component="form"
            method='POST'
            onSubmit={handleSubmit(submit)}
          >
            <Box gridColumn="span 3">
              <AppInput
                name="document"
                type='text'
                register={register}
                handleChange={(value: string) => setDocument(value)}
                label={t('card.add.document')}
                error={errors.document}
                validation={{
                  required: t('card.validation.required')
                }}
                endAdornment={
                  <IconButton
                    onClick={() => {
                      if (!document) return;
                      getUserByDocument(document).then((user: Array<User>) => {
                        if (user.length) {
                          clearErrors('document')
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
                        setError("document", { type: "custom", message: t('card.validation.user') })
                      })
                    }}
                    aria-label="search"
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                }
              />
            </Box>
            <Box gridColumn="span 9">
              <AppInput
                name="name"
                type='text'
                value={user.name}
                startAdornment={<AssigmentId />}
                label={t('card.add.clientName')}
              />
            </Box>
            <Box gridColumn="span 8">
              <AppInput
                name="limit"
                register={register}
                type="text"
                error={errors.limit}
                validation={{
                  required: t('card.validation.required')
                }}
                startAdornment={<LocalAtm />}
                label={t('card.add.limit')}
              />
            </Box>
            <Box gridColumn="span 4">
              <AppInput
                name="digits"
                register={register}
                validation={{
                  required: t('card.validation.required')
                }}
                error={errors.digits}
                startAdornment={<CreditCard />}
                label={t('card.add.digits')}
                type="text"
              />
            </Box>
            <Box gridColumn="span 4">
              <AppInput
                name="createdAt"
                type="date"
                register={register}
                validation={{
                  required: t('card.validation.required')
                }}
                error={errors.createdAt}
                startAdornment={<Event />}
                label={t('card.add.createdAt')}
              />
            </Box>
            <Box gridColumn="span 8">
              <AppInput
                name="status"
                register={register}
                validation={{
                  required: t('card.validation.required')
                }}
                error={errors.status}
                label={t('card.add.status')}
                type="text"
                readOnly={true}
              />
            </Box>
            <Box sx={{ display: 'flex' }} component="div" gridColumn="span 12" justifyContent="flex-end">
              <Button variant='contained' color='primary' type='submit'>{t('card.actions.save')}</Button>
              <Button sx={{ marginLeft: 2 }} variant='contained' color='error' onClick={() => handleClose()}>{t('card.actions.cancel')}</Button>
            </Box>
          </Box>
        </>
      </AppModal>
    </Box>
  );
}
