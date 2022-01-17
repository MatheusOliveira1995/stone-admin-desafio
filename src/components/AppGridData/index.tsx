import React from 'react';
import { DataGrid, GridColDef, GridInputSelectionModel, GridSelectionModel, GridSlotsComponent, GridSortModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';

interface AppDataGridType {
    columns: GridColDef[]
    rows: any[]
    autoPageSize?: boolean
    rowsPerPage: number[]
    checkboxSelection?: boolean
    sortModel?: GridSortModel
    components?: Partial<GridSlotsComponent>
    handleSortModelChange?: (model: GridSortModel) => void
    hideFooterSelectedRowsCount?: boolean
    handleSelectionModelChange?: (selectionModel: GridSelectionModel) => void
    selectionModel?: GridInputSelectionModel,
    noRowsOverlayMessage: string
}

export default function AppGridData({
    columns,
    rows,
    autoPageSize = false,
    rowsPerPage,
    checkboxSelection = false,
    sortModel,
    components,
    handleSortModelChange,
    hideFooterSelectedRowsCount = false,
    selectionModel,
    handleSelectionModelChange,
    noRowsOverlayMessage
}: AppDataGridType) {

  /**
   * @returns JSX.Element
   */
    const CustomNoRowsOverlay = () => {
        return (
            <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <div>{noRowsOverlayMessage}</div>
            </Box>

        )
    }

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            autoPageSize={autoPageSize}
            rowsPerPageOptions={rowsPerPage}
            checkboxSelection={checkboxSelection}
            sortModel={sortModel}
            components={{...components , NoRowsOverlay: CustomNoRowsOverlay}}
            onSortModelChange={handleSortModelChange}
            selectionModel={selectionModel}
            hideFooterSelectedRowCount={hideFooterSelectedRowsCount}
            onSelectionModelChange={handleSelectionModelChange}
        />
    )
}