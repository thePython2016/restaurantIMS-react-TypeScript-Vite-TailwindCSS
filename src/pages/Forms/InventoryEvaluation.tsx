import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import axios from 'axios';

interface MenuItem {
  itemID?: number | string;
  id?: number | string;
  name: string;
  item_name: string;
  category: string;
  description: string;
  quantity: number;
  date: string;
  unitOfMeasure: string;
  price?: number;
  availability?: string;
  isTotal?: boolean;
  isSubtotal?: boolean;
  isGrandTotal?: boolean;
}

const InventoryEvaluation = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<MenuItem | null>(null);
  const [selectedRows, setSelectedRows] = useState<MenuItem[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [priceFilter, setPriceFilter] = useState({
    operator: '',
    amount: '',
  });
  const [search, setSearch] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState<Partial<MenuItem>>({});

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get authentication token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/inventory-items/', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      console.log('API Response:', response.data); // Debug log
      console.log('Response type:', typeof response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      // Ensure we have an array of items
      const items = Array.isArray(response.data) ? response.data : [];
      console.log('Processed items:', items);
      
      if (items.length === 0) {
        console.log('No inventory items found in the database');
        setError('No inventory items found. Please add some inventory items first.');
      }
      
      // Map and normalize the data
      console.log('About to map rows. First item sample:', items[0]);
      const mappedRows = items.map((row: any, idx: number) => {
        // Always assign a unique string id
        const id = String(row.id ?? row.itemID ?? row.item_name ?? idx);
        return {
          id: id,
          itemID: String(row.itemID ?? row.id ?? id),
          date: row.date || new Date().toISOString().split('T')[0],
          item_name: row.item_name || row.name || '',
          name: row.item_name || row.name || '',
          category: row.category || '',
          description: row.description || '',
          quantity: Number(row.quantity) || 0,
          onhand: Number(row.onhand) || 0,
          unitOfMeasure: row.unit_of_measure || row.unitOfMeasure || '',
          isTransaction: Boolean(row.isTransaction),
          isSubtotal: Boolean(row.isSubtotal),
          isTotal: Boolean(row.isTotal),
          isGrandTotal: Boolean(row.isGrandTotal)
        };
      });
      
      console.log('Mapped Rows:', mappedRows); // Debug log
      setRows(mappedRows);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login first.');
      } else if (err.response?.status === 404) {
        setError('Inventory API endpoint not found. Please check if the backend is running.');
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        setError('Cannot connect to the server. Please check if the backend is running on http://127.0.0.1:8000');
      } else {
        setError(`Failed to fetch inventory items: ${err.message || 'Unknown error'}`);
      }
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const filteredRows = rows.filter(row => {
    // Apply search filter if any
    if (search) {
      const searchLower = search.toLowerCase();
      const rowValues = Object.values(row).join(' ').toLowerCase();
      if (!rowValues.includes(searchLower)) return false;
    }
    return true;
  });

  // Calculate totals per item
  interface TotalItem extends MenuItem {
    isTotal: boolean;
    isSubtotal: boolean;
  }

  interface Totals {
    [key: string]: TotalItem;
  }

  console.log('Initial rows:', rows); // Debug log

  const totals = filteredRows.reduce<Totals>((acc, row) => {
    if (!row.item_name) return acc; // Skip if item_name is missing
    const itemKey = row.item_name;
    if (!acc[itemKey]) {
      acc[itemKey] = {
        id: String(`subtotal_${itemKey}`),
        itemID: String(`subtotal_${itemKey}`),
        item_name: row.item_name,
        name: row.item_name,
        category: row.category || '',
        unitOfMeasure: row.unitOfMeasure || '',
        quantity: 0,
        onhand: 0,
        date: 'Subtotal',
        description: '',
        isTotal: true,
        isSubtotal: true
      };
    }
    acc[itemKey].quantity += Number(row.quantity) || 0;
    acc[itemKey].onhand = Number(row.onhand) || 0;
    return acc;
  }, {});

  // Calculate grand total
  const grandTotal = {
    id: String('grand_total'),
    itemID: String('grand_total'),
    item_name: 'GRAND TOTAL',
    name: 'GRAND TOTAL',
    category: '',
    unitOfMeasure: '',
    quantity: Object.values(totals).reduce((sum: number, item: any) => sum + item.quantity, 0),
    onhand: 0,
    date: 'TOTAL',
    description: '',
    isTotal: true,
    isGrandTotal: true
  };

  // Group transactions by item name
  const groupedItems = filteredRows.reduce((groups: { [key: string]: any[] }, row) => {
    if (!groups[row.item_name]) {
      groups[row.item_name] = [];
    }
    groups[row.item_name].push(row);
    return groups;
  }, {});

  // Create rows with totals for each group
  const rowsWithTotals = Object.entries(groupedItems).reduce((acc: any[], [itemName, items]) => {
    // Add all transactions for this item
    acc.push(...items);
    // Add subtotal for this item
    if (totals[itemName]) {
      acc.push(totals[itemName]);
    }
    return acc;
  }, []);
  
  // Add grand total row at the bottom
  rowsWithTotals.push(grandTotal);
  console.log('rowsWithTotals:', rowsWithTotals);
  rowsWithTotals.forEach((row, idx) => {
    console.log(`Row ${idx}: id=${row.id}, isTotal=${row.isTotal}, isSubtotal=${row.isSubtotal}, isGrandTotal=${row.isGrandTotal}`);
  });



  const handleRefresh = () => {
    fetchMenuItems();
  };

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.patch(
        `http://127.0.0.1:8000/api/inventory-items/${selectedRow?.id}/`,
        updateForm,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );
      setSuccessMessage('Item updated successfully');
      setOpenUpdateDialog(false);
      fetchMenuItems();
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.delete(
        `http://127.0.0.1:8000/api/inventory-items/${selectedRow?.id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );
      setSuccessMessage('Item deleted successfully');
      setOpenDeleteDialog(false);
      setSelectedRow(null);
      fetchMenuItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await Promise.all(
        selectedRows.map(row => 
          axios.delete(
            `http://127.0.0.1:8000/api/inventory-items/${row.id}/`,
            {
              headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
              }
            }
          )
        )
      );
      setSuccessMessage(`${selectedRows.length} items deleted successfully`);
      setSelectedRows([]);
      fetchMenuItems();
    } catch (err) {
      console.error('Error deleting items:', err);
      setError('Failed to delete items');
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = (): void => {
    const document = new jsPDF();
    
    try {
      // Add title with styling
      document.setFont('helvetica', 'bold');
      document.setFontSize(16);
      document.setTextColor(25, 118, 210); // #1976d2
      document.text('Inventory Valuation Report', 14, 15);
      
      // Add date
      document.setFont('helvetica', 'normal');
      document.setFontSize(10);
      document.setTextColor(100, 100, 100);
      document.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      
      autoTable(document, {
        startY: 30,
        head: [['Date', 'Item Name', 'Category', 'Unit of Measure', 'Quantity']],
        body: rowsWithTotals.map(r => [
          r.date,
          r.item_name,
          r.category,
          r.unitOfMeasure,
          r.quantity?.toString() || '0'
        ]),
        headStyles: {
          fillColor: [25, 118, 210],
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          cellPadding: 3,
          fontSize: 10,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          valign: 'middle'
        },
        columnStyles: {
          0: { halign: 'center' },
          4: { halign: 'right' }
        },
        didDrawCell: (data) => {
          const row = rowsWithTotals[data.row.index];
          if (row?.isGrandTotal) {
            document.setFont('helvetica', 'bold');
            document.setFontSize(11);
            document.setTextColor(255, 255, 255);
          } else if (row?.isSubtotal) {
            document.setFont('helvetica', 'bold');
            document.setFontSize(10);
            document.setTextColor(0, 0, 0);
          } else {
            document.setFont('helvetica', 'normal');
            document.setFontSize(10);
            document.setTextColor(0, 0, 0);
          }
        },
        willDrawCell: (data) => {
          const row = rowsWithTotals[data.row.index];
          if (row?.isGrandTotal) {
            document.setFillColor(25, 118, 210);
            return true;
          } else if (row?.isSubtotal) {
            document.setFillColor(240, 240, 240);
            return true;
          }
          return false;
        },
        alternateRowStyles: {
          fillColor: [252, 252, 252]
        },
        theme: 'grid'
      });
      
      document.save('inventory_valuation.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF report');
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => params.value || ''
    },
    { 
      field: 'item_name', 
      headerName: 'Item Name', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => params.value || ''
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => params.value || ''
    },
    { 
      field: 'unitOfMeasure',  // This matches the mapped field name
      headerName: 'Unit of Measure', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => params.value || '-'  // Show dash for empty values
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => {
        const value = params?.value;
        if (value === null || value === undefined) return '';
        return typeof value === 'number' ? value.toLocaleString() : value;
      }
    },
    { 
      field: 'onhand', 
      headerName: 'On Hand', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => {
        const value = params?.value;
        if (value === null || value === undefined) return '';
        return typeof value === 'number' ? value.toLocaleString() : value;
      },
      cellClassName: (params) => {
        const value = params?.value;
        if (value === null || value === undefined) return '';
        if (typeof value === 'number') {
          if (value < 0) return 'negative-stock';
          if (value < 10) return 'low-stock';
        }
        return '';
      }
    }
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
;
          <Typography 
            variant="h5" 
            mb={1} 
            align="left" 
            fontWeight={700}
            sx={{
              color: 'white'
            }}
          >
            Update Inventory
          </Typography>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

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
              {[5, 10, 25, 50].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
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
                <MenuItem value="">No Filter</MenuItem>
                <MenuItem value="gt">Greater Than</MenuItem>
                <MenuItem value="lt">Less Than</MenuItem>
                <MenuItem value="gte">Greater or Equal</MenuItem>
                <MenuItem value="lte">Less or Equal</MenuItem>
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
                  <IconButton color="primary" onClick={() => setOpenUpdateDialog(true)} size="small">
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
              <span>
                <IconButton 
                  color="primary" 
                  onClick={handleRefresh} 
                  size="small"
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handlePDF} color="primary">
              PDF
            </Button>
          </Box>
        </Box>

        <Box sx={{ 
            width: '100%', 
            height: 'auto',
            '& .MuiDataGrid-root': {
              height: 'auto',
              minHeight: '200px',
              maxHeight: 'none'
            }
          }} ref={gridRef}>
          <DataGrid
            rows={rowsWithTotals}
            columns={columns}
            getRowId={(row) => String(row.id)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            autoHeight
            checkboxSelection
            onRowSelectionModelChange={(newSelectionModel) => {
              if (!Array.isArray(newSelectionModel)) return;
              const selectedItems = rowsWithTotals.filter(
                row => newSelectionModel.includes(String(row.id)) && !row.isTotal && !row.isSubtotal && !row.isGrandTotal
              );
              setSelectedRows(selectedItems);
            }}
            // isRowSelectable removed for debugging
            onRowClick={(params) => {
              if (!params.row.isTotal && !params.row.isSubtotal && !params.row.isGrandTotal) {
                setSelectedId(typeof params.id === 'string' ? parseInt(params.id) : params.id as number);
                setSelectedRow(params.row);
              }
            }}
            hideFooter={false}
            disableColumnMenu={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
            sortingMode="client"
            filterMode="client"
            loading={loading}
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
                },
                '&.negative-stock': {
                  color: '#d32f2f',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(211, 47, 47, 0.1)'
                },
                '&.low-stock': {
                  color: '#ed6c02',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(237, 108, 2, 0.1)'
                }
              },
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
              '& .selected-row': { backgroundColor: '#d1eaff !important' },
              '& .total-row': { 
                backgroundColor: '#f5f5f5 !important',
                fontWeight: 'bold !important',
                borderTop: '2px solid #1976d2 !important',
              },
              '& .subtotal-row': {
                backgroundColor: '#f5f5f5 !important',
                fontWeight: 'bold !important',
                fontStyle: 'italic !important',
                borderTop: '1px solid #1976d2 !important',
                borderBottom: '1px solid #1976d2 !important',
              },
              '& .grand-total-row': {
                backgroundColor: '#1976d2 !important',
                color: 'white !important',
                fontSize: '1.1rem !important',
                fontWeight: 'bold !important',
                borderTop: '3px solid #000 !important',
                borderBottom: '3px solid #000 !important',
                '& .MuiDataGrid-cell': {
                  color: 'white !important'
                }
              },
              '& .MuiDataGrid-overlay': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-main': {
                height: 'auto',
                overflow: 'hidden'
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
      </Paper>
    </Box>
  );
}

export default InventoryEvaluation;

// For any Tooltip wrapping a disabled Button, use:
// <Tooltip title="...">
//   <span>
//     <Button disabled>...</Button>
//   </span>
// </Tooltip>