import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    });
  }
  return data;
};

const columns: GridColDef[] = [
  { field: 'customerName', headerName: 'Customer Name', flex: 1 },
  { field: 'menuItem', headerName: 'Menu Item', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', flex: 1, type: 'number' },
  { field: 'amount', headerName: 'Amount (Tsh)', flex: 1, type: 'number' },
  { field: 'notes', headerName: 'Notes', flex: 1 },
];

const OrderList: React.FC = () => {
  const allOrderData = React.useMemo(() => generateOrderData(300), []);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [search, setSearch] = useState('');
  const [pageRows, setPageRows] = useState<typeof allOrderData>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  useEffect(() => {
    let filtered = allOrderData;

    if (search.trim()) {
      filtered = filtered.filter((row) =>
        Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      filtered = [...filtered].sort((a, b) => {
        if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
        return 0;
      });
    }

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    setPageRows(filtered.slice(start, end));
  }, [allOrderData, paginationModel, sortModel, search]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Order List', 14, 10);
    autoTable(doc, {
      head: [['Customer Name', 'Menu Item', 'Quantity', 'Amount', 'Notes']],
      body: pageRows.map((row) => [
        row.customerName,
        row.menuItem,
        row.quantity,
        row.amount,
        row.notes,
      ]),
    });
    doc.save('order_list.pdf');
  };

  const handlePrint = () => {
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
  };

  const rowHeight = 52;
  const headerHeight = 56;
  const footerHeight = 56;
  const maxHeight = 600;
  const calculatedHeight = Math.min(
    headerHeight + pageRows.length * rowHeight + footerHeight,
    maxHeight
  );

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-7xl p-6 mx-auto">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          borderBottom="1px solid #ccc"
          pb={1}
        >
          <Typography variant="h5" fontWeight="bold">
            Order List
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ width: 200 }}
          />

          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePDF}
            color="primary"
          >
            PDF
          </Button>
        </Box>

        <DataGrid
          rows={pageRows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onRowClick={(params) => setSelectedRowId(params.id as number)}
          getRowClassName={(params) => params.id === selectedRowId ? 'selected-row' : ''}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            height: calculatedHeight,
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .selected-row': { backgroundColor: '#d1eaff !important' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #ccc' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default OrderList;