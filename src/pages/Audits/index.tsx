/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { useTranslation, TFunction } from "react-i18next";
import { setAudits } from "src/app/store/slices/audits";
import { getAudits } from "src/service/api/audits";
import { GridCellParams, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

import { Audits as AuditsType, Audit } from "src/app/definitions";

import AppGridData from "src/components/AppGridData";
import { showBackdrop, hideBackdrop } from "src/app/store/slices/backdrop";
import clsx from 'clsx';

import './styles.css'


type GridConfigType = {
    columns: GridColDef[],
    rows: any
}

interface AppAuditType {
    audits: AuditsType
}

/**
 * @param data Audits
 * @param t TFunction<"translation", undefined>
 */
function configureAppAuditGridData(data: AuditsType, t: TFunction<"translation", undefined>): GridConfigType | undefined {

    if (!data.audits.length) return;

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
            headerName: 'Id',
            width: 15,
            headerClassName: 'app-grid-header--info',
        },
        {
            field: 'type',
            headerName: 'Tipo da alteração',
            width: 200,
            headerClassName: 'app-grid-header--info',
        },
        {
            field: 'requestedBy',
            headerName: 'Realizado por',
            width: 350,
            headerClassName: 'app-grid-header--info',
        },
        {
            field: 'cardId',
            headerName: 'Id do cartão',
            width: 110,
            headerClassName: 'app-grid-header--info',
            type: 'number'
        },
        {
            field: 'cardHolderNameBefore',
            headerName: 'Titular do cartão(Antes)',
            width: 350,
            editable: false,
            headerClassName: 'app-grid-header--before',
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--before': row.cardHolderNameAfter !== row.cardHolderNameBefore && row.type !== 'created'
                })
            }
        },
        {
            field: 'digitsBefore',
            headerName: 'Números do cartão(Antes)',
            width: 220,
            type: 'number',
            editable: false,
            headerClassName: 'app-grid-header--before',
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--before': row.digitsAfter !== row.digitsBefore && row.type !== 'created'
                })
            }
        },
        {
            field: 'limitBefore',
            headerName: 'Limite do cartão(Antes)',
            width: 200,
            type: 'number',
            headerClassName: 'app-grid-header--before',
            editable: false,
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--before': row.limitAfter !== row.limitBefore && row.type !== 'created'
                })
            }
        },
        {
            field: 'statusBefore',
            headerName: 'Status(Antes)',
            width: 120,
            headerClassName: 'app-grid-header--before',
            editable: false,
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--before': row.statusAfter !== row.statusBefore && row.type !== 'created'
                })
            }
        },
        {
            field: 'createdAtBefore',
            headerName: 'Criado em(Antes)',
            width: 160,
            editable: false,
            headerClassName: 'app-grid-header--before',
            sortComparator: dateComparator
        },
        {
            field: 'updatedAtBefore',
            headerName: 'Atualizado em(Antes)',
            width: 180,
            editable: false,
            headerClassName: 'app-grid-header--before',
            sortComparator: dateComparator
        },
        {
            field: 'cardHolderNameAfter',
            headerName: 'Titular do cartão(Depois)',
            width: 350,
            editable: false,
            headerClassName: 'app-grid-header--after',
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--after': row.cardHolderNameAfter !== row.cardHolderNameBefore
                })
            }
        },
        {
            field: 'digitsAfter',
            headerName: 'Números do cartão(Depois)',
            width: 220,
            type: 'number',
            editable: false,
            headerClassName: 'app-grid-header--after',
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--after': row.digitsAfter !== row.digitsBefore
                })
            }
        },
        {
            field: 'limitAfter',
            headerName: 'Limite do cartão(Depois)',
            width: 200,
            type: 'number',
            editable: false,
            headerClassName: 'app-grid-header--after',
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--after': row.limitAfter !== row.limitBefore
                })
            }
        },
        {
            field: 'statusAfter',
            headerName: 'Status(Depois)',
            width: 140,
            editable: false,
            headerClassName: 'app-grid-header--after',
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                    'app-grid-different-cell--after': row.statusAfter !== row.statusBefore
                })
            }
        },
        {
            field: 'createdAtAfter',
            headerName: 'Criado em(Depois)',
            width: 160,
            editable: false,
            headerClassName: 'app-grid-header--after',
            sortComparator: dateComparator,
        },
        {
            field: 'updatedAtAfter',
            headerClassName: 'app-grid-header--after',
            headerName: 'Atualizado em(Depois)',
            width: 180,
            editable: false,
            sortComparator: dateComparator,
        },
        {
            field: 'userId',
            headerName: 'Id do usuário',
            hide: true,
            headerClassName: 'app-grid-header--info',
            width: 100
        },
    ]

    const rows = data.audits.map((audit: Audit) => {
        let type = audit.type as string

        if (type.split('-').length > 0) {
            type = audit.type.split('-').reduce((accumulator, current) => {
                return accumulator + current.charAt(0).toUpperCase() + current.substring(1)
            })
        }
        const data = {
            id: audit.id,
            type: t(`audit.statuses.${type}`),
            requestedBy: audit.requestedBy,
            cardHolderNameBefore: audit.before.metaDatas.name,
            digitsBefore: audit.before.metaDatas.digits,
            limitBefore: audit.before.metaDatas.limit,
            statusBefore: audit.before.status ? t(`card.add.statuses.${audit.before.status}`) : '',
            createdAtBefore: audit.before.createdAt,
            updatedAtBefore: audit.before.updatedAt,
            cardHolderNameAfter: audit.after.metaDatas.name,
            digitsAfter: audit.after.metaDatas.digits,
            limitAfter: audit.after.metaDatas.limit,
            statusAfter: audit.after.status ? t(`card.add.statuses.${audit.after.status}`) : '',
            createdAtAfter: audit.after.createdAt,
            updatedAtAfter: audit.after.updatedAt,
            cardId: audit.after.id,
            userId: audit.after.userId
        }
        return data
    })

    return {
        columns: dataGridColumns,
        rows: rows
    }

}

/**
 * @param audits Audits
 * @returns 
 */
export function AppAuditGridData({ audits }: AppAuditType) {
    const dispatch = useAppDispatch()
    const { t } = useTranslation();
    const [auditsGridData, setAuditsGridData] = useState<GridConfigType>({ columns: [], rows: [] })

    useEffect(() => {
        if(!audits.audits.length){
            dispatch(showBackdrop())
        }
        const gridData = configureAppAuditGridData(audits, t)
        if (!gridData) {
            return
        }
        setAuditsGridData({ columns: gridData.columns, rows: gridData.rows })

        dispatch(hideBackdrop())
    }, [audits])

    return (
        <>
            <AppGridData
                rows={auditsGridData.rows}
                columns={auditsGridData.columns}
                checkboxSelection={false}
                autoPageSize={true}
                rowsPerPage={[30]}
                hideFooterSelectedRowsCount={true}
                noRowsOverlayMessage={t('card.gridDataEmpty')}
            />
        </>
    )
}

export default function Audits() {
    const dispatch = useAppDispatch()
    const audits = useAppSelector((state) => state.audits)

    /**
     */
    const fetchData = () => {
        getAudits().then((response) => {
            dispatch(setAudits(response.audits))
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Box component="div"
            sx={{
                display: 'flex',
                backgroundColor: '#fff',
                flexDirection: 'column',
                padding: '18px 18px 30px 18px',
                height: '700px'
            }}
        >
            <AppAuditGridData audits={audits} />
        </Box>
    )
}