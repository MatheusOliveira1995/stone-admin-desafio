import React, { ReactNode } from "react";
import {InputAdornment, FormHelperText, FormControl, OutlinedInput, InputLabel  } from '@mui/material'
import { FieldError, UseFormRegister } from "react-hook-form";


type Props = {
  id?: string
  type: string,
  name: string,
  label: string,
  endAdornment?: ReactNode,
  startAdornment?: ReactNode,
  helperText?: string,
  handleChange?: (value: string) => void
  required?: boolean
  value?: any
  error?: FieldError
  readOnly?: boolean
  register?: UseFormRegister<any>
  validation?: any
}

export default function AppInput({ id, name, type, label, endAdornment, register , validation, startAdornment, readOnly = false, helperText, handleChange, value, required = false, error } : Props) {
  return (
    <FormControl required={required} error={!!error} fullWidth variant="outlined">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        { ...( register && register(name, validation)) }
        id={id}
        name={name}
        readOnly={readOnly}
        value={value}
        type={type}
        onChange={(event) =>{
          return handleChange ? handleChange(event.target.value) : undefined
        }}
        startAdornment= {
          <InputAdornment position="start">
            {startAdornment}
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            {endAdornment}
          </InputAdornment>
        }
        label={label}
      />
      <FormHelperText id="outlined-weight-helper-text">{error ? error.message : ''}</FormHelperText>
    </FormControl>
  )
}