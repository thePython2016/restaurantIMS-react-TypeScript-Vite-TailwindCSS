import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const Invoice: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);

  const handleItemChange = (index: number, key: string, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

  return (
    <Box className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <Paper elevation={3} sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]}`,
        borderRadius: 3,
        p: 6,
        mx: 'auto'
      }}>
        <Typography variant="h5" gutterBottom className="mb-4 font-bold">
          Invoice Form
        </Typography>
        <Divider className="mb-6" />

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField
            label={<span>Customer Name <span style={{ color: 'red' }}>*</span></span>}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label={<span>Invoice Number <span style={{ color: 'red' }}>*</span></span>}
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label={<span>Date <span style={{ color: 'red' }}>*</span></span>}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
        </Box>

        <Typography variant="h6" className="mt-4 mb-2 font-medium">Items</Typography>
        <Divider className="mb-3" />

        {items.map((item, index) => (
          <Box key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-center">
            <TextField
              label={<span>Item Name <span style={{ color: 'red' }}>*</span></span>}
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              label={<span>Quantity <span style={{ color: 'red' }}>*</span></span>}
              type="number"
              inputProps={{ min: 1 }}
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              label={<span>Unit Price <span style={{ color: 'red' }}>*</span></span>}
              type="number"
              inputProps={{ min: 0 }}
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            />
            <Box className="flex items-center justify-center">
              <IconButton onClick={() => removeItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItem}
          sx={{ mt: 2, mb: 4 }}
        >
          Add Item
        </Button>

        <Divider className="my-4" />
        <Box className="flex justify-end items-center mb-4">
          <Typography variant="h6">Total: TZS {getTotal()}</Typography>
        </Box>

        <Box className="flex justify-end gap-4">
          <Button variant="outlined" color="primary" onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="contained" color="primary" onClick={() => alert('Invoice saved')}>
            Save Invoice
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Invoice;
