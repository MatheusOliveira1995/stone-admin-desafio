import React from 'react'
import { Paper, Box, Typography, Button } from '@mui/material';
import AppInput from 'src/components/AppInput';

import { SubmitHandler, useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';

import './styles.css'

interface LoginForm{
    email: string,
    password: string
}

export default function Signin() {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

    /**
     * 
     * @param data LoginForm
     */
    const submit: SubmitHandler<LoginForm> = (data) => {

    }
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
                    onSubmit={handleSubmit(submit)}
                >
                    <Box className='login--input'>
                        <AppInput
                            register={ register }
                            error={ errors.email }
                            type='email'
                            label={t('auth.inputs.email')}
                            placeholder={t('auth.inputs.emailPlaceholder')}
                            name='email'
                        />
                    </Box>
                    <Box className='login--input'>
                        <AppInput
                            register={ register }
                            error={ errors.password }
                            validation={{
                                required: t('auth.validation.password')
                            }}
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