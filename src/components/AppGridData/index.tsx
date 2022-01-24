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
                columnsPanelHideAllButton: t('main.dataGrid.columnsPanelHideAllButton'),
                columnsPanelShowAllButton: t('main.dataGrid.columnsPanelShowAllButton'),
                columnsPanelTextFieldLabel: t('main.dataGrid.columnsPanelTextFieldLabel'),
                columnsPanelTextFieldPlaceholder: t('main.dataGrid.columnsPanelTextFieldPlaceholder'),
                filterPanelInputLabel: t('main.dataGrid.filterPanelInputLabel'),
                filterPanelColumns: t('main.dataGrid.filterPanelColumns'),
                filterPanelOperators: t('main.dataGrid.filterPanelOperators'),
                filterPanelInputPlaceholder: t('main.dataGrid.filterPanelInputPlaceholder'),
                toolbarColumns: t('main.dataGrid.toolbarColumns'),
                toolbarFilters: t('main.dataGrid.toolbarFilters'),
                filterOperatorContains: t('main.dataGrid.filterOperatorContains'),
                filterOperatorEquals: t('main.dataGrid.filterOperatorEquals'),
                filterOperatorStartsWith: t('main.dataGrid.filterOperatorStartsWith'),
                filterOperatorEndsWith: t('main.dataGrid.filterOperatorEndsWith'),
                filterOperatorIsEmpty: t('main.dataGrid.filterOperatorIsEmpty'),
                filterOperatorIsNotEmpty: t('main.dataGrid.filterOperatorIsNotEmpty'),
                columnMenuUnsort: t('main.dataGrid.columnMenuUnsort'),
                columnMenuSortAsc: t('main.dataGrid.columnMenuSortAsc'),
                columnMenuSortDesc: t('main.dataGrid.columnMenuSortDesc'),
                columnMenuFilter: t('main.dataGrid.columnMenuFilter'),
                columnMenuHideColumn: t('main.dataGrid.columnMenuHideColumn'),
                columnMenuShowColumns: t('main.dataGrid.columnMenuShowColumns'),
            }}
            onSortModelChange={handleSortModelChange}
            selectionModel={selectionModel}
            hideFooterSelectedRowCount={hideFooterSelectedRowsCount}
            onSelectionModelChange={handleSelectionModelChange}
        />
    )
}