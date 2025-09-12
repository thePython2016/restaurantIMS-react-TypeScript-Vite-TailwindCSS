import React, { useState, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample contact data
const contacts = [
  { id: 1, name: "John Doe", phone: "0712345678", email: "john@example.com", department: "HR" },
  { id: 2, name: "Jane Smith", phone: "0723456789", email: "jane@example.com", department: "IT" },
  { id: 3, name: "Michael Brown", phone: "0734567890", email: "michael@example.com", department: "Finance" },
  { id: 4, name: "Sarah Wilson", phone: "0745678901", email: "sarah@example.com", department: "Marketing" },
  { id: 5, name: "David Johnson", phone: "0756789012", email: "david@example.com", department: "Sales" },
  { id: 6, name: "Emily Davis", phone: "0767890123", email: "emily@example.com", department: "Operations" },
  { id: 7, name: "Robert Miller", phone: "0778901234", email: "robert@example.com", department: "Legal" },
  { id: 8, name: "Lisa Garcia", phone: "0789012345", email: "lisa@example.com", department: "Customer Service" },
  // Add more contacts as needed
];

const StaffContacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.department.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPaginationModel(prev => ({ ...prev, page: 0 })); // Reset to first page when searching
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setPaginationModel({ page: 0, pageSize: 10 });
    setSelectedRows([]);
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
          indeterminate={selectedRows.length > 0 && selectedRows.length < filteredContacts.length}
          checked={filteredContacts.length > 0 && selectedRows.length === filteredContacts.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(filteredContacts.map(contact => contact.id));
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
    { field: 'id', headerName: 'ID', flex: 0.5, sortable: true, filterable: true },
    { field: 'name', headerName: 'Name', flex: 1, sortable: true, filterable: true },
    { field: 'phone', headerName: 'Phone', flex: 1, sortable: true, filterable: true },
    { field: 'email', headerName: 'Email', flex: 1.5, sortable: true, filterable: true },
    { field: 'department', headerName: 'Department', flex: 1, sortable: true, filterable: true },
  ];

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Staff Contact Details', 14, 10);
    autoTable(doc, {
      head: [['ID', 'Name', 'Phone', 'Email', 'Department']],
      body: filteredContacts.map(contact => [
        contact.id,
        contact.name,
        contact.phone,
        contact.email,
        contact.department
      ]),
    });
    doc.save('staff_contacts.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Department</th>
          </tr>
        </thead>
        <tbody>
          ${filteredContacts
            .map(
              (contact) => `
            <tr>
              <td>${contact.id}</td>
              <td>${contact.name}</td>
              <td>${contact.phone}</td>
              <td>${contact.email}</td>
              <td>${contact.department}</td>
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
        <head><title>Print Staff Contacts</title></head>
        <body>
          <h2 style="text-align:left;">Staff Contact Details</h2>
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
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6 }}>
      <CardContent>
        <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" sx={{ color: 'white' }}>
              Staff Contact Details
            </Typography>
          </Box>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        {/* Search and Rows per page controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Tooltip title="Refresh Data">
              <IconButton 
                color="primary" 
                onClick={handleRefresh} 
                size="small"
                sx={{ mr: 1 }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={handlePDF}
              color="primary"
            >
              PDF
            </Button>
          </Box>
        </Box>

        {/* DataGrid */}
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={filteredContacts}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            hideFooter={false}
            disableColumnMenu={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
            sortingMode="client"
            filterMode="client"
            autoHeight
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
                  No staff contacts found
                </Box>
              ),
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export { StaffContacts };