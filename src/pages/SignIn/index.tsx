import React from 'react'
import { Paper, Box, Typography, Button } from '@mui/material';
import AppInput from 'src/components/AppInput';

import { useTranslation } from 'react-i18next';

import './styles.css'

export default function Signin() {
    const { t } = useTranslation()
    return (
        <Box component='div' className='login--background'>
            <Paper
                className='login-form--container'
                elevation={3}
            >
                <Typography
                    component='div'
                    variant='h2'
                    sx={{
                        marginTop: '30px',
                    }}
                >
                    {t('auth.title')}
                </Typography>
                <Box
                    component='form'
                    method='POST'
                    className='login--form'
                >
                    <Box className='login--input'>
                        <AppInput
                            type='email'
                            label={t('auth.inputs.email')}
                            placeholder={t('auth.inputs.emailPlaceholder')}
                            name='email'
                        />
                    </Box>
                    <Box className='login--input'>
                        <AppInput
                            type='password'
                            label={t('auth.inputs.password')}
                            placeholder={t('auth.inputs.passwordPlaceholder')}
                            name='password'
                        />
                    </Box>

                    <Box component='div' sx={{marginTop: '30px'}}>
                        <Button type='submit' variant='contained' size='large' className='login-form--actions'>
                            Login
                        </Button>
                    </Box>

                </Box>
            </Paper>

        </Box>
    )
}