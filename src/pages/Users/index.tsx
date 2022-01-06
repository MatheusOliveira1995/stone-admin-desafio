import React, { useEffect } from "react";
import AppTable from 'src/components/shared/app-table'

import { User as UserType } from "src/app/definitions";

import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { setUsers } from "src/app/store/slices/users";
import { getUsers } from 'src/service/api/users'
import { useTranslation, TFunction } from "react-i18next";

import { formatDate } from 'src/util/date'

const configureTableData = ( users: UserType[], t: TFunction<"translation", undefined>) => {
    const columnsMetaData = [
        {
            id: 'name',
            name: t('user.details.name'),
            enableSort: true
        },
        {
            id: 'email',
            name: t('user.details.email'),
            enableSort: true
        },
        {
            id: 'document',
            name: t('user.details.document'),
            enableSort: true
        },
        {
            id: 'birthDate',
            name: t('user.details.birthDate'),
            enableSort: false
        }
    ]
    const rowsData = users.map((user: UserType) => {
        return(
            {
                name: user.name,
                email: user.email,
                document: user.document,
                birthDate: user.BirthDate ? formatDate(user.BirthDate) : '-'
            }
        )
    })
    return{
        columnsMetaData,
        rowsData
    }

}

export default function User() {
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
            />
        </div>
    )
}