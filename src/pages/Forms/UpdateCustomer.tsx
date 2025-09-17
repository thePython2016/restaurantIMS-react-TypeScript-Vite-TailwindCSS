import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
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
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../../context/AuthContext';

type CustomerRow = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  createdAt?: string | null;
};

const columnsBase: GridColDef[] = [
  { field: 'name', headerName: 'Full Name', flex: 1, sortable: true, filterable: true },
  { field: 'phone', headerName: 'Phone', flex: 1, sortable: true, filterable: true },
  { field: 'address', headerName: 'Address', flex: 1, sortable: true, filterable: true },
  { field: 'city', headerName: 'Region', flex: 1, sortable: true, filterable: true },
];

const UpdateCustomer: React.FC = () => {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error'; }>({ open: false, message: '', severity: 'success' });

  const [editForm, setEditForm] = useState<{ name: string; phone: string; address: string; city: string }>({ name: '', phone: '', address: '', city: '' });
  const [editErrors, setEditErrors] = useState<{ phone?: string; name?: string; address?: string; city?: string }>({});

  const filteredRows = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !lowerSearch
        ? true
        : [row.name, row.phone, row.address, row.city]
            .some((val) => String(val).toLowerCase().includes(lowerSearch));

      const rowDate = row.createdAt ? dayjs(row.createdAt) : null;
      const matchesStart = startDate && rowDate ? rowDate.isAfter(startDate.startOf('day')) || rowDate.isSame(startDate.startOf('day')) : true;
      const matchesEnd = endDate && rowDate ? rowDate.isBefore(endDate.endOf('day')) || rowDate.isSame(endDate.endOf('day')) : true;

      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [rows, search, startDate, endDate]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Customer List', 14, 10);
    autoTable(doc, {
      head: [['Full Name', 'Phone', 'Address', 'Region']],
      body: filteredRows.map((row) => [row.name, row.phone, row.address, row.city]),
    });
    doc.save('customer_list.pdf');
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(filteredRows.map(r => r.id));
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

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
    if (severity === 'success') {
      setTimeout(() => setNotification((p) => ({ ...p, open: false })), 5000);
    }
  };

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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
        let msg = `Failed to load customers (${response.status})`;
        try {
          const j = await response.json();
          if (typeof j.detail === 'string') msg = j.detail;
        } catch {}
        throw new Error(msg);
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

  const handleRefresh = () => {
    setSelectedRowId(null);
    setSelectedRows([]);
    fetchCustomers();
  };

  const populateEditForm = (row: CustomerRow) => {
    setEditErrors({});
    setEditForm({ name: row.name || '', phone: row.phone || '', address: row.address || '', city: row.city || '' });
  };

  const handleSave = async () => {
    try {
      if (!selectedRowId) return;
      if (!accessToken) {
        showNotification('Authentication required. Please log in again.', 'error');
        return;
      }
      setLoading(true);
      setEditErrors({});
      const payload = {
        fullname: editForm.name.trim(),
        phoneNumber: editForm.phone.trim().replace(/\D/g, '').slice(0, 10),
        physicalAddress: editForm.address.trim(),
        region: editForm.city,
      };
      const response = await fetch(`http://127.0.0.1:8000/api/customer/${selectedRowId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let message = `Failed to update (${response.status})`;
        try {
          const err = await response.json();
          if (err.phoneNumber && Array.isArray(err.phoneNumber) && err.phoneNumber.length > 0) {
            setEditErrors((p) => ({ ...p, phone: err.phoneNumber[0] }));
            message = err.phoneNumber[0];
          } else if (typeof err.detail === 'string') {
            message = err.detail;
          }
        } catch {}
        throw new Error(message);
      }
      showNotification('Customer updated successfully!', 'success');
      fetchCustomers();
    } catch (e: any) {
      showNotification(e?.message || 'Failed to update customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3, width: '100%', overflow: 'hidden' }}>
        <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Update Customer
          </Typography>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={3} justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1} sx={{ flexWrap: 'wrap' }}>
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
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 160 }}
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
                  <EditIcon fontSize="small" />
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
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
            <Button size="small" variant="outlined" startIcon={<PrintIcon sx={{ fontSize: 18 }} />} onClick={handlePrint} sx={{ mr: 1 }}>
              Print
            </Button>
            <IconButton color="primary" onClick={handleRefresh} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
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

        {notification.open && notification.severity === 'success' && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#f0f8f0', border: '1px solid #4caf50', borderRadius: '4px', color: '#2e7d32', fontSize: '14px', textAlign: 'center' }}>
            {notification.message}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <Box ref={gridRef}>
          <DataGrid
            rows={filteredRows}
            columns={[
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
                    onChange={handleSelectAll}
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
            ]}
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
            loading={loading}
          />
        </Box>

        {/* Inline edit form when a row is selected */}
        {selectedRowId !== null && (
          <Box mt={3} p={2} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Update Customer</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                size="small"
                label="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                sx={{ minWidth: 240, flex: 1 }}
              />
              <TextField
                size="small"
                label="Phone"
                value={editForm.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setEditForm((p) => ({ ...p, phone: digits }));
                }}
                InputProps={{ startAdornment: (<InputAdornment position="start">+255</InputAdornment>) }}
                error={!!editErrors.phone}
                helperText={editErrors.phone}
                sx={{ minWidth: 200, flex: 1 }}
              />
              <TextField
                size="small"
                label="Address"
                value={editForm.address}
                onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                sx={{ minWidth: 240, flex: 1 }}
              />
              <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Region</InputLabel>
                <Select
                  value={editForm.city}
                  label="Region"
                  onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value as string }))}
                >
                  {['Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi',
                    'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Morogoro',
                    'Mtwara', 'Mwanza', 'Njombe', 'Pemba North', 'Pemba South', 'Pwani',
                    'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe',
                    'Tabora', 'Tanga', 'Unguja North', 'Unguja South'].map((region) => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" size="small" onClick={() => setSelectedRowId(null)}>Cancel</Button>
              <Button variant="contained" size="small" onClick={handleSave} disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : <EditIcon />}>
                {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateCustomer;

