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
            <AppTable
                columns={[
                    {
                        id: 'name',
                        name: 'Name',
                        enableSort: true,
                    },
                    {
                        id: 'desc',
                        name: 'Description',
                        enableSort: true,
                    },
                    {
                        id: 'data',
                        name: 'Data',
                        enableSort: true,
                    }
                ]}
                rows={[
                   { 
                       name: 'First',
                       desc: 'First Item',
                       data: '29/12/1995'
                    },
                   { 
                       name: 'Second',
                       desc: 'Second Item',
                       data:'21/02/1954'
                    }
                ]}
            
            />
        </div>
    )
}