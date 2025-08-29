import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface SentMessage {
  id: string;
  recipient: string;
  message: string;
  status: string;
  date: string;
  senderId: string;
}

export default function SentMessages() {
  const [rows, setRows] = useState<SentMessage[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const clearAllMessages = () => {
    localStorage.removeItem('sentMessages');
    setRows([]);
    setSelectedRows([]);
  };

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const updatedRows = rows.filter(row => !selectedRows.includes(row.id));
    setRows(updatedRows);
    localStorage.setItem('sentMessages', JSON.stringify(updatedRows));
    setSelectedRows([]);
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredRows
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(row => row.id);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSelectedRows([]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
    setSelectedRows([]);
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(row => 
    row.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.senderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Load sent messages from localStorage
    const loadSentMessages = () => {
      try {
        const savedMessages = localStorage.getItem('sentMessages');
        if (savedMessages) {
          const messages = JSON.parse(savedMessages);
          setRows(messages);
        } else {
          // Add sample data for testing if no messages exist
          const sampleMessages = [
            { id: "1", recipient: "0713000000", message: "Hello John! Your order has been confirmed.", status: "Sent", date: "2025-01-27 18:00", senderId: "SMS001" },
            { id: "2", recipient: "0722000000", message: "Meeting reminder: 3 PM today at the office.", status: "Delivered", date: "2025-01-27 19:10", senderId: "SMS002" },
            { id: "3", recipient: "0733000000", message: "Payment received. Thank you for your business!", status: "Sent", date: "2025-01-27 20:30", senderId: "SMS003" },
            { id: "4", recipient: "0744000000", message: "Your delivery is scheduled for tomorrow between 9 AM - 12 PM.", status: "Delivered", date: "2025-01-27 21:15", senderId: "SMS004" },
            { id: "5", recipient: "0755000000", message: "Account verification code: 123456. Valid for 10 minutes.", status: "Sent", date: "2025-01-27 22:00", senderId: "SMS005" }
          ];
          setRows(sampleMessages);
          localStorage.setItem('sentMessages', JSON.stringify(sampleMessages));
        }
      } catch (error) {
        console.error('Error loading sent messages:', error);
      }
    };

    loadSentMessages();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sentMessages') {
        loadSentMessages();
      }
    };

    const handleMessageSent = () => {
      loadSentMessages();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('messageSent', handleMessageSent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('messageSent', handleMessageSent);
    };
  }, []);

  const currentPageRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isAllSelected = currentPageRows.length > 0 && currentPageRows.every(row => isSelected(row.id));
  const isSomeSelected = currentPageRows.some(row => isSelected(row.id));

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Sent Messages
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {selectedRows.length > 0 && (
              <Button 
                variant="contained" 
                color="error" 
                size="small"
                onClick={handleDeleteSelected}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                  fontWeight: 'bold',
                  boxShadow: 2
                }}
              >
                🗑️ Delete Selected ({selectedRows.length})
              </Button>
            )}
            {rows.length > 0 && (
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                onClick={clearAllMessages}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Search and Rows per page controls */}
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
            placeholder="Search messages..."
            value={searchTerm}
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

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
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
                <TableCell>Recipient</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Sent</TableCell>
                <TableCell>Sender ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageRows.length > 0 ? (
                currentPageRows.map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      key={row.id}
                      selected={isItemSelected}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#1976d2 !important',
                          color: 'white !important',
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#1565c0 !important',
                          color: 'white !important',
                        },
                        '&.Mui-selected .MuiTableCell-root': {
                          color: 'white !important',
                        },
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
                      <TableCell>{row.recipient}</TableCell>
                      <TableCell sx={{ maxWidth: 200, wordBreak: 'break-word' }}>
                        {row.message}
                      </TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.senderId}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {searchTerm ? 'No messages found matching your search.' : 'No sent messages found. Messages will appear here after successful sending.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={cancelDelete}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title" sx={{ color: 'error.main', fontWeight: 'bold' }}>
            ⚠️ Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <strong>Warning:</strong> This action cannot be undone!
            </Alert>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Are you sure you want to delete <strong>{selectedRows.length}</strong> selected message{selectedRows.length > 1 ? 's' : ''}?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This will permanently remove the selected message{selectedRows.length > 1 ? 's' : ''} from your sent messages list.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={cancelDelete} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained" sx={{ fontWeight: 'bold' }}>
              🗑️ Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
