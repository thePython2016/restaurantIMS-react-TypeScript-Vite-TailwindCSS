import React, { useState, useEffect } from 'react';
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
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateStaffData = (count: number) => {
  const positions = ['Manager', 'Supervisor', 'Developer', 'Designer', 'Analyst'];
  const cities = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya'];
  const names = ['John', 'Jane', 'Alex', 'Maria', 'Chris', 'Nina', 'Paul'];

  const data = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `${names[i % names.length]} ${i}`,
      position: positions[i % positions.length],
      email: `user${i}@example.com`,
      phone: `+255${Math.floor(100000000 + Math.random() * 899999999)}`,
      address: `Street ${i}`,
      city: cities[i % cities.length],
      salary: 3000 + (i % 20) * 250,
    });
  }
  return data;
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'position', headerName: 'Position', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  { field: 'address', headerName: 'Address', flex: 1 },
  { field: 'city', headerName: 'Region', flex: 1 },
  { field: 'salary', headerName: 'Salary', flex: 1, type: 'number' },
];

const StaffList: React.FC = () => {
  const allStaffData = React.useMemo(() => generateStaffData(1000), []);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [search, setSearch] = useState('');
  const [salaryFilter, setSalaryFilter] = useState({ operator: '', amount: '' });
  const [pageRows, setPageRows] = useState<typeof allStaffData>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  useEffect(() => {
    let filtered = allStaffData;

    if (search.trim()) {
      filtered = filtered.filter((row) =>
        Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())
      );
    }

    const amount = Number(salaryFilter.amount);
    if (salaryFilter.operator && salaryFilter.amount !== '') {
      filtered = filtered.filter((row) => {
        switch (salaryFilter.operator) {
          case 'gt':
            return row.salary > amount;
          case 'lt':
            return row.salary < amount;
          case 'gte':
            return row.salary >= amount;
          case 'lte':
            return row.salary <= amount;
          default:
            return true;
        }
      });
    }

    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      filtered = [...filtered].sort((a, b) => {
        if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
        return 0;
      });
    }

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    setPageRows(filtered.slice(start, end));
  }, [allStaffData, paginationModel, sortModel, search, salaryFilter]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Staff List', 14, 10);
    autoTable(doc, {
      head: [['Name', 'Position', 'Email', 'Phone', 'Address', 'Region', 'Salary']],
      body: pageRows.map((row) => [
        row.name,
        row.position,
        row.email,
        row.phone,
        row.address,
        row.city,
        row.salary,
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
          ${pageRows
            .map(
              (row) => `
            <tr>
              <td>${row.name}</td>
              <td>${row.position}</td>
              <td>${row.email}</td>
              <td>${row.phone}</td>
              <td>${row.address}</td>
              <td>${row.city}</td>
              <td>${row.salary}</td>
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

  // Height scalability calculation
  const rowHeight = 52;
  const headerHeight = 56;
  const footerHeight = 56;
  const maxHeight = 600;
  const calculatedHeight = Math.min(
    headerHeight + pageRows.length * rowHeight + footerHeight,
    maxHeight
  );

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-7xl p-6 mx-auto">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          borderBottom="1px solid #ccc"
          pb={1}
        >
          <Typography variant="h5" fontWeight="bold">
            Staff List
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Salary</InputLabel>
            <Select
              label="Salary"
              value={salaryFilter.operator}
              onChange={(e) =>
                setSalaryFilter((prev) => ({ ...prev, operator: e.target.value }))
              }
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
            onChange={(e) =>
              setSalaryFilter((prev) => ({ ...prev, amount: e.target.value }))
            }
            sx={{ width: 100 }}
          />

          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ width: 200 }}
          />

          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePDF}
            color="primary"
          >
            PDF
          </Button>
        </Box>

        <DataGrid
          rows={pageRows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onRowClick={(params) => setSelectedRowId(params.id as number)}
          getRowClassName={(params) => params.id === selectedRowId ? 'selected-row' : ''}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            height: calculatedHeight,
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .selected-row': { backgroundColor: '#d1eaff !important' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #ccc' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default StaffList;
