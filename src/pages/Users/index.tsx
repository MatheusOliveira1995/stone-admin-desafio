import React from "react";
import { useEffect } from "react";
import AppTable from 'src/components/shared/app-table'

import { useAppDispatch } from "src/app/hooks";
import { setUsers } from "src/app/store/slices/users";
import { getUsers } from 'src/service/api/users'

export default function User() {
    const dipatch = useAppDispatch()
    useEffect(() => {
        getUsers().then((response) => {
            dipatch(setUsers(response))
        })
    }, [])

    return (
        <div>
            <AppTable />
        </div>
    )
}