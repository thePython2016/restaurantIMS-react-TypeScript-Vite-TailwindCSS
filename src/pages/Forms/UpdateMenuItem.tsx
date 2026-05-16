import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  InputAdornment,
  Alert,
  Snackbar,
  Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

interface MenuItem {
  itemID?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  availability: string;
}

export function UpdateMenuItem() {
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState({ operator: '', amount: '' });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState({ name: '', category: '', description: '', price: 0, availability: 'Available' });
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get authentication token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get('http://127.0.0.1:8000/api/item/', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      setRows(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login first.');
      } else {
        setError('Failed to fetch menu items');
      }
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

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
    const amount = parseFloat(priceFilter.amount);
    const matchesPrice =
      !priceFilter.operator || isNaN(amount) ? true :
      priceFilter.operator === 'gt' ? row.price > amount :
      priceFilter.operator === 'lt' ? row.price < amount :
      priceFilter.operator === 'gte' ? row.price >= amount :
      priceFilter.operator === 'lte' ? row.price <= amount :
      true;
    return matchesSearch && matchesPrice;
  });

  const selectedRow = filteredRows.find(row => row.itemID === selectedId) || null;

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleUpdateSave = async () => {
    if (selectedId === null) return;
    
    try {
      setLoading(true);
      
      // Get authentication token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      await axios.put(`http://127.0.0.1:8000/api/item/${selectedId}/`, updateForm, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      setSuccessMessage('Menu item updated successfully!');
      await fetchMenuItems(); // Refresh the data
      setOpenUpdateDialog(false);
      setSelectedId(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login first.');
      } else {
        setError('Failed to update menu item');
      }
      console.error('Error updating menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedId !== null) {
      try {
        setLoading(true);
        
        // Get authentication token
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        await axios.delete(`http://127.0.0.1:8000/api/item/${selectedId}/`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        setSuccessMessage('Menu item deleted successfully!');
        await fetchMenuItems(); // Refresh the data
        setSelectedId(null);
        setOpenDeleteDialog(false);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Authentication required. Please login first.');
        } else {
          setError('Failed to delete menu item');
        }
        console.error('Error deleting menu item:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      
      // Get authentication token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Delete all selected items
      const deletePromises = selectedRows.map(id => 
        axios.delete(`http://127.0.0.1:8000/api/item/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
      );
      
      await Promise.all(deletePromises);
      
      setSuccessMessage(`${selectedRows.length} menu items deleted successfully!`);
      setSelectedRows([]);
      await fetchMenuItems(); // Refresh the data
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login first.');
      } else {
        setError('Failed to delete selected menu items');
      }
      console.error('Error deleting selected menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Menu List', 14, 10);
    autoTable(doc, {
      head: [['Name', 'Category', 'Description', 'Price', 'Availability']],
      body: filteredRows.map(r => [r.name, r.category, r.description, r.price, r.availability]),
    });
    doc.save('menu_list.pdf');
  };

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
          checked={selectedRows.length === filteredRows.length && filteredRows.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(filteredRows.map(row => row.itemID || 0));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          color="primary"
          checked={selectedRows.includes(params.row.itemID || 0)}
          onChange={(e) => {
            const rowId = params.row.itemID || 0;
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, rowId]);
            } else {
              setSelectedRows(prev => prev.filter(id => id !== rowId));
            }
          }}
        />
      ),
    },
    { field: 'name', headerName: 'Item Name', flex: 1, sortable: true, filterable: true },
    { field: 'category', headerName: 'Category', flex: 1, sortable: true, filterable: true },
    { field: 'description', headerName: 'Description', flex: 2, sortable: true, filterable: true },
    { 
      field: 'price', 
      headerName: 'Price (Tsh)', 
      flex: 1, 
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        return new Intl.NumberFormat('en-TZ', {
          style: 'currency',
          currency: 'TZS',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value).replace('TZS', 'TSh');
      }
    },
    { field: 'availability', headerName: 'Availability', flex: 1, sortable: true, filterable: true },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
          <Typography 
            variant="h5" 
            mb={1} 
            align="left" 
            fontWeight={700}
            sx={{
              color: 'white'
            }}
          >
            Update Menu
          </Typography>
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
              onChange={(e) => setPaginationModel({ ...paginationModel, pageSize: Number(e.target.value), page: 0 })}
            >
              {[5, 10, 25, 50].map(size => <MuiMenuItem key={size} value={size}>{size}</MuiMenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', ml: 'auto' }}>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Price</InputLabel>
              <Select
                label="Price"
                value={priceFilter.operator}
                onChange={(e) => setPriceFilter(prev => ({ ...prev, operator: e.target.value }))}
              >
                <MuiMenuItem value="">No Filter</MuiMenuItem>
                <MuiMenuItem value="gt">Greater Than</MuiMenuItem>
                <MuiMenuItem value="lt">Less Than</MuiMenuItem>
                <MuiMenuItem value="gte">Greater or Equal</MuiMenuItem>
                <MuiMenuItem value="lte">Less or Equal</MuiMenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Amount"
              type="number"
              value={priceFilter.amount}
              onChange={(e) => setPriceFilter(prev => ({ ...prev, amount: e.target.value }))}
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
                )
              }}
              sx={{ width: { xs: 150, sm: 200 } }}
            />

            {selectedRow && (
              <>
                <Tooltip title="Update Selected Record">
                  <IconButton 
                    color="primary" 
                    onClick={() => {
                      setUpdateForm({
                        name: selectedRow.name,
                        category: selectedRow.category,
                        description: selectedRow.description,
                        price: selectedRow.price,
                        availability: selectedRow.availability
                      });
                      setOpenUpdateDialog(true);
                    }} 
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Selected Record">
                  <IconButton
                    color="error"
                    onClick={() => setOpenDeleteDialog(true)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {selectedRows.length > 0 && (
              <>
                <Tooltip title={`Delete ${selectedRows.length} selected items`}>
                  <IconButton
                    color="error"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected items?`)) {
                        handleBulkDelete();
                      }
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {selectedRows.length} selected
                </Typography>
              </>
            )}

            <Tooltip title="Refresh Data">
              <IconButton 
                color="primary" 
                onClick={fetchMenuItems} 
                size="small"
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handlePDF} color="primary">
              PDF
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: '500px' }} ref={gridRef}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            onRowClick={(params) => setSelectedId(params.id as number)}
            getRowClassName={(params) => {
              if (params.id === selectedId) return 'selected-row';
              return '';
            }}
            disableRowSelectionOnClick
            hideFooter={false}
            disableColumnMenu={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
            sortingMode="client"
            filterMode="client"
            loading={loading}
            getRowId={(row) => row.itemID || row.id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
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
                  No records
                </Box>
              ),
            }}
          />
        </Box>

        {selectedRow && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => setOpenUpdateDialog(true)}>
              Update Selected Record
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setOpenDeleteDialog(true)}>
              Delete Selected Record
            </Button>
          </Box>
        )}

        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="sm" fullWidth>
          <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px 8px 0 0' }}>
            <DialogTitle sx={{
              color: 'white',
              padding: 0,
              margin: 0
            }}>
              Update Menu Item
            </DialogTitle>
          </Box>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {Object.entries(updateForm).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  value={value}
                  onChange={handleUpdateFormChange}
                  type={key === 'price' ? 'number' : 'text'}
                  fullWidth
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px 8px 0 0' }}>
            <DialogTitle sx={{
              color: 'white',
              padding: 0,
              margin: 0
            }}>
              Confirm Delete
            </DialogTitle>
          </Box>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this menu item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Error and Success Messages */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default UpdateMenuItem;