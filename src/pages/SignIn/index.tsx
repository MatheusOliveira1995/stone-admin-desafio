import React from 'react'
import { Paper, Box, Typography, Button } from '@mui/material';
import AppInput from 'src/components/AppInput';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { setAnalyst } from 'src/app/store/slices/analyst';

import { error } from 'src/app/store/slices/toast';
import { login } from 'src/service/api/auth';

import './styles.css'
import { stringify } from 'querystring';

interface LoginForm{
    email: string,
    password: string
}

type Session = {
    id: string | number;
    userId: string | number;
    email: string;
    password?: string | undefined
}

export default function Signin() {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
    const dispatch = useAppDispatch()

    /**
     * @param data LoginForm
     */
    const submit: SubmitHandler<LoginForm> = async (data) => {
        try {
            const analyst = await login(data.email, data.password)
            if(!analyst){
                dispatch(error(t('auth.loginError')))
                return
            }
            dispatch(setAnalyst(analyst))

        } catch (e) {
            dispatch(error(t('auth.error')))
        }
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
                            validation={{
                                required: t('auth.validation.email'),
                                pattern: {
                                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                    message: t('auth.validation.invalidEmail')
                                },
                            }}
                            error={ errors.email }
                            type='text'
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