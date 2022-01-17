import React , { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';

interface Props {
    top?: number,
    left?: number
    right?: number,
    bottom?: number,
    children: ReactNode,
    color?: "primary" | "secondary" | "inherit" | "default"
}   

export default function AppFloatButton({top, right, bottom, left, color = "primary", children}: Props) {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 }, position:'absolute', top:{top}, right:{right}, bottom:{bottom}, left:{left}}}>
      <Fab size="medium" color={color} aria-label="add">
        {children}
      </Fab>
    </Box>
  );
}