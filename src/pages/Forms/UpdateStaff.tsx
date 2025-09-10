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
  Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Interface for staff data
interface StaffData {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  salary: number;
}

const Update: React.FC = () => {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
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
  const navigate = useNavigate();

  // Fetch staff data from Django API
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!accessToken) {
        setError('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch("http://127.0.0.1:8000/api/stafflist/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StaffData[] = await response.json();
      setRows(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error("Error fetching staff:", err);
      setError(`Failed to fetch staff data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStaffData();
  }, []);

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
          checked={isSelected(params.row.id)}
          onChange={() => handleSelectRow(params.row.id)}
        />
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
    { field: 'position', headerName: 'Position', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 120 },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 150 },
    { field: 'city', headerName: 'Region', flex: 1, minWidth: 120 },
    { field: 'salary', headerName: 'Salary', flex: 1, minWidth: 100 },
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map(row => row.id);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: string[] = [];

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

  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1;

  const selectedRow = filteredRows.find(row => row.id === selectedRowId) || null;

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        if (!accessToken) {
          setError('Authentication required. Please log in again.');
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/stafflist/${deleteId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state only after successful API call
      setRows(prev => prev.filter(row => row.id !== deleteId));
      setDeleteId(null);
      setSelectedRowId(null);
      setOpenDeleteDialog(false);
    } catch (err) {
        console.error('Error deleting staff member:', err);
        setError('Failed to delete staff member. Please try again.');
      }
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

  const handleUpdateSave = async () => {
    if (selectedRowId === null) return;
    
    try {
      if (!accessToken) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Prepare data for API (map city back to region for backend)
      const updateData = {
        ...updateForm,
        region: updateForm.city, // Map city to region for backend
        firstName: updateForm.name.split(' ')[0] || '',
        lastName: updateForm.name.split(' ').slice(1).join(' ') || '',
      };
      
      // Remove city field as backend expects region
      delete (updateData as any).city;

      const response = await fetch(`http://127.0.0.1:8000/api/stafflist/${selectedRowId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state only after successful API call
      setRows(prev => prev.map(row =>
        row.id === selectedRowId ? { ...row, ...updateForm } : row
      ));
      setOpenUpdateDialog(false);
      setSelectedRowId(null);
    } catch (err) {
      console.error('Error updating staff member:', err);
      setError('Failed to update staff member. Please try again.');
    }
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


  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/staff')}>
          Add Staff
        </Button>
      </Box>
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
            Update Staff
          </Typography>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        {/* Error Alert */}
        {error && (
          <Box sx={{ 
            bgcolor: 'error.light', 
            color: 'error.contrastText', 
            p: 2, 
            mb: 2, 
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2">{error}</Typography>
            <Button size="small" onClick={() => setError(null)} color="inherit">
              ×
            </Button>
          </Box>
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

            <Tooltip title="Refresh Data">
              <IconButton 
                color="primary" 
                onClick={fetchStaffData} 
                size="small"
              disabled={loading}
            >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

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
            loading={loading}
            onRowClick={(params) => setSelectedRowId(String(params.id))}
            getRowClassName={(params) => {
              if (params.id === selectedRowId) return 'selected-row';
              if (selectedRows.includes(params.id as string)) return 'clicked-row';
              return '';
            }}
            disableRowSelectionOnClick
            hideFooter={false}
            disableColumnMenu={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
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
                color: '#333 !important',
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
                  color: '#333 !important',
                  fontWeight: 'bold !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: '#333 !important',
                  fontWeight: 'bold !important',
                  fontSize: '0.875rem !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  color: '#333 !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                },
                '& .MuiDataGrid-iconButtonContainer': {
                  color: '#333 !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
                },
                '& .MuiDataGrid-menuIcon': {
                  color: '#333 !important',
                  visibility: 'visible !important',
                  opacity: '1 !important'
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
                  {loading ? 'Loading...' : (error ? 'Error loading data' : 'No records')}
                </Box>
              ),
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
          <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px 8px 0 0' }}>
            <DialogTitle sx={{
              color: 'white',
              padding: 0,
              margin: 0
            }}>
              Update Staff Member
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
