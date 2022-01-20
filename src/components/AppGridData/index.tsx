import React from 'react';
import {
    DataGrid,
    GridColDef,
    GridInputSelectionModel,
    GridSelectionModel,
    GridSortModel,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarFilterButton,
    useGridApiContext,
    useGridSelector,
    gridPageCountSelector,
    gridPageSelector,
    GridCellParams,
} from '@mui/x-data-grid';
import { Box, Pagination  } from '@mui/material';

import { useTranslation } from 'react-i18next';

interface AppDataGridType {
    columns: GridColDef[]
    rows: any[]
    autoPageSize?: boolean
    rowsPerPage: number[]
    checkboxSelection?: boolean
    sortModel?: GridSortModel
    handleSortModelChange?: (model: GridSortModel) => void
    hideFooterSelectedRowsCount?: boolean
    handleSelectionModelChange?: (selectionModel: GridSelectionModel) => void
    selectionModel?: GridInputSelectionModel
    noRowsOverlayMessage: string
    handleCellEditCommit?: () => void
    getCellClassName?: (params: GridCellParams<any, any, any>) => string
}

export default function AppGridData({
    columns,
    rows,
    autoPageSize = false,
    rowsPerPage,
    checkboxSelection = false,
    sortModel,
    handleSortModelChange,
    hideFooterSelectedRowsCount = false,
    selectionModel,
    handleSelectionModelChange,
    noRowsOverlayMessage,
    getCellClassName
}: AppDataGridType) {
    const { t } = useTranslation();
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
    /**
     * @return JSX.Element
     */
    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        )
    }
    /**
     */
    const CustomPagination = () => {
        const apiRef = useGridApiContext();
        const page = useGridSelector(apiRef, gridPageSelector);
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);
      
        return (
          <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
          />
        );
      }
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            autoPageSize={autoPageSize}
            rowsPerPageOptions={rowsPerPage}
            checkboxSelection={checkboxSelection}
            sortModel={sortModel}
            getCellClassName={getCellClassName}
            components={{
                NoRowsOverlay: CustomNoRowsOverlay,
                Toolbar: CustomToolbar,
                Pagination: CustomPagination
            }}
            localeText={{
                columnsPanelHideAllButton: t('home.dataGrid.columnsPanelHideAllButton'),
                columnsPanelShowAllButton: t('home.dataGrid.columnsPanelShowAllButton'),
                columnsPanelTextFieldLabel: t('home.dataGrid.columnsPanelTextFieldLabel'),
                columnsPanelTextFieldPlaceholder: t('home.dataGrid.columnsPanelTextFieldPlaceholder'),
                filterPanelInputLabel: t('home.dataGrid.filterPanelInputLabel'),
                filterPanelColumns: t('home.dataGrid.filterPanelColumns'),
                filterPanelOperators: t('home.dataGrid.filterPanelOperators'),
                filterPanelInputPlaceholder: t('home.dataGrid.filterPanelInputPlaceholder'),
                toolbarColumns: t('home.dataGrid.toolbarColumns'),
                toolbarFilters: t('home.dataGrid.toolbarFilters'),
                filterOperatorContains: t('home.dataGrid.filterOperatorContains'),
                filterOperatorEquals: t('home.dataGrid.filterOperatorEquals'),
                filterOperatorStartsWith: t('home.dataGrid.filterOperatorStartsWith'),
                filterOperatorEndsWith: t('home.dataGrid.filterOperatorEndsWith'),
                filterOperatorIsEmpty: t('home.dataGrid.filterOperatorIsEmpty'),
                filterOperatorIsNotEmpty: t('home.dataGrid.filterOperatorIsNotEmpty'),
                columnMenuUnsort: t('home.dataGrid.columnMenuUnsort'),
                columnMenuSortAsc: t('home.dataGrid.columnMenuSortAsc'),
                columnMenuSortDesc: t('home.dataGrid.columnMenuSortDesc'),
                columnMenuFilter: t('home.dataGrid.columnMenuFilter'),
                columnMenuHideColumn: t('home.dataGrid.columnMenuHideColumn'),
                columnMenuShowColumns: t('home.dataGrid.columnMenuShowColumns'),
            }}
            onSortModelChange={handleSortModelChange}
            selectionModel={selectionModel}
            hideFooterSelectedRowCount={hideFooterSelectedRowsCount}
            onSelectionModelChange={handleSelectionModelChange}
        />
    )
}