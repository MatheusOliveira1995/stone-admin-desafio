import React, { ReactNode } from 'react';
import Fab from '@mui/material/Fab';

interface Props {
    top?: number,
    left?: number
    right?: number,
    bottom?: number,
    children: ReactNode,
    color?: "primary" | "secondary" | "inherit" | "default"
}

export default function AppFloatButton({ top, right, bottom, left, color = "primary", children }: Props) {
    return (
        <Fab size="medium" color={color} aria-label="add">
            {children}
        </Fab>
    );
}