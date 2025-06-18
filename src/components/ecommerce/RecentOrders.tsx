import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'age', headerName: 'Age', width: 100 },
  { field: 'city', headerName: 'City', width: 180 },
];

const rows = [
  { id: 1, name: 'John Doe', age: 30, city: 'New York' },
  { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Michael Brown', age: 40, city: 'Chicago' },
  { id: 4, name: 'Emily Johnson', age: 22, city: 'Houston' },
  { id: 5, name: 'Chris Lee', age: 35, city: 'San Francisco' },
  { id: 6, name: 'Anna Kim', age: 28, city: 'Seattle' },
  { id: 7, name: 'David Clark', age: 32, city: 'Boston' },
  { id: 8, name: 'Sophia Turner', age: 27, city: 'Denver' },
  { id: 9, name: 'James Wilson', age: 45, city: 'Miami' },
  { id: 10, name: 'Olivia Harris', age: 29, city: 'Dallas' },
  { id: 11, name: 'Lucas Young', age: 31, city: 'Austin' },
  { id: 12, name: 'Mia King', age: 24, city: 'Atlanta' },
  { id: 13, name: 'Benjamin Scott', age: 38, city: 'Portland' },
  { id: 14, name: 'Charlotte Green', age: 26, city: 'Orlando' },
  { id: 15, name: 'Henry Adams', age: 37, city: 'Las Vegas' },
  { id: 16, name: 'Amelia Nelson', age: 33, city: 'San Diego' },
  { id: 17, name: 'Jack Carter', age: 41, city: 'Phoenix' },
  { id: 18, name: 'Ava Mitchell', age: 23, city: 'Philadelphia' },
  { id: 19, name: 'William Perez', age: 36, city: 'San Jose' },
  { id: 20, name: 'Ella Roberts', age: 34, city: 'Columbus' },
];

const RecentOrders = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  // Generate PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Order List', 14, 10);

    autoTable(doc, {
      head: [columns.map((col) => col.headerName)],
      body: rows.map((row) => [row.id, row.name, row.age, row.city]),
    });

    doc.save('order_list.pdf');
  };

  // Print the table
  const handlePrint = () => {
    const printContent = document.getElementById('print-section');
    const newWin = window.open('', '', 'width=900,height=600');
    newWin?.document.write(`
      <html>
        <head><title>Print</title></head>
        <body>
          <h2>Order List</h2>
          ${printContent?.innerHTML}
        </body>
      </html>
    `);
    newWin?.document.close();
    newWin?.focus();
    newWin?.print();
    newWin?.close();
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 900,
        margin: 'auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, flex: 1 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
        >
          Order List
        </Typography>

        {/* Top Controls */}
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Rows per page dropdown (Left) */}
          <FormControl size="small">
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={paginationModel.pageSize}
              label="Rows per page"
              onChange={(e) =>
                setPaginationModel((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  page: 0,
                }))
              }
              sx={{ width: 150 }}
            >
              {[5, 10, 15, 20].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Buttons (Right) */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={handlePrint}>
              Print
            </Button>
            <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Box>
        </Box>

        {/* Data Grid */}
        <Box id="print-section" sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 15, 20]}
            pagination
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default RecentOrders;
