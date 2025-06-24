import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample customer data generator
const generateCustomerData = (count: number) => {
  const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'David Brown'];
  const phones = ['0712345678', '0765432109', '0789123456', '0654321879', '0743210987'];
  const addresses = ['123 Street', '456 Avenue', '789 Road', '321 Blvd', '654 Lane'];
  const cities = ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya'];

  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    phone: phones[i % phones.length],
    address: addresses[i % addresses.length],
    city: cities[i % cities.length],
  }));
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Full Name', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  { field: 'address', headerName: 'Address', flex: 1 },
  { field: 'city', headerName: 'Region', flex: 1 },
];

const CustomerList: React.FC = () => {
  // Initial data
  const initialData = useMemo(() => generateCustomerData(50), []);

  const [rows, setRows] = useState(initialData);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [search, setSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // Filter and sort rows based on search and sort model
  const filteredSortedRows = useMemo(() => {
    let filtered = rows;
    if (search.trim()) {
      filtered = filtered.filter((row) =>
        Object.values(row)
          .slice(0, 4) // exclude functions and isRowSelected property
          .some((val) =>
            String(val).toLowerCase().includes(search.toLowerCase())
          )
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
    return filtered;
  }, [rows, search, sortModel]);

  // Pagination slice
  const pagedRows = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    return filteredSortedRows.slice(start, start + paginationModel.pageSize);
  }, [filteredSortedRows, paginationModel]);

  // PDF export
  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Customer List', 14, 10);
    autoTable(doc, {
      head: [['Full Name', 'Phone', 'Address', 'Region']],
      body: filteredSortedRows.map((row) => [row.name, row.phone, row.address, row.city]),
    });
    doc.save('customer_list.pdf');
  };

  // Print
  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr>
            <th>Full Name</th><th>Phone</th><th>Address</th><th>Region</th>
          </tr>
        </thead>
        <tbody>
          ${filteredSortedRows
            .map(
              (row) => `
            <tr>
              <td>${row.name}</td>
              <td>${row.phone}</td>
              <td>${row.address}</td>
              <td>${row.city}</td>
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
        <head><title>Print Customer List</title></head>
        <body>
          <h2 style="text-align:left;">Customer List</h2>
          ${tableHTML}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  };

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
            Customer List
          </Typography>
        </Box>

        {/* Controls Row: Rows per page left, search/print/pdf right */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Rows per page */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={paginationModel.pageSize}
              label="Rows per page"
              onChange={(e) => setPaginationModel(prev => ({ ...prev, pageSize: Number(e.target.value), page: 0 }))}
            >
              {[5, 10, 25, 50].map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Right: Search, Print, PDF */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              }}
              sx={{ width: 250 }}
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
        </Box>

        <DataGrid
          rows={pagedRows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={filteredSortedRows.length}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onRowClick={(params) => setSelectedRowId(params.id as number)}
          getRowClassName={(params) =>
            params.id === selectedRowId ? 'selected-row' : ''
          }
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25, 50]}
          sx={{
            height: 500,
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .selected-row': { backgroundColor: '#d1eaff !important' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #ccc' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default CustomerList;
