import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample sales data - replace with your actual data
const sampleSales = [
  { id: 1, menuItem: 'Chicken Burger', quantity: 10, amount: 60000 },
  { id: 2, menuItem: 'Mango Juice', quantity: 15, amount: 45000 },
  { id: 3, menuItem: 'Veggie Pizza', quantity: 7, amount: 56000 },
  { id: 4, menuItem: 'Coffee', quantity: 20, amount: 40000 },
  { id: 5, menuItem: 'Fruit Salad', quantity: 5, amount: 22500 },
];

const columns: GridColDef[] = [
  { field: 'menuItem', headerName: 'Menu Item', flex: 1 },
  { field: 'quantity', headerName: 'Total Quantity', type: 'number', flex: 1 },
  { field: 'amount', headerName: 'Total Amount (Tsh)', type: 'number', flex: 1 },
];

const SalesItem: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [quantityFilterType, setQuantityFilterType] = useState('All');
  const [quantityFilterValue, setQuantityFilterValue] = useState('');
  const [amountFilterType, setAmountFilterType] = useState('All');
  const [amountFilterValue, setAmountFilterValue] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rows, setRows] = useState<any[]>(sampleSales);
  const [filteredSortedRows, setFilteredSortedRows] = useState<any[]>([]);
  const [pagedRows, setPagedRows] = useState<any[]>([]);
  const dataGridRef = useRef<HTMLDivElement>(null);

  // Click outside handler to deselect rows
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dataGridRef.current && !dataGridRef.current.contains(event.target as Node)) {
        setSelectedId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort logic
  const filteredRows = useMemo(() => {
    let filtered = rows.filter((row) =>
      row.menuItem.toLowerCase().includes(search.toLowerCase())
    );

    // Quantity filter
    if (quantityFilterType !== 'All' && quantityFilterValue) {
      const value = Number(quantityFilterValue);
      filtered = filtered.filter((row) => {
        switch (quantityFilterType) {
          case 'Less Than':
            return row.quantity < value;
          case 'Greater Than':
            return row.quantity > value;
          case 'Equal To':
            return row.quantity === value;
          default:
            return true;
        }
      });
    }

    // Amount filter
    if (amountFilterType !== 'All' && amountFilterValue) {
      const value = Number(amountFilterValue);
      filtered = filtered.filter((row) => {
        switch (amountFilterType) {
          case 'Less Than':
            return row.amount < value;
          case 'Greater Than':
            return row.amount > value;
          case 'Equal To':
            return row.amount === value;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [rows, search, quantityFilterType, quantityFilterValue, amountFilterType, amountFilterValue]);

  // Sort logic
  useEffect(() => {
    let sorted = [...filteredRows];

    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sorted = sorted.sort((a, b) => {
        if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
        return 0;
      });
    }

    setFilteredSortedRows(sorted);
  }, [filteredRows, sortModel]);

  // Pagination logic
  useEffect(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    setPagedRows(filteredSortedRows.slice(start, end));
  }, [filteredSortedRows, paginationModel]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Sales by Item Report', 14, 10);
    autoTable(doc, {
      head: [['Menu Item', 'Total Quantity', 'Total Amount (Tsh)']],
      body: filteredSortedRows.map((row) => [
        row.menuItem,
        row.quantity.toString(),
        row.amount.toLocaleString(),
      ]),
    });
    doc.save('sales_by_item_report.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr>
            <th>Menu Item</th><th>Total Quantity</th><th>Total Amount (Tsh)</th>
          </tr>
        </thead>
        <tbody>
          ${filteredSortedRows
            .map(
              (row) => `
            <tr>
              <td>${row.menuItem}</td>
              <td>${row.quantity}</td>
              <td>${row.amount.toLocaleString()}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>`;

    const printWin = window.open('', '', 'width=900,height=700');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head><title>Print Sales by Item</title></head>
        <body>
          <h2 style="text-align:left;">Sales by Item Report</h2>
          ${tableHTML}
        </body>
      </html>`);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]}`,
        borderRadius: 3,
        p: 6,
        mx: 'auto'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="1px solid #ccc" pb={1}>
          <Typography variant="h5" fontWeight="bold">Sales by Item</Typography>
        </Box>

        {/* Controls Row */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
            alignItems: 'center',
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={paginationModel.pageSize}
              label="Rows per page"
              onChange={(e) =>
                setPaginationModel((prev) => ({
                  ...prev,
                  page: 0,
                  pageSize: Number(e.target.value),
                }))
              }
            >
              {[5, 10, 25, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Search menu item"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Quantity Filter</InputLabel>
            <Select
              value={quantityFilterType}
              label="Quantity Filter"
              onChange={(e) => setQuantityFilterType(e.target.value as any)}
            >
              {['All', 'Less Than', 'Greater Than', 'Equal To'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Quantity"
            type="number"
            value={quantityFilterValue}
            onChange={(e) => setQuantityFilterValue(e.target.value)}
            sx={{ width: 120 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Amount Filter</InputLabel>
            <Select
              value={amountFilterType}
              label="Amount Filter"
              onChange={(e) => setAmountFilterType(e.target.value as any)}
            >
              {['All', 'Less Than', 'Greater Than', 'Equal To'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Amount"
            type="number"
            value={amountFilterValue}
            onChange={(e) => setAmountFilterValue(e.target.value)}
            sx={{ width: 120 }}
          />

          {selectedId !== null && (
            <>
              <IconButton color="primary" onClick={() => alert(`Edit item ID ${selectedId}`)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  if (window.confirm('Delete this item?')) {
                    setRows((prev) => prev.filter((r) => r.id !== selectedId));
                    setSelectedId(null);
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}

          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} size="small">
            Print
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePDF}
            size="small"
          >
            PDF
          </Button>
        </Box>

        {/* DataGrid Table */}
        <DataGrid
          ref={dataGridRef}
          rows={pagedRows}
          columns={columns}
          rowCount={filteredSortedRows.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onRowClick={(params) => setSelectedId(params.id as number)}
          getRowClassName={(params) => (params.id === selectedId ? 'selected-row' : '')}
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 10, 25, 50]}
          sx={{
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .selected-row': { backgroundColor: '#d1eaff !important' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #ccc' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default SalesItem;
