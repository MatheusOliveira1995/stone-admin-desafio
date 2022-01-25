import React from 'react'
import moment from 'moment';
import { Box, Toolbar } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import AppClock from 'src/components/AppClock';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'src/app/hooks';

import './styles.css';

export default function Dashboard() {
    const { t } = useTranslation()
    const date = moment()
    const dayOfWeek = date.day()
    const dayOfMonth = date.date()
    const month = date.month()
    const year = date.year()
    const hour = date.hour()
    const analyst = useAppSelector((state) => state.analyst)

    return (
        <Toolbar className='dashboard--toolbar'>
            <Box sx={{ flexGrow: 1, display: 'flex' }} component='div'>
                { hour < 12 ? <WbSunnyIcon /> : hour < 18 ? <Brightness6Icon /> : <DarkModeIcon /> }
                <Box component='span' sx={{ marginLeft: '10px', marginRight: '5px' }}>
                    {hour < 12 ? t('dashboard.morning') : hour < 18 ? t('dashboard.afternoon') : t('dashboard.night')}
                </Box>
                <Box component='strong'>
                    { analyst.userName ? analyst?.userName.split(' ').shift() +'!' : ''}
                </Box>
            </Box>

            <Box component='div' sx={{ display: 'flex' }}>
                <Box  component='strong' sx={{marginRight: '5px'}}>
                    {t(`dashboard.daysOfWeek.${dayOfWeek}`)} ·
                </Box>
                { dayOfMonth + ' ' + t(`dashboard.of`) + ' ' + t(`dashboard.months.${month}`) + ' ' + year + ' - '}
                <Box component='strong' sx={{marginLeft: '5px'}}>
                    <AppClock />
                </Box>
            </Box>
        </Toolbar>
    )
}