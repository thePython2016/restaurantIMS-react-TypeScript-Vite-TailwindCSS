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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

// Sample customer data
const customers = [
  { id: 1, name: "Alice Johnson", phone: "0711000001", email: "alice@example.com", city: "Nairobi" },
  { id: 2, name: "Bob Williams", phone: "0711000002", email: "bob@example.com", city: "Mombasa" },
  { id: 3, name: "Catherine Lee", phone: "0711000003", email: "catherine@example.com", city: "Kisumu" },
  { id: 4, name: "David Brown", phone: "0711000004", email: "david@example.com", city: "Nakuru" },
  { id: 5, name: "Emma Wilson", phone: "0711000005", email: "emma@example.com", city: "Eldoret" },
  { id: 6, name: "Frank Miller", phone: "0711000006", email: "frank@example.com", city: "Thika" },
  { id: 7, name: "Grace Davis", phone: "0711000007", email: "grace@example.com", city: "Kakamega" },
  { id: 8, name: "Henry Garcia", phone: "0711000008", email: "henry@example.com", city: "Kisii" },
  // Add more customers as needed
];

const CustomerContacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.city.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Get current page rows
  const currentPageRows = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Customer Contact Details
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Search and Rows per page controls - matching SentMessages style exactly */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={rowsPerPage}
              label="Rows per page"
              onChange={handleChangeRowsPerPage}
            >
              {[5, 10, 25, 50].map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search customers..."
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
        </Box>

        {/* Table - matching SentMessages exactly */}
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageRows.length > 0 ? (
                currentPageRows.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.city}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table Pagination - matching SentMessages exactly */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export { CustomerContacts };
