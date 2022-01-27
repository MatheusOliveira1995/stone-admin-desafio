/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AppTable from 'src/components/AppTable'
import { Box } from '@mui/material';
import AssigmentId from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DoneIcon from '@mui/icons-material/Done';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Event from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { setUsers } from "src/app/store/slices/users";
import { getUsers } from 'src/service/api/users'
import { useTranslation, TFunction } from "react-i18next";
import { Column } from "src/components/AppTable";

import { User as UserType } from "src/app/definitions";
import { formatDate } from 'src/util/date';
import { formatDocument } from 'src/util/format';
import { useForm } from "react-hook-form";

import AppModal from 'src/components/AppModal';
import AppInput from "src/components/AppInput";

type UserForm = {
    document: string,
    name: string,
    email: string | undefined,
    birthDate: string | undefined,
    salaryBase: string | undefined,
    validDocument: string | undefined,
    verifiedDocument: string | undefined,
    neighborhood: string,
    streetNumber: string,
    state: string,
    city: string,
    postalCode: string,
    cardFeature: string|undefined
}
/**
 * @param users UserType[]
 * @param t TFunction<"translation", undefined>
 */
const configureTableData = (users: UserType[], t: TFunction<"translation", undefined>) => {
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
            enableSort: false,
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
        return (
            {
                id: user.id,
                name: user.name,
                email: user.email,
                document: formatDocument(user.document.toString()),
                birthDate: user.birthDate ? formatDate({ dateValue: user.birthDate }) : '-'
            }
        )
    })
    return {
        columnsMetaData,
        rowsData
    }

}



export default function Users() {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false)
    const dipatch = useAppDispatch()
    const { users } = useAppSelector((state) => state.users)
    const analyst = useAppSelector((state) => state.analyst)
    const tableData = configureTableData(users, t)
    const { register, setValue } = useForm<UserForm>()

    /**
     * @param id number
     */
    const handleClick = (id: number) => {
        const isAdm = analyst.roles.find((role) => role === 'n2')
        const user = users.find((user) => user.id === id)
        if (!user) return

        //get feature if user is eligible to be used in new card
        const cardFeature = user.enabledFeatures?.find((feature) => feature.id === 0)
        
        let salaryBase = user.salaryBase ? user.salaryBase.toString() : ''
        if (!isAdm) {
            salaryBase = '*******'
        }


        setValue('document', user.document)
        setValue('name', user.name)
        setValue('email', user.email)
        setValue('birthDate', user.birthDate ? formatDate({ dateValue: user.birthDate.toString() }) : undefined)
        setValue('salaryBase', salaryBase)
        setValue('validDocument', user.metaDatas ? t(`user.add.valid.${user.metaDatas.validDocument.toString()}`) : undefined)
        setValue('verifiedDocument', user.metaDatas ? t(`user.add.valid.${user.metaDatas.verified.toString()}`) : undefined)
        setValue('neighborhood', user.address.neighborhood)
        setValue('streetNumber', user.address.streetNumber.toString())
        setValue('state', user.address.state)
        setValue('city', user.address.city)
        setValue('postalCode', user.address.postalCode)
        setValue('cardFeature', cardFeature ? t(`user.add.valid.true`) : t(`user.add.valid.false`))
        handleOpenModal()

    }
    /**
     */
    const handleOpenModal = () => setOpenModal(true);
    /**
     */
    const handleCloseModal = () => {
        setOpenModal(false)
    }

    useEffect(() => {
        getUsers().then((response) => {
            dipatch(setUsers(response))
        })
    }, [])

    return (
        <Box component='div'>
            <AppTable
                handleClick={handleClick}
                columns={tableData.columnsMetaData}
                rows={tableData.rowsData}
                headerTitle={t('user.label')}
            />

            <AppModal
                handleClose={handleCloseModal}
                open={openModal}
                title={t('user.add.title')}
                disableEscKeyDown={false}
            >
                <>
                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                        component="form"
                    >
                        <Box gridColumn='span 3'>
                            <AppInput
                                readOnly={true}
                                name="document"
                                register={register}
                                type='text'
                                label={t('user.add.document')}
                            />
                        </Box>
                        <Box gridColumn='span 9'>
                            <AppInput
                                readOnly={true}
                                name="name"
                                register={register}
                                type='text'
                                startAdornment={<AssigmentId />}
                                label={t('user.add.userName')}
                            />
                        </Box>
                        <Box gridColumn='span 8'>
                            <AppInput
                                readOnly={true}
                                name="email"
                                register={register}
                                type='text'
                                startAdornment={<EmailIcon />}
                                label={t('user.add.email')}
                            />
                        </Box>
                        <Box gridColumn='span 4'>
                            <AppInput
                                readOnly={true}
                                name="birthDate"
                                register={register}
                                type='text'
                                startAdornment={<Event />}
                                label={t('user.add.birthDate')}
                            />
                        </Box>

                        <Box gridColumn='span 5'>
                            <AppInput
                                readOnly={true}
                                name="salaryBase"
                                register={register}
                                type='string'
                                startAdornment={<MonetizationOnIcon />}
                                label={t('user.add.salaryBase')}
                            />
                        </Box>

                        <Box gridColumn='span 3'>
                            <AppInput
                                readOnly={true}
                                name="cardFeature"
                                register={register}
                                type='string'
                                startAdornment={<CreditScoreIcon />}
                                label={t('user.add.cardEligible')}
                            />
                        </Box>


                        <Box gridColumn='span 2'>
                            <AppInput
                                readOnly={true}
                                name="validDocument"
                                register={register}
                                type='string'
                                startAdornment={<DoneIcon />}
                                label={t('user.add.validDocument')}
                            />
                        </Box>

                        <Box gridColumn='span 2'>
                            <AppInput
                                readOnly={true}
                                name="verifiedDocument"
                                register={register}
                                type='string'
                                startAdornment={<VerifiedIcon />}
                                label={t('user.add.verifiedDocument')}
                            />
                        </Box>

                        <Box gridColumn='span 8'>
                            <AppInput
                                readOnly={true}
                                name="neighborhood"
                                register={register}
                                type='string'
                                startAdornment={<HomeIcon />}
                                label={t('user.add.neighborhood')}
                            />
                        </Box>
                        <Box gridColumn='span 2'>
                            <AppInput
                                readOnly={true}
                                name="streetNumber"
                                register={register}
                                type='string'
                                label={t('user.add.streetNumber')}
                            />
                        </Box>
                        <Box gridColumn='span 2'>
                            <AppInput
                                readOnly={true}
                                name="state"
                                register={register}
                                type='string'
                                label={t('user.add.state')}
                            />
                        </Box>

                        <Box gridColumn='span 8'>
                            <AppInput
                                readOnly={true}
                                name="city"
                                register={register}
                                type='string'
                                startAdornment={<LocationCityIcon />}
                                label={t('user.add.city')}
                            />
                        </Box>
                        <Box gridColumn='span 4'>
                            <AppInput
                                readOnly={true}
                                name="postalCode"
                                register={register}
                                type='string'
                                startAdornment={<MarkAsUnreadIcon />}
                                label={t('user.add.postalCode')}
                            />
                        </Box>
                    </Box>
                </>
            </AppModal>
        </Box>
    )
}