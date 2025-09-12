import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateCustomerData = (count: number) => {
  const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'David Brown'];
  const phones = ['0712345678', '0765432109', '0789123456', '0654321879', '0743210987'];
  const addresses = ['123 Street', '456 Avenue', '789 Road', '321 Blvd', '654 Lane'];
  const cities = ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya'];

  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    phone: phones[i % names.length],
    address: addresses[i % names.length],
    city: cities[i % names.length],
  }));
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Full Name', flex: 1, sortable: true, filterable: true },
  { field: 'phone', headerName: 'Phone', flex: 1, sortable: true, filterable: true },
  { field: 'address', headerName: 'Address', flex: 1, sortable: true, filterable: true },
  { field: 'city', headerName: 'Region', flex: 1, sortable: true, filterable: true },
];

const UpdateCustomer: React.FC = () => {
  const initialData = useMemo(() => generateCustomerData(50), []);
  const [rows, setRows] = useState(initialData);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    return rows.filter((row) =>
      Object.values(row)
        .slice(0, 4)
        .some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
    );
  }, [rows, search]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Customer List', 14, 10);
    autoTable(doc, {
      head: [['Full Name', 'Phone', 'Address', 'Region']],
      body: filteredRows.map((row) => [row.name, row.phone, row.address, row.city]),
    });
    doc.save('customer_list.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr>
            <th>Full Name</th><th>Phone</th><th>Address</th><th>Region</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRows
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, width: '100%', overflow: 'hidden' }}>
        <Typography variant="h5" fontWeight={700} mb={2} sx={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 1 }}>
          Update Customer
        </Typography>

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={3} justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
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
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              size="small"
              placeholder="Search customers..."
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
            {selectedRowId !== null && (
              <>
                <IconButton
                  color="primary"
                  onClick={() => {
                    alert(`Update customer id ${selectedRowId}`);
                  }}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    if (window.confirm(`Delete customer id ${selectedRowId}?`)) {
                      setRows((prev) => prev.filter((r) => r.id !== selectedRowId));
                      setSelectedRowId(null);
                    }
                  }}
                  sx={{ mr: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ mr: 1 }}>
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

        <Box ref={gridRef}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            onRowClick={(params) => setSelectedRowId(params.id as number)}
            getRowClassName={(params) => (params.id === selectedRowId ? 'selected-row' : '')}
            autoHeight
            disableRowSelectionOnClick
            disableColumnMenu={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
            sortingMode="client"
            filterMode="client"
            sx={{
              '& .MuiDataGrid-root': {
                border: '1px solid #e0e0e0',
                '& .MuiDataGrid-columnHeaders': {
                  display: 'flex !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                }
              },
              '& .MuiDataGrid-columnHeaders': { 
                backgroundColor: '#f5f5f5 !important',
                color: '#1976d2 !important',
                fontWeight: 'bold !important',
                minHeight: '56px !important',
                display: 'flex !important',
                visibility: 'visible !important',
                opacity: '1 !important',
                '& .MuiDataGrid-columnHeader': {
                  minHeight: '56px !important',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  backgroundColor: '#f5f5f5 !important',
                  color: '#1976d2 !important',
                  fontWeight: 'bold !important',
                  visibility: 'visible !important',
                  opacity: '1 !important',
                  borderRight: '1px dotted #ccc !important',
                  '&:last-child': {
                    borderRight: 'none !important'
                  }
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: '#1976d2 !important',
                  fontWeight: 'bold !important',
                  fontSize: '0.875rem !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  color: '#1976d2 !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                },
                '& .MuiDataGrid-iconButtonContainer': {
                  color: '#1976d2 !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                },
                '& .MuiDataGrid-menuIcon': {
                  color: '#1976d2 !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
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
              '& .MuiDataGrid-overlay': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-main': {
                minHeight: '200px'
              }
            }}
          />
        </Box>

        {/* Bottom Update/Delete buttons with icons, only when a row is selected */}
        {selectedRowId !== null && (
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                alert(`Update customer id ${selectedRowId}`);
              }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (window.confirm(`Delete customer id ${selectedRowId}?`)) {
                  setRows((prev) => prev.filter((r) => r.id !== selectedRowId));
                  setSelectedRowId(null);
                }
              }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateCustomer;

