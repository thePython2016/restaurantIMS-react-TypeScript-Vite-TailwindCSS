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
  Tooltip,
  Checkbox
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

const InventoryItemSummary = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<MenuItem | null>(null);
  const [selectedRows, setSelectedRows] = useState<MenuItem[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [priceFilter, setPriceFilter] = useState({
    operator: '',
    amount: '',
  });
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: ''
  });
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
        
        // Handle itemID properly - if it's an object, extract the value or use id
        let itemIDValue = row.itemID;
        if (typeof itemIDValue === 'object' && itemIDValue !== null) {
          itemIDValue = itemIDValue.id || itemIDValue.value || row.id || id;
        }
        itemIDValue = String(itemIDValue || row.id || id);
        
        // Debug quantity values
        console.log('Row quantity debug:', {
          id: id,
          item_name: row.item_name,
          quantity: row.quantity,
          qty: row.qty,
          amount: row.amount,
          quantityType: typeof row.quantity,
          quantityValue: Number(row.quantity),
          allFields: Object.keys(row)
        });
        
        return {
          id: id,
          itemID: itemIDValue,
          date: row.date || new Date().toISOString().split('T')[0],
          item_name: row.item_name || row.name || '',
          name: row.item_name || row.name || '',
          category: row.category || '',
          description: row.description || '',
          quantity: Number(row.quantity) || Number(row.qty) || Number(row.amount) || Number(row.stock) || Number(row.stock_quantity) || 1, // Try different field names, default to 1
          onhand: Number(row.quantity) || Number(row.qty) || Number(row.amount) || Number(row.stock) || Number(row.stock_quantity) || 1, // Set onhand equal to quantity
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
    
    // Apply date filter if any
    if (dateFilter.from || dateFilter.to) {
      const rowDate = new Date(row.date);
      if (dateFilter.from && rowDate < new Date(dateFilter.from)) return false;
      if (dateFilter.to && rowDate > new Date(dateFilter.to)) return false;
    }
    
    return true;
  });

  // Calculate totals per item
  interface TotalItem extends MenuItem {
    isTotal: boolean;
    isSubtotal: boolean;
    onhand?: number;
  }

  interface Totals {
    [key: string]: TotalItem;
  }

  console.log('Initial rows:', rows); // Debug log
  console.log('Filtered rows:', filteredRows); // Debug log

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
    console.log('Adding to totals:', {
      itemKey,
      rowQuantity: row.quantity,
      rowQuantityType: typeof row.quantity,
      currentTotal: acc[itemKey].quantity
    });
    
    acc[itemKey].quantity += Number(row.quantity) || 0;
    acc[itemKey].onhand = acc[itemKey].quantity; // Set onhand equal to quantity
    return acc;
  }, {});

  // Calculate grand total
  const grandTotalQuantity = Object.values(totals).reduce((sum: number, item: any) => sum + item.quantity, 0);
  const grandTotal = {
    id: String('grand_total'),
    itemID: String('grand_total'),
    item_name: 'GRAND TOTAL',
    name: 'GRAND TOTAL',
    category: '',
    unitOfMeasure: '',
    quantity: grandTotalQuantity,
    onhand: grandTotalQuantity, // Set onhand equal to quantity
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
  console.log('rowsWithTotals length:', rowsWithTotals.length);
  rowsWithTotals.forEach((row, idx) => {
    console.log(`Row ${idx}: id=${row.id}, isTotal=${row.isTotal}, isSubtotal=${row.isSubtotal}, isGrandTotal=${row.isGrandTotal}`);
    console.log(`Row ${idx} data:`, row);
  });



  const handleRefresh = () => {
    fetchMenuItems();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableRows = rowsWithTotals.filter(row => !row.isTotal && !row.isSubtotal && !row.isGrandTotal);
      const allIds = selectableRows.map(row => String(row.id));
      setSelectedRowIds(allIds);
      setSelectedRows(selectableRows);
    } else {
      setSelectedRowIds([]);
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (rowId: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds(prev => [...prev, rowId]);
      const row = rowsWithTotals.find(r => String(r.id) === rowId);
      if (row) {
        setSelectedRows(prev => [...prev, row]);
      }
    } else {
      setSelectedRowIds(prev => prev.filter(id => id !== rowId));
      setSelectedRows(prev => prev.filter(row => String(row.id) !== rowId));
    }
  };

  const isAllSelected = () => {
    const selectableRows = rowsWithTotals.filter(row => !row.isTotal && !row.isSubtotal && !row.isGrandTotal);
    return selectableRows.length > 0 && selectedRowIds.length === selectableRows.length;
  };

  const isIndeterminate = () => {
    const selectableRows = rowsWithTotals.filter(row => !row.isTotal && !row.isSubtotal && !row.isGrandTotal);
    return selectedRowIds.length > 0 && selectedRowIds.length < selectableRows.length;
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
        head: [['ID', 'Date', 'Item Name', 'Category', 'Unit of Measure', 'Quantity']],
        body: rowsWithTotals.map(r => [
          r.id,
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
      valueFormatter: (params) => params?.value || '',
      width: 120
    },
    { 
      field: 'item_name', 
      headerName: 'Item Name', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => params?.value || '',
      width: 150
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => params?.value || '',
      width: 120
    },
    { 
      field: 'unitOfMeasure',
      headerName: 'Unit of Measure', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => params.value || '-',
      width: 130
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => {
        const value = params?.value;
        if (value === null || value === undefined) return '0';
        return typeof value === 'number' ? value.toLocaleString() : value;
      },
      width: 100
    },
    { 
      field: 'onhand', 
      headerName: 'On Hand', 
      flex: 1, 
      sortable: true, 
      filterable: true,
      valueFormatter: (params) => {
        const value = params?.value;
        if (value === null || value === undefined) return '0';
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
      },
      width: 100
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
            gap: 1,
            alignItems: 'center',
            mb: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={paginationModel.pageSize}
                label="Rows per page"
                onChange={(e) => setPaginationModel({ ...paginationModel, pageSize: Number(e.target.value), page: 0 })}
              >
                {[5, 10, 25, 50].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Date From"
              type="date"
              value={dateFilter.from}
              onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />

            <TextField
              size="small"
              label="Date To"
              type="date"
              value={dateFilter.to}
              onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
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
              sx={{ width: 180 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
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


        {/* Working DataGrid */}
        <DataGrid
          rows={rowsWithTotals.map(row => ({
            id: String(row.id),
            date: String(row.date || ''),
            item_name: String(row.item_name || ''),
            category: String(row.category || ''),
            unitOfMeasure: String(row.unitOfMeasure || ''),
            quantity: Number(row.quantity || 0),
            onhand: Number(row.onhand || 0)
          }))}
          columns={[
            { field: 'date', headerName: 'Date', flex: 1, minWidth: 100 },
            { field: 'item_name', headerName: 'Item Name', flex: 2, minWidth: 150 },
            { field: 'category', headerName: 'Category', flex: 1, minWidth: 100 },
            { field: 'unitOfMeasure', headerName: 'Unit', flex: 1, minWidth: 80 },
            { field: 'quantity', headerName: 'Quantity', flex: 1, minWidth: 80, type: 'number' },
            { field: 'onhand', headerName: 'On Hand', flex: 1, minWidth: 80, type: 'number' }
          ]}
          autoHeight
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          loading={loading}
          sx={{
            '& .MuiDataGrid-root': {
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            },
            '& .MuiDataGrid-main': {
              overflow: 'hidden'
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'hidden'
            },
            '& .MuiDataGrid-columnHeaders': { 
              backgroundColor: '#f8f9fa',
              color: '#495057',
              fontWeight: '600',
              minHeight: '48px',
              borderBottom: '2px solid #dee2e6',
              '& .MuiDataGrid-columnHeader': {
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                color: '#495057',
                fontWeight: '600',
                borderRight: '1px solid #dee2e6',
                '&:last-child': {
                  borderRight: 'none'
                }
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: '#495057',
                fontWeight: '600',
                fontSize: '0.875rem'
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                color: '#495057'
              },
              '& .MuiDataGrid-iconButtonContainer': {
                color: '#6c757d'
              },
              '& .MuiDataGrid-menuIcon': {
                color: '#6c757d'
              }
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #f1f3f4',
              padding: '12px 16px',
              fontSize: '0.875rem',
              color: '#495057',
              '&:last-child': {
                borderRight: 'none'
              }
            },
            '& .MuiDataGrid-row': {
              borderBottom: '1px solid #f1f3f4',
              backgroundColor: 'white',
              '&:hover': { 
                backgroundColor: '#f8f9fa',
                cursor: 'pointer'
              }
            },
            '& .total-row': { 
              backgroundColor: '#e9ecef !important',
              fontWeight: '600 !important',
              borderTop: '2px solid #dee2e6 !important'
            },
            '& .subtotal-row': {
              backgroundColor: '#f8f9fa !important',
              fontWeight: '600 !important',
              fontStyle: 'italic !important',
              borderTop: '1px solid #dee2e6 !important'
            },
            '& .grand-total-row': {
              backgroundColor: '#007bff !important',
              color: 'white !important',
              fontWeight: 'bold !important',
              borderTop: '3px solid #0056b3 !important',
              '& .MuiDataGrid-cell': {
                color: 'white !important',
                borderRight: '1px solid rgba(255,255,255,0.2) !important'
              }
            },
            '& .regular-row': {
              backgroundColor: 'white !important',
              '&:hover': {
                backgroundColor: '#f8f9fa !important'
              }
            }
          }}
          getRowClassName={(params) => {
            // Only highlight actual subtotal and grand total rows
            if (params.row.id === 'grand_total') return 'grand-total-row';
            if (params.row.id?.toString().startsWith('subtotal_')) return 'subtotal-row';
            // Regular data rows get no special class - ensure they have white background
            return 'regular-row';
          }}
        />

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

export default InventoryItemSummary;

// For any Tooltip wrapping a disabled Button, use:
// <Tooltip title="...">
//   <span>
//     <Button disabled>...</Button>
//   </span>
// </Tooltip>