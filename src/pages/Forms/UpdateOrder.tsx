import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Tooltip,
  IconButton,
  Checkbox,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';

const initialOrders = [
  { id: 1, customer: 'John Doe', menuItem: 'Chicken Burger', quantity: 2, amount: 17000, status: 'Paid' },
  { id: 2, customer: 'Jane Smith', menuItem: 'Mango Juice', quantity: 1, amount: 3000, status: 'Pending' },
  { id: 3, customer: 'Alice Johnson', menuItem: 'Veggie Pizza', quantity: 1, amount: 9500, status: 'Paid' },
  { id: 4, customer: 'Bob Brown', menuItem: 'Coffee', quantity: 3, amount: 6000, status: 'Pending' },
];

const UpdateOrder = () => {
  const [rows, setRows] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState({ customer: '', menuItem: '', quantity: 1, amount: 0, status: 'Pending' });
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [amountOperator, setAmountOperator] = useState('');
  const [amountFilter, setAmountFilter] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
        setSelectedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRows = rows.filter(row => {
    const matchesSearch = Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase());
    const matchesAmount = amountFilter ? eval(`${row.amount} ${amountOperator || '>= '} ${parseFloat(amountFilter) || 0}`) : true;
    return matchesSearch && matchesAmount;
  });

  const selectedRow = filteredRows.find(row => row.id === selectedId) || null;

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
    // Regenerate or reload data; here we reset to initialOrders for demo purposes
    setRows([...initialOrders]);
    setSelectedRows([]);
    setSelectedId(null);
  };

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | any) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name as string]: name === 'quantity' || name === 'amount' ? Number(value) : value }));
  };

  const handleUpdateSave = () => {
    if (selectedId === null) return;
    setRows(prev => prev.map(row => row.id === selectedId ? { ...row, ...updateForm } : row));
    setOpenUpdateDialog(false);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      setRows(prev => prev.filter(row => row.id !== selectedId));
      setSelectedId(null);
      setOpenDeleteDialog(false);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Order List', 14, 10);
    autoTable(doc, {
      head: [['Order ID', 'Customer', 'Menu Item', 'Quantity', 'Amount', 'Status']],
      body: filteredRows.map(r => [r.id, r.customer, r.menuItem, r.quantity, r.amount, r.status]),
    });
    doc.save('order_list.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr><th>Order ID</th><th>Customer</th><th>Menu Item</th><th>Quantity</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${filteredRows.map(row => `
            <tr>
              <td>${row.id}</td>
              <td>${row.customer}</td>
              <td>${row.menuItem}</td>
              <td>${row.quantity}</td>
              <td>${row.amount}</td>
              <td>${row.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
    const win = window.open('', '', 'width=900,height=700');
    win?.document.write(`<html><head><title>Print Orders</title></head><body>${tableHTML}</body></html>`);
    win?.document.close();
    win?.print();
  };

  const columnsBase: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', flex: 1 },
    { field: 'customer', headerName: 'Customer', flex: 1 },
    { field: 'menuItem', headerName: 'Menu Item', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ];

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
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3, width: '100%', overflow: 'hidden' }}>
        <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h5" align="left" fontWeight={700} sx={{ color: 'white' }}>
              Update Order
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
              type="number"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
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

            {selectedRow && (
              <>
                <Tooltip title="Update">
                  <IconButton onClick={() => {
                    setUpdateForm({
                      customer: selectedRow.customer,
                      menuItem: selectedRow.menuItem,
                      quantity: selectedRow.quantity,
                      amount: selectedRow.amount,
                      status: selectedRow.status,
                    });
                    setOpenUpdateDialog(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => setOpenDeleteDialog(true)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>

        <Box ref={gridRef}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            onRowClick={(params) => setSelectedId(params.id as number)}
            getRowClassName={(params) => {
              if (params.id === selectedId) return 'selected-row';
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
        </Box>

        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
          <DialogTitle>Update Order</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField label="Customer" name="customer" value={updateForm.customer} onChange={handleUpdateFormChange} fullWidth />
              <TextField label="Menu Item" name="menuItem" value={updateForm.menuItem} onChange={handleUpdateFormChange} fullWidth />
              <TextField label="Quantity" name="quantity" type="number" value={updateForm.quantity} onChange={handleUpdateFormChange} fullWidth />
              <TextField label="Amount" name="amount" type="number" value={updateForm.amount} onChange={handleUpdateFormChange} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={updateForm.status} label="Status" onChange={handleUpdateFormChange as any}>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this order?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default UpdateOrder;
