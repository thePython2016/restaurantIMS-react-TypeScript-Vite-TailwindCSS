import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Checkbox,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import Container from '@mui/material/Container';
// import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
// import { useNavigate } from 'react-router-dom';

const generateOrderData = (count: number) => {
  const customers = ['Anna', 'Mark', 'Liam', 'Sofia', 'James'];
  const menuItems = ['Chicken Burger', 'Mango Juice', 'Veggie Pizza', 'Coffee', 'Fruit Salad'];

  const data = [];
  for (let i = 1; i <= count; i++) {
    const quantity = (i % 5) + 1;
    const item = menuItems[i % menuItems.length];
    const amount = quantity * (1000 + (i % 10) * 500);
    data.push({
      id: i,
      customerName: `${customers[i % customers.length]} ${i}`,
      menuItem: item,
      quantity,
      amount,
      notes: i % 2 === 0 ? 'No onions' : 'Extra spicy',
      createdAt: dayjs().subtract(i % 30, 'day').toISOString(),
    });
  }
  return data;
};

const columnsBase: GridColDef[] = [
  { field: 'customerName', headerName: 'Customer Name', flex: 1 },
  { field: 'menuItem', headerName: 'Menu Item', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', flex: 1, type: 'number' },
  { field: 'amount', headerName: 'Amount (Tsh)', flex: 1, type: 'number' },
  { field: 'notes', headerName: 'Notes', flex: 1 },
];

const OrderList: React.FC = () => {
  const allOrderData = React.useMemo(() => generateOrderData(300), []);
  // const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [search, setSearch] = useState('');
  // const [pageRows, setPageRows] = useState<typeof allOrderData>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [amountOperator, setAmountOperator] = useState('>=');
  const [amountFilter, setAmountFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rows, setRows] = useState<typeof allOrderData>(allOrderData);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const columns: GridColDef[] = [
    {
      field: 'checkbox',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderHeader: () => (
        <Checkbox
          color="primary"
          indeterminate={selectedRows.length > 0 && selectedRows.length < filteredRows.length}
          checked={filteredRows.length > 0 && selectedRows.length === filteredRows.length}
          onChange={(e) => handleSelectAll(e as any)}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          color="primary"
          checked={isSelected(params.row.id as number)}
          onChange={() => handleSelectRow(params.row.id as number)}
        />
      ),
    },
    ...columnsBase,
  ];

  const filteredRows = React.useMemo(() => {
    return rows.filter(row => {
      const matchesSearch = Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesAmount = amountFilter ? eval(`${row.amount} ${amountOperator} ${parseFloat(amountFilter) || 0}`) : true;
      const rowDate = row.createdAt ? dayjs(row.createdAt) : null;
      const matchesStart = startDate && rowDate ? rowDate.isAfter(startDate.startOf('day')) || rowDate.isSame(startDate.startOf('day')) : true;
      const matchesEnd = endDate && rowDate ? rowDate.isBefore(endDate.endOf('day')) || rowDate.isSame(endDate.endOf('day')) : true;
      return matchesSearch && matchesAmount && matchesStart && matchesEnd;
    });
  }, [rows, search, amountFilter, amountOperator, startDate, endDate]);

  // Removed manual pageRows slicing; DataGrid handles pagination on filteredRows

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map(row => row.id as number);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: number[] = [];

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
  };

  const isSelected = (id: number) => selectedRows.indexOf(id) !== -1;

  const handleRefresh = () => {
    setRows(generateOrderData(300));
    setSelectedRows([]);
    setSelectedRowId(null);
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Order List', 14, 10);
    autoTable(doc, {
      head: [['Customer Name', 'Menu Item', 'Quantity', 'Amount', 'Notes']],
      body: filteredRows.map((row) => [
        row.customerName,
        row.menuItem,
        row.quantity,
        row.amount,
        row.notes,
      ]),
    });
    doc.save('order_list.pdf');
  };

  /* const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr>
            <th>Customer Name</th><th>Menu Item</th><th>Quantity</th><th>Amount</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${pageRows
            .map(
              (row) => `
            <tr>
              <td>${row.customerName}</td>
              <td>${row.menuItem}</td>
              <td>${row.quantity}</td>
              <td>${row.amount}</td>
              <td>${row.notes}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
    const printWin = window.open('', '', 'width=900,height=700');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head><title>Print Order List</title></head>
        <body>
          <h2 style="text-align:left;">Order List</h2>
          ${tableHTML}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  }; */

  // const rowHeight = 52;
  // const headerHeight = 56;
  // const footerHeight = 56;
  // const maxHeight = 600;
  // const calculatedHeight = Math.min(
  //   headerHeight + pageRows.length * rowHeight + footerHeight,
  //   maxHeight
  // );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h5" align="left" fontWeight={700} sx={{ color: 'white' }}>
              Order List
            </Typography>
            </Box>
            <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              mb: 2,
              justifyContent: 'space-between',
            }}
          >
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

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', ml: 'auto' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="From" value={startDate} onChange={(v) => setStartDate(v)} slotProps={{ textField: { size: 'small', sx: { width: 140 } } }} />
                <DatePicker label="To" value={endDate} onChange={(v) => setEndDate(v)} slotProps={{ textField: { size: 'small', sx: { width: 140 } } }} />
              </LocalizationProvider>
            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Amount</InputLabel>
              <Select
                value={amountOperator}
                  label="Amount"
                onChange={(e) => setAmountOperator(e.target.value)}
              >
                  <MenuItem value="">No Filter</MenuItem>
                  <MenuItem value=">">Greater Than</MenuItem>
                  <MenuItem value="<">Less Than</MenuItem>
                  <MenuItem value=">=">Greater or Equal</MenuItem>
                  <MenuItem value="<=">Less or Equal</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Amount"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              type="number"
                sx={{ width: 100 }}
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
                sx={{ width: { xs: 150, sm: 200 } }}
            />

              <Tooltip title="Refresh Data">
                <IconButton 
                  color="primary" 
                  onClick={handleRefresh} 
                  size="small"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handlePDF} color="primary">PDF</Button>
          </Box>
          </Box>

          <DataGrid
            rows={filteredRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onRowClick={(params) => setSelectedRowId(params.id as number)}
            getRowClassName={(params) => {
              if (params.id === selectedRowId) return 'selected-row';
              if (selectedRows.includes(params.id as number)) return 'clicked-row';
              return '';
            }}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': { 
                backgroundColor: '#f5f5f5',
                color: '#333',
                fontWeight: 'bold',
                minHeight: '56px',
                '& .MuiDataGrid-columnHeader': {
                  minHeight: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  color: '#1976d2',
                  fontWeight: 'bold',
                  borderRight: '1px dotted #ccc',
                  '&:last-child': {
                    borderRight: 'none'
                  }
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: '#1976d2',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  color: '#1976d2'
                },
                '& .MuiDataGrid-iconButtonContainer': {
                  color: '#1976d2'
                },
                '& .MuiDataGrid-menuIcon': {
                  color: '#1976d2'
                }
              },
              '& .MuiDataGrid-cell': {
                borderRight: '1px dotted #ccc',
                '&:last-child': {
                  borderRight: 'none'
                }
              },
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
              '& .selected-row': { backgroundColor: '#d1eaff !important' },
              '& .clicked-row': { 
                backgroundColor: '#d1eaff !important',
                border: '2px solid #1976d2 !important'
              },
              border: '1px solid #e0e0e0',
              '& .MuiDataGrid-overlay': {
                backgroundColor: 'transparent',
              }
            }}
          />
        </Paper>
      </Box>
  );
};

export default OrderList;