import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Select,
  MenuItem, FormControl, InputLabel, InputAdornment, Container
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialMenu = [
  { id: 1, name: 'Chicken Burger', category: 'Main Course', description: 'Grilled chicken with cheese and salad', price: 8500, availability: 'Available' },
  { id: 2, name: 'Mango Juice', category: 'Beverage', description: 'Fresh mango juice served cold', price: 3000, availability: 'Out of Stock' },
  { id: 3, name: 'Veggie Pizza', category: 'Main Course', description: 'Topped with fresh vegetables', price: 9500, availability: 'Available' },
  { id: 4, name: 'Coffee', category: 'Beverage', description: 'Hot black coffee', price: 2000, availability: 'Available' },
  { id: 5, name: 'Fruit Salad', category: 'Dessert', description: 'Mixed seasonal fruits', price: 4000, availability: 'Out of Stock' },
];

const MenuItemList: React.FC = () => {
  const [menuItems, setMenuItems] = useState(initialMenu);
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [priceFilter, setPriceFilter] = useState('');
  const [priceOperator, setPriceOperator] = useState('>=');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredRows = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = Object.values(item).join(' ').toLowerCase().includes(search.toLowerCase());
      let matchesPrice = true;
      if (priceFilter) {
        const price = item.price;
        const filter = parseFloat(priceFilter) || 0;
        switch (priceOperator) {
          case '<': matchesPrice = price < filter; break;
          case '<=': matchesPrice = price <= filter; break;
          case '>': matchesPrice = price > filter; break;
          case '>=': matchesPrice = price >= filter; break;
          case '==': matchesPrice = price === filter; break;
          default: matchesPrice = true;
        }
      }
      return matchesSearch && matchesPrice;
    });
  }, [menuItems, search, priceFilter, priceOperator]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Menu Items List', 14, 10);
    autoTable(doc, {
      head: [['Name', 'Category', 'Description', 'Price', 'Availability']],
      body: filteredRows.map(row => [row.name, row.category, row.description, row.price, row.availability]),
    });
    doc.save('menu_items.pdf');
  };

  const handlePrint = () => {
    const html = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background:#eee;">
          <tr><th>Name</th><th>Category</th><th>Description</th><th>Price</th><th>Availability</th></tr>
        </thead>
        <tbody>
          ${filteredRows.map(r => `
            <tr>
              <td>${r.name}</td>
              <td>${r.category}</td>
              <td>${r.description}</td>
              <td>${r.price}</td>
              <td>${r.availability}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
    const win = window.open('', '', 'width=900,height=700');
    win?.document.write(`<html><head><title>Print</title></head><body>${html}</body></html>`);
    win?.document.close();
    win?.print();
  };

  const handleAvailabilityChange = (id: number, newStatus: string) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, availability: newStatus } : item));
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Item Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'price', headerName: 'Price (Tsh)', flex: 1, type: 'number' },
    {
      field: 'availability',
      headerName: 'Availability',
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.value}
          size="small"
          onChange={(e) => handleAvailabilityChange(params.row.id, e.target.value)}
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
        </Select>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, width: '100%' }}>
        <Box>
          <Typography variant="h5" mb={1} align="left" fontWeight={700}>
            Menu Items
          </Typography>
          <Box sx={{ borderBottom: '1px solid #ededed', mb: 2 }} />
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="center" mb={3}>
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Price</InputLabel>
            <Select
              value={priceOperator}
              label="Filter by Price"
              onChange={(e) => setPriceOperator(e.target.value)}
            >
              <MenuItem value="<">Less than</MenuItem>
              <MenuItem value="<=">Less than or equal</MenuItem>
              <MenuItem value=">">Greater than</MenuItem>
              <MenuItem value=">=">Greater than or equal</MenuItem>
              <MenuItem value="==">Equal</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Price (Tsh)"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            type="number"
            sx={{ minWidth: 100 }}
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
            sx={{ minWidth: 200 }}
          />

          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>Print</Button>
          <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handlePDF}>PDF</Button>
        </Box>

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
          sx={{
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .selected-row': { backgroundColor: '#d1eaff !important' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #ccc' },
            mt: 2,
          }}
        />
      </Paper>
    </Container>
  );
};

export default MenuItemList;
