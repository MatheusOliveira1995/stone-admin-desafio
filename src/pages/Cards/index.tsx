/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, SyntheticEvent } from 'react';
import { GridCellParams, GridCellValue, GridColDef, GridRowId, GridSortModel } from '@mui/x-data-grid';
import { Paper, Box, Button, IconButton, Tabs, Tab, Tooltip } from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';
import AssigmentId from '@mui/icons-material/AccountCircle';
import CreditCard from '@mui/icons-material/CreditCard';
import LocalAtm from '@mui/icons-material/LocalAtm';
import Event from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import HelpIcon from '@mui/icons-material/Help';
import Zoom from '@mui/material/Zoom';
import EditIcon from '@mui/icons-material/Edit';

import { useTranslation, TFunction } from 'react-i18next';
import { getCards, saveCard } from 'src/service/api/cards';
import { getUserByDocument } from 'src/service/api/users';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { setCards } from 'src/app/store/slices/cards';
import { Card, Cards as CardsType, Status, User } from 'src/app/definitions';
import { getUserById } from 'src/service/api/users';
import AppModal from 'src/components/AppModal';
import AppInput from 'src/components/AppInput';
import AppGridData from 'src/components/AppGridData';
import AppFloatButton from 'src/components/AppFloatButton';
import { SubmitHandler, useForm } from "react-hook-form";

import { formatDate } from 'src/util/date';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type CardForm = {
  id: number,
  document: string,
  userId: number,
  limit: number,
  name: string,
  digits: string,
  status: string,
  createdAt: Date
}

type GridConfigType = {
  columns: GridColDef[],
  requestedRows: any[],
  approvedRows: any[],
  rejectedRows: any[]
}
type DataGridType = {
  columns: GridColDef[],
  rows: any
}

/**
 * @param props 
 */
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

/** 
 * @param data 
 * @param t 
 * @returns GridConfigType
 */
