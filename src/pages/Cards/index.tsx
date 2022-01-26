/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, SyntheticEvent } from 'react';
import { GridCellParams, GridCellValue, GridColDef, GridRowId, GridSortModel } from '@mui/x-data-grid';
import { Paper, Box, Button, IconButton, Tabs, Tab, Tooltip } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
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
import { getCards, saveCard, deleteCard } from 'src/service/api/cards';
import { getUserByDocument } from 'src/service/api/users';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { setCards } from 'src/app/store/slices/cards';
import { error } from 'src/app/store/slices/toast';
import { Analyst, Card, Cards as CardsType, Status, User } from 'src/app/definitions';
import { getUserById } from 'src/service/api/users';
import AppModal from 'src/components/AppModal';
import AppInput from 'src/components/AppInput';
import AppGridData from 'src/components/AppGridData';
import AppFloatButton from 'src/components/AppFloatButton';
import { SubmitHandler, useForm } from "react-hook-form";


import { formatDate } from 'src/util/date';

import './styles.css'


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
type SubmitType = {
  data: Record<string, unknown>,
  before: Card | undefined,
  requestedBy: number | string
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
            flexDirection: 'column',
          }}
        >
          {children}
        </Paper>
      )}
    </div>
  );
}

/** 
 * @param data CardsType
 * @param t TFunction<"translation", undefined>
 * @param analyst Analyst
 * @returns GridConfigType
 */
