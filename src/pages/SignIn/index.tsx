import React from 'react'
import { Paper, Box, Typography, Button } from '@mui/material';
import AppInput from 'src/components/AppInput';
import './styles.css'

export default function Signin() {
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
                    Login
                </Typography>
                <Box
                    component='form'
                    method='POST'
                    className='login--form'
                >
                    <Box className='login--input'>
                        <AppInput
                            type='email'
                            label='Email'
                            name='email'
                        />
                    </Box>
                    <Box className='login--input'>
                        <AppInput
                            type='password'
                            label='Senha'
                            name='password'
                        />
                    </Box>

                    <Box component='div' sx={{marginTop: '30px'}}>
                        <Button variant='contained' size='large' className='login-form--actions'>
                            Login
                        </Button>
                    </Box>

                </Box>
            </Paper>

        </Box>
    )
}