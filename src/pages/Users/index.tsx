/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import AppTable from 'src/components/AppTable'

import { User as UserType } from "src/app/definitions";

import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { setUsers } from "src/app/store/slices/users";
import { getUsers } from 'src/service/api/users'
import { useTranslation, TFunction } from "react-i18next";

import { Column } from "src/components/AppTable";

import { formatDate } from 'src/util/date'
import { formatDocument } from 'src/util/format' 

const configureTableData = ( users: UserType[], t: TFunction<"translation", undefined>) => {
    const columnsMetaData: Column[] = [
        {
            id: 'id',
            name: 'ID',
            enableSort: true,
            width: 5,
        },
        {
            id: 'name',
            name: t('user.details.name'),
            enableSort: true,
            width: 150
        },
        {
            id: 'email',
            name: t('user.details.email'),
            enableSort: true,
            width: 150
        },
        {
            id: 'document',
            name: t('user.details.document'),
            enableSort: true,
            width: 45
        },
        {
            id: 'birthDate',
            name: t('user.details.birthDate'),
            enableSort: false,
            width: 50
        }
    ]
    const rowsData = users.map((user: UserType) => {
        return(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                document: formatDocument(user.document.toString()),
                birthDate: user.BirthDate ? formatDate(user.BirthDate) : '-'
            }
        )
    })
    return{
        columnsMetaData,
        rowsData
    }

}



export default function Users() {
    const { t } = useTranslation();

    const dipatch = useAppDispatch()
    const { users } = useAppSelector((state) => state.users)
    const tableData = configureTableData(users, t)

    useEffect(() => {
        getUsers().then((response) => {
            dipatch(setUsers(response))
        })
    }, [])

    return (
        <div>
            <AppTable
                columns={tableData.columnsMetaData}
                rows={tableData.rowsData}
                headerTitle={t('user.label')}
            />
        </div>
    )
}