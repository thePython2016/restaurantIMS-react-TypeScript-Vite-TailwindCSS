import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Checkbox,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type CustomerRow = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  createdAt?: string;
};

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedRowId(null);

      if (!accessToken) {
        setError('Authentication required. Please log in.');
        setRows([]);
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/customer/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        let message = `Failed to load customers (${response.status})`;
        try {
          const data = await response.json();
          if (typeof data.detail === 'string') message = data.detail;
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      const mapped: CustomerRow[] = (Array.isArray(data) ? data : data.results || []).map((c: any) => ({
        id: c.customerID ?? c.id,
        name: c.fullname,
        phone: c.phoneNumber,
        address: c.physicalAddress,
        city: c.region,
        createdAt: c.createdAt || null,
      }));
      setRows(mapped);
    } catch (e: any) {
      setError(e?.message || 'Failed to load customers');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !q
        ? true
        : [row.name, row.phone, row.address, row.city]
            .some((val) => String(val).toLowerCase().includes(q));
      const rowDate = row.createdAt ? dayjs(row.createdAt) : null;
      const matchesStart = startDate && rowDate ? rowDate.isAfter(startDate.startOf('day')) || rowDate.isSame(startDate.startOf('day')) : true;
      const matchesEnd = endDate && rowDate ? rowDate.isBefore(endDate.endOf('day')) || rowDate.isSame(endDate.endOf('day')) : true;
      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [rows, search, startDate, endDate]);

  const columns: GridColDef[] = [
    { 
      field: 'checkbox', 
      headerName: '', 
      width: 50, 
      sortable: false, 
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Checkbox
          color="primary"
          indeterminate={selectedRows.length > 0 && selectedRows.length < filteredRows.length}
          checked={filteredRows.length > 0 && selectedRows.length === filteredRows.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(filteredRows.map(row => row.id));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          color="primary"
          checked={selectedRows.includes(params.row.id)}
          onChange={(e) => {
            const rowId = params.row.id;
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, rowId]);
            } else {
              setSelectedRows(prev => prev.filter(id => id !== rowId));
            }
          }}
        />
      ),
    },
    { field: 'name', headerName: 'Full Name', flex: 1, sortable: true, filterable: true },
    { field: 'phone', headerName: 'Phone', flex: 1, sortable: true, filterable: true },
    { field: 'address', headerName: 'Address', flex: 1, sortable: true, filterable: true },
    { field: 'city', headerName: 'Region', flex: 1, sortable: true, filterable: true },
  ];

  const handleRefresh = () => {
    setSelectedRows([]);
    fetchCustomers();
  };

  // PDF export
  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Customer List', 14, 10);
    autoTable(doc, {
      head: [['Full Name', 'Phone', 'Address', 'Region']],
      body: filteredRows.map((row) => [row.name, row.phone, row.address, row.city]),
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
    <>
      <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6, maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={3} sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]}`,
          borderRadius: 3,
          p: 3,
          width: '100%'
        }}>
          <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              Customer List
            </Typography>
            <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From"
                  value={startDate}
                  onChange={(v) => setStartDate(v)}
                  slotProps={{ textField: { size: 'small', sx: { width: 140 } } }}
                />
                <DatePicker
                  label="To"
                  value={endDate}
                  onChange={(v) => setEndDate(v)}
                  slotProps={{ textField: { size: 'small', sx: { width: 140 } } }}
                />
              </LocalizationProvider>
              <TextField
                size="small"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                }}
                sx={{ width: 200 }}
              />
              <Button
                size="small"
                variant="outlined"
                startIcon={<PrintIcon sx={{ fontSize: 18 }} />}
                onClick={handlePrint}
                sx={{ mr: 1 }}
              >
                Print
              </Button>
              <Tooltip title="Refresh Data">
                <IconButton color="primary" onClick={handleRefresh} size="small">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                size="small"
                variant="contained"
                startIcon={<PictureAsPdfIcon sx={{ fontSize: 18 }} />}
                onClick={handlePDF}
                color="primary"
              >
                PDF
              </Button>
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            {error && (
              <Box sx={{ mb: 2, color: 'error.main', fontSize: 14 }}>{error}</Box>
            )}
            <DataGrid
              rows={filteredRows}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25, 50]}
              onRowClick={(params) => setSelectedRowId(params.id as number)}
              getRowClassName={(params) => {
                if (params.id === selectedRowId) return 'selected-row';
                if (selectedRows.includes(params.id as number)) return 'clicked-row';
                return '';
              }}
              autoHeight
              loading={loading}
              disableRowSelectionOnClick
              hideFooter={false}
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
                '& .clicked-row': { 
                  backgroundColor: '#d1eaff !important',
                  border: '2px solid #1976d2 !important'
                },
                '& .MuiDataGrid-overlay': {
                  backgroundColor: 'transparent',
                },
                '& .MuiDataGrid-main': {
                  minHeight: '200px'
                }
              }}
              slots={{
                noRowsOverlay: () => (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: 'text.secondary',
                      fontSize: '1.1rem'
                    }}
                  >
                    No customers found
                  </Box>
                ),
              }}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default CustomerList;