import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';

interface TableColumn {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  valueFormatter?: (params: { value: any }) => string;
}

interface TableWithCheckboxesProps {
  rows: any[];
  columns: TableColumn[];
  onRowClick?: (id: string) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId: (row: any) => string;
  searchTerm?: string;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showPagination?: boolean;
}

export default function TableWithCheckboxes({
  rows,
  columns,
  onRowClick,
  onSelectionChange,
  getRowId,
  searchTerm = '',
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  showPagination = false,
}: TableWithCheckboxesProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [clickedRows, setClickedRows] = useState<string[]>([]);

  const handleRowClick = (id: string) => {
    setClickedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
    onRowClick?.(id);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map(row => getRowId(row));
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1;

  // Filter rows based on search term
  const filteredRows = rows.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentPageRows = showPagination 
    ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredRows;

  const isAllSelected = currentPageRows.length > 0 && currentPageRows.every(row => isSelected(getRowId(row)));
  const isSomeSelected = currentPageRows.some(row => isSelected(getRowId(row)));

  return (
    <TableContainer component={Paper} sx={{ height: 'auto', overflow: 'visible' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={isSomeSelected && !isAllSelected}
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={column.field} sx={{ minWidth: column.minWidth }}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageRows.length > 0 ? (
            currentPageRows.map((row) => {
              const rowId = getRowId(row);
              const isItemSelected = isSelected(rowId);
              const isClicked = clickedRows.includes(rowId);
              
              return (
                <TableRow
                  hover
                  key={rowId}
                  selected={isItemSelected}
                  onClick={() => handleRowClick(rowId)}
                  sx={{
                    cursor: 'pointer',
                    '&.Mui-selected': {
                      backgroundColor: '#1976d2 !important',
                      color: 'white !important',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: '#1565c0 !important',
                      color: 'white !important',
                    },
                    '&.Mui-selected .MuiTableCell-root': {
                      color: 'white !important',
                    },
                                         // Highlight only selected rows with same color as StaffList
                     backgroundColor: isItemSelected ? '#d1eaff !important' : 'inherit',
                     '&:hover': {
                       backgroundColor: isItemSelected ? '#b3d9ff !important' : 'rgba(0, 0, 0, 0.04) !important',
                     },
                     border: isItemSelected ? '2px solid #1976d2' : '1px solid transparent',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={() => handleSelectRow(rowId)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {column.valueFormatter 
                        ? column.valueFormatter({ value: row[column.field] })
                        : row[column.field]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 4 }}>
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
