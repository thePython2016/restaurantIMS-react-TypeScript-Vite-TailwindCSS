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
  const [clickedRows, setClickedRows] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const clearAllMessages = () => {
    localStorage.removeItem('sentMessages');
    setRows([]);
    setSelectedRows([]);
    setClickedRows([]);
  };

  const handleRowClick = (id: string) => {
    setClickedRows(prev => {
      if (prev.includes(id)) {
        // If already clicked, remove it
        return prev.filter(rowId => rowId !== id);
      } else {
        // If not clicked, add it
        return [...prev, id];
      }
    });
  };

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const updatedRows = rows.filter(row => !clickedRows.includes(row.id));
    setRows(updatedRows);
    localStorage.setItem('sentMessages', JSON.stringify(updatedRows));
    setSelectedRows([]);
    setClickedRows([]);
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
          // No messages exist - start with empty array
          setRows([]);
        }
      } catch (error) {
        console.error('Error loading sent messages:', error);
        // If there's an error parsing, clear the data and start fresh
        localStorage.removeItem('sentMessages');
        setRows([]);
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
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6, minHeight: 'auto' }}>
        <CardContent sx={{ height: 'auto', overflow: 'visible' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Sent Messages
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {clickedRows.length > 0 && (
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                onClick={handleDeleteSelected}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                  fontWeight: 'bold'
                }}
              >
                🗑️ Delete Selected ({clickedRows.length})
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
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title" sx={{ color: 'error.main', fontWeight: 'bold', fontSize: '1.2rem' }}>
            ⚠️ Confirm Message Deletion
          </DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 3, fontSize: '1rem' }}>
              <strong>⚠️ WARNING:</strong> This action cannot be undone!
            </Alert>
            
            <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
              You are about to delete {clickedRows.length} message{clickedRows.length > 1 ? 's' : ''}:
            </Typography>
            
            {/* Show selected messages for confirmation */}
            <Box sx={{ mb: 3, maxHeight: 200, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
              {clickedRows.map((rowId, index) => {
                const message = rows.find(r => r.id === rowId);
                return message ? (
                  <Box key={rowId} sx={{ mb: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {index + 1}. To: {message.recipient}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                      Message: {message.message.length > 50 ? message.message.substring(0, 50) + '...' : message.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Sent: {message.date}
                    </Typography>
                  </Box>
                ) : null;
              })}
            </Box>
            
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Are you absolutely sure you want to permanently delete these message{clickedRows.length > 1 ? 's' : ''}?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This action will permanently remove the selected message{clickedRows.length > 1 ? 's' : ''} from your sent messages list and cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={cancelDelete} 
              color="primary" 
              variant="outlined"
              size="large"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained" 
              size="large"
              sx={{ 
                fontWeight: 'bold', 
                minWidth: 120,
                backgroundColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.dark'
                }
              }}
            >
              🗑️ Delete Forever
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