const configureGridData = (data: CardsType, t: TFunction<"translation", undefined>, analyst: Analyst): GridConfigType | undefined => {
  if (!data.cards.length) return;

  const isAdm = analyst.roles.find((role) => role === 'n2')

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
      headerName: t('card.datagridFields.cardHolderName'),
      width: 150,
      editable: false,
    },
    {
      field: 'digits',
      headerName: t('card.datagridFields.digits'),
      width: 150,
      type: 'number',
      editable: false,
    },
    {
      field: 'limit',
      headerName: t('card.datagridFields.limit'),
      type: 'number',
      width: 200,
      editable: false,
      hideable: isAdm ? true : false,
      hide: !isAdm
    },
    {
      field: 'status',
      headerName: t('card.datagridFields.status'),
      sortable: true,
      width: 160,
    },
    {
      field: 'userId',
      type: 'number',
      headerName: t('card.datagridFields.userId'),
      hide: true,
      sortable: true,
      width: 100,
    },
    {
      field: 'createdAt',
      headerName: t('card.datagridFields.createdAt'),
      sortable: true,
      width: 100,
      sortComparator: dateComparator
    },
    {
      field: 'updatedAt',
      headerName: t('card.datagridFields.updatedAt'),
      sortable: true,
      width: 120,
      sortComparator: dateComparator
    },
  ];
  data.cards.forEach((card: Card) => {
    const data = {
      id: card.id,
      cardHolderName: card.metaDatas.name ? card.metaDatas.name : '',
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
  const analyst = useAppSelector((state) => state.analyst)
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
   * @param event SyntheticEvent
   * @param newState number
   */
  const handleChangeTab = (event: SyntheticEvent, newState: number) => {
    setTabState(newState)
  }
  /**
   * @param row any
   */
  const handleEdit = (row: any) => {
    const isAdm = analyst.roles.find((role) => role === 'n2')
    getUserById(row.userId).then((user) => {
      if (!user) return;
      setValue('id', row.id)
      setValue('userId', user.id)
      setValue('document', user.document)
      setValue('name', row.cardHolderName)
      setValue('digits', row.digits)
      setValue('limit', isAdm ? row.limit : '******')
      setValue('status', row.status)
      setValue('createdAt', row.createdAt.split('/').reverse().join('-'))
      setIsEditing(true)
      handleOpenModal()
    })
  }
  /**
   */
  const handleDelete = () => {
    if (!selectionModel.length) {
      return
    };
    const selectedId = selectionModel.shift()
    const before = cards.cards.find((card) => card.id === selectedId)
    try {
      deleteCard({ cardId: selectedId as number, before, requestedBy: analyst.userId })
      fetchData()
    } catch (e) {
      dispatch(error(t('card.delete.error')))
    }
  }
  
  /**
   * @param status Status
   */
  const handleStatusChange = async (status: Status) => {
    if (!selectionModel.length) return;

    const selectedId = selectionModel[0]
    const selectedRow = requestedGridData.rows.filter((row: Record<string, unknown>) => {
      return row.id === selectedId
    }).shift()
    const before = cards.cards.find((card) => card.id === selectedRow.id)
    const payload: SubmitType = {
      data: {
        id: selectedRow.id,
        status: status,
        userId: selectedRow.userId,
        createdAt: selectedRow.createdAt.split('/').reverse().join('-'),
        name: selectedRow.cardHolderName,
        digits: selectedRow.digits,
        limit: selectedRow.limit
      },
      before: before,
      requestedBy: analyst.userId
    }
    try {
      await saveCard(payload)
      fetchData()
    } catch (e) {
      dispatch(error(t('card.update.error')))
    }
  }
  /**
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
    const payload: SubmitType = {
      data: {
        ...data
      },
      before: undefined,
      requestedBy: analyst.userId
    }
    payload.data.createdAt = formatDate({ dateValue: data.createdAt, pattern: 'us' }) ?? '-'
    if (data.id) {
      payload.before = cards.cards.find((card) => card.id === data.id)
    }
    payload.data.status = Status.REQUESTED
    try {
      saveCard(payload)
      handleCloseModal()
      fetchData()
      if (tabState) {
        setTabState(0)
      }

    } catch (e) {
      dispatch(error(t('card.add.error')))
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
    const gridData = configureGridData(cards, t, analyst)
    if (!gridData) {
      return
    }
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
          <Tooltip title={t('card.add.tooltip') ?? ''}>
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
          </Tooltip>
          <Tooltip title={t('card.delete.tooltip') ?? ''}>
            <span>
              <Button
                disabled={!analyst.roles.find((role) => role === 'n2') || selectionModel.length === 0}
                onClick={() => handleDelete()}
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
            </span>
          </Tooltip>
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
              {t('card.actions.approve')}
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
              {t('card.actions.reject')}
            </Button>
          </Box>
        }

      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabState} onChange={handleChangeTab} variant="fullWidth">
          <Tab label={t('card.requestedTab')} {...tabProps(0)} />
          <Tab label={t('card.approvedTab')} {...tabProps(1)} />
          <Tab label={t('card.rejectedTab')} {...tabProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabState} index={0}>
        <Box component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '18px 18px 30px 18px',
            height: '600px'
          }}
        >
          <AppGridData
            rows={requestedGridData.rows}
            columns={[
              ...requestedGridData.columns,
              {
                field: 'edit',
                type: 'actions',
                headerName: t('card.datagridFields.edit'),
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
            rowsPerPage={[20]}
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
            flexDirection: 'column',
            padding: '18px 18px 30px 18px',
            height: '600px'
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
            flexDirection: 'column',
            padding: '18px 18px 30px 18px',
            height: '600px'
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
                    const user = await loadUserFormDataByDocument() as User
                    //if not return any user with this document
                    if (!user) {
                      return t('card.validation.user')
                    }
                    //the user must have feature cards(id= 0) to be valid
                    if (user.enabledFeatures?.find((feature) => feature.id === 0)) {
                      setValue('userId', user.id)
                      return
                    }
                    return t('card.validation.invalidFeature')

                  }
                }}
                endAdornment={
                  <IconButton
                    disabled={isEditing}
                    onClick={async () => {
                      const user = await loadUserFormDataByDocument() as User
                      //if not return any user with this document
                      if (!user) {
                        setError("document", { type: "custom", message: t('card.validation.user') })
                        return
                      }
                      //the user must have feature cards(id= 0) to be valid
                      if (user.enabledFeatures?.find((feature) => feature.id === 0)) {
                        clearErrors('document')
                        setValue('name', user.name)
                        setValue('userId', user.id)
                        return
                      }

                      setError("document", { type: "custom", message: t('card.validation.invalidFeature') })

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

      <Box id='card-help' sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', right: 16, bottom: 16 }}>
        <Tooltip TransitionComponent={Zoom} placement="left" title={t('card.helpText') as string}>
          <div>
            <AppFloatButton color="primary">
              <HelpIcon />
            </AppFloatButton>
          </div>
        </Tooltip>
      </Box>
    </Box>
  );
}
