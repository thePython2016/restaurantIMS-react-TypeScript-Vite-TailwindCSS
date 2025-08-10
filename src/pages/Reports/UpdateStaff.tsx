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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Update: React.FC = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: 'John Doe',
      position: 'Manager',
      email: 'john@example.com',
      phone: '+255123456789',
      address: 'Mikocheni Street',
      city: 'Dar es Salaam',
      salary: 5000,
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Supervisor',
      email: 'jane@example.com',
      phone: '+255987654321',
      address: 'Arusha Town',
      city: 'Arusha',
      salary: 4000,
    },
  ]);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [salaryFilter, setSalaryFilter] = useState({ operator: '', amount: '' });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    salary: 0,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
        setSelectedRowId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'city', headerName: 'Region', flex: 1 },
    { field: 'salary', headerName: 'Salary', flex: 1 },
  ];

  const filteredRows = rows.filter(row => {
    const matchesSearch = Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase());
    const amount = parseFloat(salaryFilter.amount);

    const matchesSalary =
      !salaryFilter.operator || salaryFilter.amount === '' || isNaN(amount) ? true :
      salaryFilter.operator === 'gt' ? row.salary > amount :
      salaryFilter.operator === 'lt' ? row.salary < amount :
      salaryFilter.operator === 'gte' ? row.salary >= amount :
      salaryFilter.operator === 'lte' ? row.salary <= amount :
      true;

    return matchesSearch && matchesSalary;
  });

  const selectedRow = filteredRows.find(row => row.id === selectedRowId) || null;

  const handleDelete = () => {
    if (deleteId !== null) {
      setRows(prev => prev.filter(row => row.id !== deleteId));
      setDeleteId(null);
      setSelectedRowId(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleOpenUpdateDialog = () => {
    if (!selectedRow) return;
    const { id, ...rest } = selectedRow;
    setUpdateForm(rest);
    setOpenUpdateDialog(true);
  };

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value,
    }));
  };

  const handleUpdateSave = () => {
    if (selectedRowId === null) return;
    setRows(prev => prev.map(row =>
      row.id === selectedRowId ? { ...row, ...updateForm } : row
    ));
    setOpenUpdateDialog(false);
    setSelectedRowId(null);
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Staff List', 14, 10);
    autoTable(doc, {
      head: [['Name', 'Position', 'Email', 'Phone', 'Address', 'Region', 'Salary']],
      body: filteredRows.map(row => [
        row.name,
        row.position,
        row.email,
        row.phone,
        row.address,
        row.city,
        row.salary
      ]),
    });
    doc.save('staff_list.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr>
            <th>Name</th><th>Position</th><th>Email</th><th>Phone</th><th>Address</th><th>Region</th><th>Salary</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRows.map(row => `
            <tr>
              <td>${row.name}</td>
              <td>${row.position}</td>
              <td>${row.email}</td>
              <td>${row.phone}</td>
              <td>${row.address}</td>
              <td>${row.city}</td>
              <td>${row.salary}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    const printWin = window.open('', '', 'width=900,height=700');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head><title>Print Staff List</title></head>
        <body>
          <h2 style="text-align:left;">Staff List</h2>
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box>
          <Typography variant="h5" mb={1} align="left" fontWeight={700}>
            Update Staff
          </Typography>
          <Box sx={{ borderBottom: '1px solid #ededed', mb: 2 }} />
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
              onChange={(e) =>
                setPaginationModel({ ...paginationModel, pageSize: Number(e.target.value), page: 0 })
              }
            >
              {[5, 10, 25, 50].map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', ml: 'auto' }}>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Salary</InputLabel>
              <Select
                label="Salary"
                value={salaryFilter.operator}
                onChange={(e) => setSalaryFilter(prev => ({ ...prev, operator: e.target.value }))}
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
              value={salaryFilter.amount}
              onChange={(e) => setSalaryFilter(prev => ({ ...prev, amount: e.target.value }))}
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
                  <IconButton color="primary" onClick={handleOpenUpdateDialog} size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Selected Record">
                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeleteId(selectedRow.id);
                      setOpenDeleteDialog(true);
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
              Print
            </Button>
            <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handlePDF} color="primary">
              PDF
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: '100%' }} ref={gridRef}>
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
            sx={{
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#bdbdbd' },
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
              '& .selected-row': { backgroundColor: '#d1eaff !important' },
              border: 'none',
            }}
          />
        </Box>

        {selectedRow && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={handleOpenUpdateDialog}>
              Update Selected Record
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => {
              setDeleteId(selectedRow.id);
              setOpenDeleteDialog(true);
            }}>
              Delete Selected Record
            </Button>
          </Box>
        )}

        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update Staff Member</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {Object.entries(updateForm).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  value={value}
                  onChange={handleUpdateFormChange}
                  type={key === 'salary' ? 'number' : 'text'}
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
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this staff member?
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
};

export default Update;
