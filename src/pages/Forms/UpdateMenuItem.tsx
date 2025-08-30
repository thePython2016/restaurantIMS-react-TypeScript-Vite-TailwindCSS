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
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

export function UpdateMenuItem() {
  const [rows, setRows] = useState([
    { id: 1, name: 'Chicken Burger', category: 'Main Course', description: 'Grilled chicken with cheese and salad', price: 8500, availability: 'Available' },
    { id: 2, name: 'Mango Juice', category: 'Beverage', description: 'Fresh mango juice served cold', price: 3000, availability: 'Out of Stock' },
  ]);

  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState({ operator: '', amount: '' });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState({ name: '', category: '', description: '', price: 0, availability: 'Available' });
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const selectedRow = filteredRows.find(row => row.id === selectedId) || null;

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
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
    doc.text('Menu List', 14, 10);
    autoTable(doc, {
      head: [['Name', 'Category', 'Description', 'Price', 'Availability']],
      body: filteredRows.map(r => [r.name, r.category, r.description, r.price, r.availability]),
    });
    doc.save('menu_list.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr><th>Name</th><th>Category</th><th>Description</th><th>Price</th><th>Availability</th></tr>
        </thead>
        <tbody>
          ${filteredRows.map(row => `
            <tr>
              <td>${row.name}</td>
              <td>${row.category}</td>
              <td>${row.description}</td>
              <td>${row.price}</td>
              <td>${row.availability}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
    const win = window.open('', '', 'width=900,height=700');
    win?.document.write(`<html><head><title>Print Menu</title></head><body>${tableHTML}</body></html>`);
    win?.document.close();
    win?.print();
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Item Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'price', headerName: 'Price (Tsh)', flex: 1 },
    { field: 'availability', headerName: 'Availability', flex: 1 },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Update Menu</Typography>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Price</InputLabel>
            <Select
              value={priceFilter.operator}
              label="Price"
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
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            sx={{ width: 200 }}
          />

          {selectedRow && (
            <>
              <Tooltip title="Update">
                <IconButton onClick={() => setOpenUpdateDialog(true)}><EditIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => setOpenDeleteDialog(true)} color="error"><DeleteIcon /></IconButton>
              </Tooltip>
            </>
          )}

          <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handlePDF}>PDF</Button>
        </Box>

        <Box ref={gridRef}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            onRowClick={(params) => setSelectedId(params.id as number)}
            getRowClassName={(params) => params.id === selectedId ? 'selected-row' : ''}
            autoHeight
            disableRowSelectionOnClick
            sx={{ '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' }, '& .selected-row': { backgroundColor: '#d1eaff !important' } }}
          />
        </Box>

        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
          <DialogTitle>Update Menu Item</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
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
            <Button variant="contained" onClick={handleUpdateSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this menu item?</DialogContentText>
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

export default UpdateMenuItem;
