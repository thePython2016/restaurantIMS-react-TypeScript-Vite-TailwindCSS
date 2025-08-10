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
import PeopleIcon from '@mui/icons-material/People';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample sales by customer data
const sampleCustomerSales = [
  { id: 1, customerName: 'John Doe', totalOrders: 3, totalSpent: 120000 },
  { id: 2, customerName: 'Jane Smith', totalOrders: 5, totalSpent: 200000 },
  { id: 3, customerName: 'Mike Johnson', totalOrders: 2, totalSpent: 65000 },
  { id: 4, customerName: 'Emily Davis', totalOrders: 1, totalSpent: 30000 },
  { id: 5, customerName: 'David Lee', totalOrders: 4, totalSpent: 145000 },
];

const columns: GridColDef[] = [
  { field: 'customerName', headerName: 'Customer Name', flex: 1 },
  { field: 'totalOrders', headerName: 'Total Orders', type: 'number', flex: 1 },
  { field: 'totalSpent', headerName: 'Total Spent (Tsh)', type: 'number', flex: 1 },
];

const SalesCustomer: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [orderFilterType, setOrderFilterType] = useState('All');
  const [orderFilterValue, setOrderFilterValue] = useState('');
  const [spentFilterType, setSpentFilterType] = useState('All');
  const [spentFilterValue, setSpentFilterValue] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rows, setRows] = useState<any[]>(sampleCustomerSales);
  const [filteredSortedRows, setFilteredSortedRows] = useState<any[]>([]);
  const [pagedRows, setPagedRows] = useState<any[]>([]);
  const dataGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dataGridRef.current && !dataGridRef.current.contains(event.target as Node)) {
        setSelectedId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRows = useMemo(() => {
    let filtered = rows.filter((row) =>
      row.customerName.toLowerCase().includes(search.toLowerCase())
    );

    if (orderFilterType !== 'All' && orderFilterValue) {
      const value = Number(orderFilterValue);
      filtered = filtered.filter((row) => {
        switch (orderFilterType) {
          case 'Less Than': return row.totalOrders < value;
          case 'Greater Than': return row.totalOrders > value;
          case 'Equal To': return row.totalOrders === value;
          default: return true;
        }
      });
    }

    if (spentFilterType !== 'All' && spentFilterValue) {
      const value = Number(spentFilterValue);
      filtered = filtered.filter((row) => {
        switch (spentFilterType) {
          case 'Less Than': return row.totalSpent < value;
          case 'Greater Than': return row.totalSpent > value;
          case 'Equal To': return row.totalSpent === value;
          default: return true;
        }
      });
    }

    return filtered;
  }, [rows, search, orderFilterType, orderFilterValue, spentFilterType, spentFilterValue]);

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

  useEffect(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    setPagedRows(filteredSortedRows.slice(start, end));
  }, [filteredSortedRows, paginationModel]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Sales by Customer Report', 14, 10);
    autoTable(doc, {
      head: [['Customer Name', 'Total Orders', 'Total Spent (Tsh)']],
      body: filteredSortedRows.map((row) => [
        row.customerName,
        row.totalOrders.toString(),
        row.totalSpent.toLocaleString(),
      ]),
    });
    doc.save('sales_by_customer_report.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr>
            <th>Customer Name</th><th>Total Orders</th><th>Total Spent (Tsh)</th>
          </tr>
        </thead>
        <tbody>
          ${filteredSortedRows
            .map(
              (row) => `
            <tr>
              <td>${row.customerName}</td>
              <td>${row.totalOrders}</td>
              <td>${row.totalSpent.toLocaleString()}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>`;

    const printWin = window.open('', '', 'width=900,height=700');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head><title>Print Sales by Customer</title></head>
        <body>
          <h2 style="text-align:left;">Sales by Customer Report</h2>
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
      <Paper elevation={3} className="w-full max-w-7xl mx-auto p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="1px solid #ccc" pb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <PeopleIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h5" fontWeight="bold">
              Sales by Customer Report
            </Typography>
          </Box>
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
            label="Search customer"
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
            <InputLabel>Order Filter</InputLabel>
            <Select
              value={orderFilterType}
              label="Order Filter"
              onChange={(e) => setOrderFilterType(e.target.value as any)}
            >
              {['All', 'Less Than', 'Greater Than', 'Equal To'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Orders"
            type="number"
            value={orderFilterValue}
            onChange={(e) => setOrderFilterValue(e.target.value)}
            sx={{ width: 120 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Spent Filter</InputLabel>
            <Select
              value={spentFilterType}
              label="Spent Filter"
              onChange={(e) => setSpentFilterType(e.target.value as any)}
            >
              {['All', 'Less Than', 'Greater Than', 'Equal To'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Amount"
            type="number"
            value={spentFilterValue}
            onChange={(e) => setSpentFilterValue(e.target.value)}
            sx={{ width: 120 }}
          />

          {selectedId !== null && (
            <>
              <IconButton color="primary" onClick={() => alert(`Edit customer ID ${selectedId}`)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  if (window.confirm('Delete this customer?')) {
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
            '& .MuiDataGrid-columnHeaders': { 
              borderBottom: '2px solid #e0e0e0',
              backgroundColor: '#f8f9fa'
            },
            '& .MuiDataGrid-columnHeader': {
              borderRight: '1px solid #e0e0e0',
              '&:last-child': {
                borderRight: 'none'
              }
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #f0f0f0',
              '&:last-child': {
                borderRight: 'none'
              }
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default SalesCustomer;
