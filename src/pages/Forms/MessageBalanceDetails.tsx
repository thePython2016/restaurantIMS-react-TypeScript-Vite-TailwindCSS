import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  Box, 
  Divider, 
  Alert, 
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Paper
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from "../../context/AuthContext";

interface BalanceRow {
  id: number;
  companyId: string;
  initialBalance: number;
  availableBalance: number;
  createdAt: string;
  updatedAt: string;
}

export default function MessageBalanceDetails() {
  const [rows, setRows] = useState<BalanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [clickedRows, setClickedRows] = useState<number[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user, accessToken } = useAuth();

  // Django backend URL
  const DJANGO_API_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000';

  const handleRowClick = (id: number) => {
    setClickedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
    setSelectedRowId(id);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map(row => row.id);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: number[] = [];

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

  const isSelected = (id: number) => selectedRows.indexOf(id) !== -1;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Check if user is authenticated
        if (!accessToken) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${DJANGO_API_URL}/api/v1/sms/balance/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Authentication failed. Please log in again.");
          } else if (res.status === 403) {
            setError("Access denied. You don't have permission to view SMS balance.");
          } else {
            setError(`HTTP error! status: ${res.status}`);
          }
          return;
        }

        const data = await res.json();
        console.log('API Response:', data); // Debug log

        // Handle the actual API response structure
        console.log('Full API Response:', JSON.stringify(data, null, 2)); // Debug full response
        
        if (data.success && data.balance) {
          // Handle nested structure: data.balance.balance contains the actual balance data
          const balanceData = data.balance.balance || data.balance;
          console.log('Balance Data:', balanceData); // Debug log
          console.log('Initial Balance:', balanceData.initial_balance, 'Type:', typeof balanceData.initial_balance);
          console.log('Available Balance:', balanceData.available_balance, 'Type:', typeof balanceData.available_balance);
          
          const rowData = {
            id: parseInt(balanceData.id) || 1,
            companyId: balanceData.company_id || 'Mambo SMS',
            initialBalance: parseFloat(balanceData.initial_balance) || 0,
            availableBalance: parseFloat(balanceData.available_balance) || 0,
            createdAt: balanceData.created_at ? new Date(balanceData.created_at).toLocaleString() : new Date().toLocaleString(),
            updatedAt: balanceData.updated_at ? new Date(balanceData.updated_at).toLocaleString() : new Date().toLocaleString(),
          };
          
          console.log('Row Data:', rowData); // Debug log
          setRows([rowData]);
        } else if (data.balance) {
          // Fallback: if success field is not present but balance data exists
          const balanceData = data.balance.balance || data.balance;
          console.log('Fallback Balance Data:', balanceData); // Debug log
          
          const rowData = {
            id: parseInt(balanceData.id) || 1,
            companyId: balanceData.company_id || 'Mambo SMS',
            initialBalance: parseFloat(balanceData.initial_balance) || 0,
            availableBalance: parseFloat(balanceData.available_balance) || 0,
            createdAt: balanceData.created_at ? new Date(balanceData.created_at).toLocaleString() : new Date().toLocaleString(),
            updatedAt: balanceData.updated_at ? new Date(balanceData.updated_at).toLocaleString() : new Date().toLocaleString(),
          };
          
          console.log('Fallback Row Data:', rowData); // Debug log
          setRows([rowData]);
        } else if (data.raw_data) {
          // Try to extract from raw_data if balance is not directly available
          const rawData = data.raw_data;
          console.log('Raw Data:', rawData); // Debug log
          
          if (rawData.initial_balance !== undefined || rawData.available_balance !== undefined) {
            const rowData = {
              id: parseInt(rawData.id) || 1,
              companyId: rawData.company_id || 'Mambo SMS',
              initialBalance: parseFloat(rawData.initial_balance) || 0,
              availableBalance: parseFloat(rawData.available_balance) || 0,
              createdAt: rawData.created_at ? new Date(rawData.created_at).toLocaleString() : new Date().toLocaleString(),
              updatedAt: rawData.updated_at ? new Date(rawData.updated_at).toLocaleString() : new Date().toLocaleString(),
            };
            
            console.log('Raw Data Row:', rowData); // Debug log
            setRows([rowData]);
          } else {
            setError("Balance data not found in response.");
          }
        } else {
          setError("No balance data available.");
        }
      } catch (err: any) {
        console.error("Error fetching SMS balance:", err);
        if (err.name === 'TypeError' && err.message.includes('JSON')) {
          setError("Invalid response from server. Please try again later.");
        } else {
          setError(err.message || "Failed to fetch SMS balance.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBalance();
    } else {
      setError("Please log in to view SMS balance.");
      setLoading(false);
    }
  }, [user, DJANGO_API_URL, accessToken]);

  // Filter rows based on search term
  const filteredRows = rows.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const currentPageRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isAllSelected = currentPageRows.length > 0 && currentPageRows.every(row => isSelected(row.id));
  const isSomeSelected = currentPageRows.some(row => isSelected(row.id));

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          SMS Balance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Overview of your available SMS credits
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {/* Search and Rows per page controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={rowsPerPage}
              label="Rows per page"
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {[5, 10, 25, 50].map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search balance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        <TableContainer component={Paper} sx={{ height: 'auto', overflow: 'visible' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={isSomeSelected && !isAllSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Company ID</TableCell>
                <TableCell>Initial Balance</TableCell>
                <TableCell>Available Balance</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageRows.length > 0 ? (
                currentPageRows.map((row) => {
                  const isItemSelected = isSelected(row.id);
                  const isClicked = clickedRows.includes(row.id);
                  
                  return (
                    <TableRow
                      hover
                      key={row.id}
                      selected={isItemSelected}
                      onClick={() => handleRowClick(row.id)}
                      sx={{
                        cursor: 'pointer',
                        // Highlight only selected rows with same color as StaffList
                        backgroundColor: isItemSelected ? '#d1eaff !important' : 'inherit',
                        '&:hover': {
                          backgroundColor: isItemSelected ? '#b3d9ff !important' : 'rgba(0, 0, 0, 0.04) !important',
                        },
                        border: isItemSelected ? '2px solid #1976d2 !important' : '1px solid transparent',
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.companyId}</TableCell>
                      <TableCell>{numberFormat(row.initialBalance)}</TableCell>
                      <TableCell>{numberFormat(row.availableBalance)}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell>{row.updatedAt}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {search ? 'No balance data found matching your search.' : 'No balance data available.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

const numberFormat = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