const configureGridData = (data: CardsType, t: TFunction<"translation", undefined>): GridConfigType => {
  let requested: any = []
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
      headerName: 'Nome impresso',
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
      field: 'userId',
      type: 'number',
      headerName: 'Id usuário',
      hide: true,
      sortable: true,
      width: 100,
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
      width: 120,
      sortComparator: dateComparator
    },
  ];

  data.cards.forEach((card: Card) => {
    const data = {
      id: card.id,
      cardHolderName: card.metaDatas.name ? card.metaDatas.name :  '',
      digits: card.metaDatas.digits ? card.metaDatas.digits : '-',
      limit: card.metaDatas.limit ? card.metaDatas.limit : '-',
      status: t(`card.add.statuses.${card.status}`),
      userId: card.userId,
      createdAt: card.createdAt ? formatDate({ dateValue: card.createdAt }) : '-',
      updatedAt: card.updatedAt ? formatDate({ dateValue: card.updatedAt }) : '-',
    }

    if (card.status === Status.REQUESTED) {
      requested.push(data)
      return
    }
    if (card.status === Status.APPROVED) {
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
/**
 * @param index 
 */
function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Cards() {
  const { t } = useTranslation();
  const { register, formState: { errors }, handleSubmit, setError, setValue, getValues, clearErrors, reset } = useForm<CardForm>({
    defaultValues: {
      id: undefined,
      userId: undefined,
      createdAt: undefined,
      name: '',
      digits: '',
      document: '',
      limit: undefined,
      status: t('card.add.statuses.requested')
    }
  })
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tabState, setTabState] = useState(0)

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [defaultSortRequestGrid, setDefaultSortRequestGrid] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }])
  const dispatch = useAppDispatch()
  const cards = useAppSelector((state) => state.cards)
  const [requestedGridData, setRequestedGridData] = useState<DataGridType>({ columns: [], rows: [] })
  const [approvedGridData, setApprovedGridData] = useState<DataGridType>({ columns: [], rows: [] })
  const [rejectedGridData, setRejectedGridData] = useState<DataGridType>({ columns: [], rows: [] })
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false)
    if (isEditing) {
      setIsEditing(false)
    }
    reset()
  }

  /**
   * @param event 
   * @param newState 
   */
  const handleChangeTab = (event: SyntheticEvent, newState: number) => {
    setTabState(newState)
  }
  /**
   * @param row 
   */
  const handleEdit = (row: any) => {
    getUserById(row.userId).then((user) => {
      setValue('id', row.id)
      setValue('userId', user.id)
      setValue('document', user.document)
      setValue('name', row.cardHolderName)
      setValue('digits', row.digits)
      setValue('limit', row.limit)
      setValue('status', row.status)
      setValue('createdAt', row.createdAt.split('/').reverse().join('-'))
      setIsEditing(true)
      handleOpenModal()
    })
  }
  /**
   */
  const handleStatusChange = (status: Status) => {
    if(!selectionModel.length) return;
    const selectedId= selectionModel[0]
    const selectedRow = requestedGridData.rows.filter((row: Record<string, unknown>) => {
      return row.id === selectedId
    }).shift()
    const payload = {
      id: selectedRow.id,
      status: status,
      userId: selectedRow.userId,
      createdAt: selectedRow.createdAt,
      name: selectedRow.cardHolderName,
      digits: selectedRow.digits,
      limit: selectedRow.limit
    }
    try {
      saveCard(payload)
      fetchData()
    } catch (error) {
      
    }
  }
  /**
   * @returns Promise<User>
   */
  const loadUserFormDataByDocument = () => {
    const document = getValues('document')
    if (!document) return;
    const response = getUserByDocument(document)
    return response
  }
  /**
   */
  const fetchData = () => {
    getCards().then((response) => {
      dispatch(setCards(response))
    })
  }
  /**
   * @param data 
   */
  const submit: SubmitHandler<CardForm> = (data) => {
    const payload = {
      ...data
    }
    payload.status = Status.REQUESTED
    try {
      saveCard(payload)
      handleCloseModal()
      fetchData()
      if (tabState) {
        setTabState(0)
      }

    } catch (error) {

    }

  }
  /**
   */
  useEffect(() => {
    fetchData()
  }, [])
  /**
   */
  useEffect(() => {
    const gridData = configureGridData(cards, t)
    setApprovedGridData({ columns: gridData.columns, rows: gridData.approvedRows })
    setRejectedGridData({ columns: gridData.columns, rows: gridData.rejectedRows })
    setRequestedGridData({ columns: gridData.columns, rows: gridData.requestedRows })
  }, [cards])

  return (
    <Box component="div" sx={{ backgroundColor: '#fff' }}>
      <Box
        component="div"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2}
        sx={{
          display: 'grid',
          padding: '20px',
          width: '100%',
        }}
      >
        <Box gridColumn="span 8" component='div'>
          <Button
            onClick={handleOpenModal}
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
        {selectionModel.length > 0 &&
          <Box gridColumn="span 4" component='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => handleStatusChange(Status.APPROVED)}
              endIcon={<ThumbUpAltIcon />}
              aria-label='Detalhes'
              size='medium'
              variant='outlined'
              color='primary'
              sx={
                {
                  marginLeft: '10px'
                }
              }
            >
              Aprovar
            </Button>

            <Button
              onClick={() => handleStatusChange(Status.REJECTED)}
              endIcon={<ThumbDownAltIcon />}
              aria-label='Detalhes'
              size='medium'
              variant='outlined'
              color='error'
              sx={
                {
                  marginLeft: '10px'
                }
              }
            >
              Recusar
            </Button>
          </Box>
        }

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
          <AppGridData
            rows={requestedGridData.rows}
            columns={[
              ...requestedGridData.columns,
              {
                field: 'edit',
                type: 'actions',
                headerName: 'Editar',
                width: 70,
                sortable: false,
                cellClassName: 'actions',
                renderCell: (params: GridCellParams) => {
                  return (
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        handleEdit(params.row)
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )
                }
              },
            ]}
            autoPageSize={true}
            rowsPerPage={[30]}
            checkboxSelection={true}
            sortModel={defaultSortRequestGrid}
            noRowsOverlayMessage={t('card.gridDataEmpty')}
            handleSortModelChange={(model) => setDefaultSortRequestGrid(model)}
            selectionModel={selectionModel}
            hideFooterSelectedRowsCount={true}
            handleSelectionModelChange={(selection) => {
              if ((selection.length === requestedGridData.rows.length) && selection.length > 1) {
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
          <AppGridData
            noRowsOverlayMessage={t('card.gridDataEmpty')}
            rows={approvedGridData.rows}
            columns={approvedGridData.columns}
            autoPageSize={true}
            rowsPerPage={[30]}
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
          <AppGridData
            noRowsOverlayMessage={t('card.gridDataEmpty')}
            rows={rejectedGridData.rows}
            columns={rejectedGridData.columns}
            autoPageSize={true}
            rowsPerPage={[30]}
          />
        </Box>
      </TabPanel>


      <AppModal
        handleClose={handleCloseModal}
        open={open}
        title={!isEditing ? t('card.add.title') : t('card.update.title')}
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
                readOnly={isEditing}
                name="document"
                type='text'
                register={register}
                label={t('card.add.document')}
                error={errors.document}
                validation={{
                  required: t('card.validation.required'),
                  validate: async () => {
                    const user = await loadUserFormDataByDocument() as Array<User>
                    //if not return any user with this document
                    if (!user) {
                      return t('card.validation.user')
                    }
                    setValue('userId', user[0].id)
                  }
                }}
                endAdornment={
                  <IconButton
                    disabled={isEditing}
                    onClick={async () => {
                      const user = await loadUserFormDataByDocument() as Array<User>
                      if (!user.length) {
                        setError("document", { type: "custom", message: t('card.validation.user') })
                        return
                      }
                      clearErrors('document')
                      setValue('name', user[0].name)
                      setValue('userId', user[0].id)
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
                register={register}
                error={errors.name}
                validation={{
                  required: t('card.validation.required')
                }}
                type='text'
                startAdornment={<AssigmentId />}
                label={t('card.add.clientName')}
              />
            </Box>
            <Box gridColumn="span 8">
              <AppInput
                readOnly={isEditing}
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
                readOnly={isEditing}
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
                readOnly={isEditing}
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
            <AppInput
              label='ID'
              name="id"
              register={register}
              type="number"
              hidden={true}
            />
            <AppInput
              label='User ID'
              name="userId"
              register={register}
              type="number"
              hidden={true}
            />
            <Box sx={{ display: 'flex' }} component="div" gridColumn="span 12" justifyContent="flex-end">
              <Button variant='contained' color='primary' type='submit'>{t('card.actions.save')}</Button>
              <Button sx={{ marginLeft: 2 }} variant='contained' color='error' onClick={() => handleCloseModal()}>{t('card.actions.cancel')}</Button>
            </Box>
          </Box>
        </>
      </AppModal>

      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', right: 16, bottom: 16 }}>
        <Tooltip TransitionComponent={Zoom} placement="left" title={t('card.helpText') as string}>
          <div>
            <AppFloatButton color="secondary">
              <HelpIcon />
            </AppFloatButton>
          </div>
        </Tooltip>
      </Box>
    </Box>
  );
}
