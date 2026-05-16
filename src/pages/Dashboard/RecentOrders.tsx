import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Select,
  MenuItem, FormControl, InputLabel, InputAdornment, Container
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialOrders = [
  { id: 1, customer: 'John Doe', amount: 120.5, date: '2025-06-20', status: 'Paid' },
  { id: 2, customer: 'Jane Smith', amount: 75.0, date: '2025-06-19', status: 'Pending' },
  { id: 3, customer: 'Alice Johnson', amount: 180.75, date: '2025-06-18', status: 'Paid' },
  { id: 4, customer: 'Bob Brown', amount: 95.0, date: '2025-06-17', status: 'Pending' },
  { id: 5, customer: 'Chris Green', amount: 200.0, date: '2025-06-16', status: 'Paid' },
];

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [amountFilter, setAmountFilter] = useState('');
  const [amountOperator, setAmountOperator] = useState('>=');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [printButtonColor, setPrintButtonColor] = useState<'blue' | 'green'>('blue');
  const [pdfButtonColor, setPdfButtonColor] = useState<'blue' | 'green'>('blue');

  const filteredRows = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = Object.values(order).join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesAmount = amountFilter ? eval(`${order.amount} ${amountOperator} ${parseFloat(amountFilter) || 0}`) : true;
      return matchesSearch && matchesAmount;
    });
  }, [orders, search, amountFilter, amountOperator]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Recent Orders', 14, 10);
    autoTable(doc, {
      head: [['Order ID', 'Customer', 'Amount ($)', 'Date', 'Status']],
      body: filteredRows.map(row => [row.id, row.customer, row.amount, row.date, row.status]),
    });
    doc.save('recent_orders.pdf');
  };

  const handlePrint = () => {
    const html = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background:#eee;">
          <tr><th>Order ID</th><th>Customer</th><th>Amount ($)</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${filteredRows.map(r => `
            <tr>
              <td>${r.id}</td>
              <td>${r.customer}</td>
              <td>${r.amount}</td>
              <td>${r.date}</td>
              <td>${r.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
    const win = window.open('', '', 'width=900,height=700');
    win?.document.write(`<html><head><title>Print</title></head><body>${html}</body></html>`);
    win?.document.close();
    win?.print();
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 100 },
    { field: 'customer', headerName: 'Customer', flex: 1 },
    { field: 'amount', headerName: 'Amount ($)', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.value}
          size="small"
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
        >
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      )
    }
  ];

  return (
    <Paper 
      elevation={1}
      sx={{ 
        borderRadius: 2, 
        p: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
        <Box>
        <Typography 
          variant="h5" 
          mb={1} 
          align="left" 
          fontWeight={700}
          sx={{ color: 'text.primary' }}
        >
            Recent Orders
          </Typography>
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }} />
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="center" mb={3}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={paginationModel.pageSize}
              label="Rows per page"
              onChange={(e) => setPaginationModel(prev => ({ ...prev, pageSize: Number(e.target.value), page: 0 }))}
            >
              {[5, 10, 25, 50].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Total Amount</InputLabel>
            <Select
              value={amountOperator}
              label="Filter by Total Amount"
              onChange={(e) => setAmountOperator(e.target.value)}
            >
              <MenuItem value="<">Less than</MenuItem>
              <MenuItem value="<=">Less than or equal</MenuItem>
              <MenuItem value=">">Greater than</MenuItem>
              <MenuItem value=">=">Greater than or equal</MenuItem>
              <MenuItem value="==">Equal</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Amount"
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
            type="number"
            sx={{ minWidth: 100 }}
          />

          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          {/* Print Button with Color Selection */}
          <Box display="flex" alignItems="center" gap={1}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Print Color</InputLabel>
              <Select
                value={printButtonColor}
                label="Print Color"
                onChange={(e) => setPrintButtonColor(e.target.value as 'blue' | 'green')}
              >
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="green">Green</MenuItem>
              </Select>
            </FormControl>
            <button 
              style={{
                padding: '8px 16px',
                border: `2px solid ${printButtonColor === 'blue' ? '#3b82f6' : '#10b981'}`,
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: printButtonColor === 'blue' ? '#3b82f6' : '#10b981',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onClick={handlePrint}
            >
              <PrintIcon style={{ fontSize: '16px' }} />
              Print
            </button>
          </Box>

          {/* PDF Button with Color Selection */}
          <Box display="flex" alignItems="center" gap={1}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>PDF Color</InputLabel>
              <Select
                value={pdfButtonColor}
                label="PDF Color"
                onChange={(e) => setPdfButtonColor(e.target.value as 'blue' | 'green')}
              >
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="green">Green</MenuItem>
              </Select>
            </FormControl>
            <button 
              style={{
                padding: '8px 16px',
                border: `2px solid ${pdfButtonColor === 'blue' ? '#3b82f6' : '#10b981'}`,
                borderRadius: '6px',
                backgroundColor: pdfButtonColor === 'blue' ? '#3b82f6' : '#10b981',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onClick={handlePDF}
            >
              <PictureAsPdfIcon style={{ fontSize: '16px' }} />
              PDF
            </button>
          </Box>
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          onRowClick={(params) => setSelectedId(params.id as number)}
          getRowClassName={(params) => params.id === selectedId ? 'selected-row' : ''}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': { 
              backgroundColor: 'action.hover' 
            },
            '& .selected-row': { 
              backgroundColor: 'action.selected !important' 
            },
            '& .MuiDataGrid-footerContainer': { 
              borderTop: '1px solid',
              borderColor: 'divider'
            },
            '& .MuiDataGrid-columnHeaders': { 
              backgroundColor: 'action.hover',
              borderColor: 'divider'
            },
            '& .MuiDataGrid-cell': {
              borderColor: 'divider'
            },
            mt: 2,
          }}
        />
    </Paper>
  );
};

export default RecentOrders;
