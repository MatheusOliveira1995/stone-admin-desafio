import React, { ChangeEvent, ReactNode } from "react";
import {InputAdornment, FormHelperText, FormControl, OutlinedInput, InputLabel  } from '@mui/material'

type Props = {
  type: string,
  label: string,
  endAdornment?: ReactNode,
  helperText?: string,
  handleChange: (value: string) => void
  required?: boolean
  value?: any
}

export default function AppInput({ type, label, endAdornment, helperText, handleChange, value, required = false } : Props) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="outlined-adornment">{label}</InputLabel>
      <OutlinedInput
        required={required}
        id="outlined-adornment"
        value={value}
        type={type}
        onChange={(event) => handleChange(event.target.value)}
        endAdornment={
          <InputAdornment position="end">
            {endAdornment}
          </InputAdornment>
        }
        label={label}
      />
      <FormHelperText id="outlined-weight-helper-text">{helperText}</FormHelperText>
    </FormControl>
  )
}