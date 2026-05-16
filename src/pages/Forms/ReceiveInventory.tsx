import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

interface InventoryData {
  itemID: number | '';  // Used for selection in form
  description: string;
  quantity: number;
  dateAdded: Dayjs | null;
}

interface Item {
  itemID?: number;
  id?: number;
  itemName?: string;
  name?: string;
}

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const schema = yup.object().shape({
  itemID: yup.number().typeError('Item is required').required('Item is required'),
  description: yup.string().required('Description is required'),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number')
    .required('Quantity is required'),
  dateAdded: yup.mixed().required('Date is required').test(
    'is-valid-date',
    'Date is required',
    (value) => value !== null && dayjs.isDayjs(value)
  )
});

const Inventory: React.FC = () => {
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string[] }>({});
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [allItems, setAllItems] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InventoryData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      itemID: '',
      description: '',
      quantity: undefined,
      dateAdded: dayjs(),
    },
  });

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) return;
        
        const response = await axios.get('http://127.0.0.1:8000/api/item/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data && Array.isArray(response.data)) {
          setAllItems(response.data);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    fetchAllItems();
  }, []);

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
    if (severity === 'success') setTimeout(() => setNotification((s) => ({ ...s, open: false })), 5000);
  };

  const onSubmit = async (data: InventoryData) => {
    try {
      setApiErrors({});
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) {
        showNotification('No authentication token found. Please log in again.', 'error');
        return;
      }

      const itemIDValue = data.itemID === '' ? null : Number(data.itemID);
      if (!itemIDValue) {
        setApiErrors({ itemID: ['Invalid item selected'] });
        return;
      }

      // Find the selected item from allItems array
      const selectedItem = allItems.find(item => (item.itemID || item.id) === itemIDValue);
      if (!selectedItem) {
        setApiErrors({ itemID: ['Selected item not found'] });
        return;
      }

      const payload = {
        itemID: itemIDValue,
        item_name: selectedItem.itemName || selectedItem.name,
        quantity: data.quantity,
        date: data.dateAdded ? data.dateAdded.format('YYYY-MM-DD') : '',
        description: data.description,
      };

      await axios.post('http://127.0.0.1:8000/api/inventory-items/', payload, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      showNotification('Inventory item saved successfully!', 'success');
      handleReset();
    } catch (err: any) {
      console.error('Error saving inventory item:', err);
      if (err.response?.status === 401) {
        showNotification('Authentication required. Please login first.', 'error');
      } else if (err.response?.data?.errors) {
        setApiErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        showNotification(err.response.data.message, 'error');
      } else if (err.message) {
        showNotification(`Error: ${err.message}`, 'error');
      } else {
        showNotification('Failed to save inventory item. Please try again.', 'error');
      }
    }
  };

  const handleAddNewItem = () => {
    setOpenDialog(false);
    window.location.href = 'http://localhost:5173/inventory-item';
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewItemName('');
  };

  const handleReset = () => {
    reset({ itemID: '', description: '', quantity: undefined, dateAdded: dayjs() });
    setApiErrors({});
  };

  return (
    <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6 }}>
      <Paper elevation={3} className="w-full max-w-6xl p-4 mx-auto">
        <Box sx={{ backgroundColor: '#1976d2', padding: '16px', borderRadius: '8px', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Inventory Registration Form
          </Typography>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        {notification.open && notification.severity === 'success' && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#f0f8f0', border: '1px solid #4caf50', borderRadius: '4px', color: '#2e7d32', fontSize: '14px', textAlign: 'center' }}>
            {notification.message}
          </Box>
        )}

        {Object.keys(apiErrors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">Please fix the following errors:</Typography>
            <ul>
              {Object.entries(apiErrors).map(([field, messages]) => messages.map((message, i) => <li key={`${field}-${i}`}><strong>{field}:</strong> {message}</li>))}
            </ul>
          </Alert>
        )}

        {notification.open && notification.severity === 'error' && <Alert severity="error" sx={{ mb: 2 }}>{notification.message}</Alert>}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="mt-4">
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
              <div className="flex gap-4">
                <Controller name="dateAdded" control={control} render={({ field }) => (
                  <DatePicker label={<RequiredLabel label="Date" />} value={field.value} onChange={(newValue) => field.onChange(newValue)} disableFuture slotProps={{ textField: { size: 'small', variant: 'outlined', fullWidth: true, error: !!errors.dateAdded || !!apiErrors.dateAdded, helperText: errors.dateAdded?.message || (apiErrors.dateAdded && apiErrors.dateAdded[0]) } }} />
                )} />

                <TextField size="small" variant="outlined" label={<RequiredLabel label="Item Name" />} fullWidth select {...register('itemID')} error={!!errors.itemID || !!apiErrors.itemID} helperText={errors.itemID?.message || (apiErrors.itemID && apiErrors.itemID[0]) || 'Select item from inventory'}>
                  <MenuItem value=""><em>Select an item</em></MenuItem>
                  {allItems.map((item) => (
                    <MenuItem key={item.itemID || item.id} value={item.itemID || item.id}>{item.itemName || item.name}</MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="flex gap-4">
                <TextField size="small" variant="outlined" label={<RequiredLabel label="Quantity" />} type="number" fullWidth {...register('quantity')} error={!!errors.quantity || !!apiErrors.quantity} helperText={errors.quantity?.message || (apiErrors.quantity && apiErrors.quantity[0]) || 'Enter current quantity in stock'} InputProps={{ inputProps: { min: 0, max: 1000000, step: 1 } }} />
                <TextField size="small" variant="outlined" label="Description" fullWidth multiline rows={3} {...register('description')} error={!!errors.description || !!apiErrors.description} helperText={errors.description?.message || (apiErrors.description && apiErrors.description[0])} />
              </div>

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button type="button" variant="outlined" color="secondary" size="small" onClick={handleReset} disabled={isSubmitting}>Reset</Button>
                <Button type="submit" variant="contained" color="primary" size="small" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Inventory Item'}</Button>
              </Box>
            </form>
          </div>
        </LocalizationProvider>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Item Not Found</DialogTitle>
          <DialogContent>
            <DialogContentText>The item "{newItemName}" is not in the inventory list. Would you like to add it as a new inventory item?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
            <Button onClick={handleAddNewItem} color="primary" variant="contained">Add New Item</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Inventory;