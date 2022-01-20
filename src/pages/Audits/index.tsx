/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { useTranslation, TFunction } from "react-i18next";
import { setAudits } from "src/app/store/slices/audits";
import { getAudits } from "src/service/api/audits";
import { GridCellParams, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { formatDate } from "src/util/date";
import { Box } from "@mui/material";

import { Audits as AuditsType, Audit } from "src/app/definitions";

import AppGridData from "src/components/AppGridData";

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
 * @param t Tfunction
 */
function configureAppAuditGridData(data: AuditsType, t: TFunction<"translation", undefined>): GridConfigType | undefined {
    
    if(!data) return;

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
            width: 15
        },
        {
            field: 'type',
            headerName: 'Tipo da alteração',
            width: 200
        },
        {
            field: 'cardHolderNameBefore',
            headerName: 'Titular do cartão(Antes)',
            width: 300,
            editable: false,
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                  'app-grid-different-cell--before': row.cardHolderNameAfter !== row.cardHolderNameBefore
                })
            }
        },
        {
            field: 'digitsBefore',
            headerName: 'Números do cartão(Antes)',
            width: 220,
            type: 'number',
            editable: false,
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                  'app-grid-different-cell--before': row.digitsAfter !== row.digitsBefore
                })
            }
        },
        {
            field: 'limitBefore',
            headerName: 'Limite do cartão(Antes)',
            width: 200,
            type: 'number',
            editable: false,
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                  'app-grid-different-cell--before': row.limitAfter !== row.limitBefore
                })
            }
        },
        {
            field: 'statusBefore',
            headerName: 'Status(Antes)',
            width: 120,
            editable: false,
            cellClassName: (params: GridCellParams<number>) => {
                const row = params.row
                return clsx({
                  'app-grid-different-cell--before': row.statusAfter !== row.statusBefore
                })
            }
        },
        {
            field: 'createdAtBefore',
            headerName: 'Criado em(Antes)',
            width: 160,
            editable: false,
            sortComparator: dateComparator
        },
        {
            field: 'updatedAtBefore',
            headerName: 'Atualizado em(Antes)',
            width: 180,
            editable: false,
            sortComparator: dateComparator
        },
        {
            field: 'cardHolderNameAfter',
            headerName: 'Titular do cartão(Depois)',
            width: 300,
            editable: false,
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
            sortComparator: dateComparator,
        },
        {
            field: 'updatedAtAfter',
            headerName: 'Atualizado em(Depois)',
            width: 180,
            editable: false,
            sortComparator: dateComparator,
        },
        {
            field: 'cardId',
            headerName: 'Id do cartão',
            width: 110,
            type: 'number'
        },
        {
            field: 'userId',
            headerName: 'Id do usuário',
            hide: true,
            width: 100
        },
    ]

    const rows = data.audits.map((audit: Audit) => {
        const data = {
            id: audit.id,
            type: audit.type,
            cardHolderNameBefore: audit.before.metaDatas.name ?? '-',
            digitsBefore: audit.before.metaDatas.digits,
            limitBefore: audit.before.metaDatas.limit,
            statusBefore: t(`card.add.statuses.${audit.before.status}`),
            createdAtBefore: audit.before.createdAt ? formatDate({ dateValue: audit.before.createdAt }) : '-',
            updatedAtBefore: audit.before.updatedAt ? formatDate({ dateValue: audit.before.updatedAt }) : '-',
            cardHolderNameAfter: audit.after.metaDatas.name ?? '-',
            digitsAfter: audit.after.metaDatas.digits,
            limitAfter: audit.after.metaDatas.limit,
            statusAfter: t(`card.add.statuses.${audit.after.status}`),
            createdAtAfter: audit.after.createdAt ? formatDate({ dateValue: audit.after.createdAt }) : '-',
            updatedAtAfter: audit.after.updatedAt ? formatDate({ dateValue: audit.after.updatedAt }) : '-',
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

    const { t } = useTranslation();
    const [auditsGridData, setAuditsGridData] = useState<GridConfigType>({ columns: [], rows: [] })

    useEffect(() => {
        const data = configureAppAuditGridData(audits, t)
        if(data) setAuditsGridData({ columns: data.columns, rows: data.rows })
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
            dispatch(setAudits(response))
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
                height: '600px'
            }}
        >
            <AppAuditGridData audits={audits}/>
        </Box>
    )
}