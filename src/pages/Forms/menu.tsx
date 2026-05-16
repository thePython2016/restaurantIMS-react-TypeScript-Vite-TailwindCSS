import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  // Avatar,
  // IconButton,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';


const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const MenuItems = () => {
  const [items, setItems] = useState<any[]>([]);
  // No separate categories state; categories will be derived from items
  const [itemLoading, setItemLoading] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);
  // No separate category loading/error state

  // Fetch items from backend
  useEffect(() => {
    setItemLoading(true);
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    fetch('http://localhost:8000/api/item/', {
      credentials: 'include', // send cookies if using session auth
      headers,
    })
      .then(async (res) => {
        if (!res.ok) {
          setItemError(`Failed to load items: ${res.status}`);
          setItems([]);
          setItemLoading(false);
          return;
        }
        const data = await res.json();
        console.log('Fetched items:', data); // Debug: log fetched data
        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data.results)) {
          setItems(data.results);
        } else {
          setItems([]);
        }
        setItemLoading(false);
      })
      .catch((_err) => {
        setItemError('Failed to load items');
        setItems([]);
        setItemLoading(false);
      });
  }, []);

  // Categories will be derived from items
  // Example top button handlers
  // Removed handleBack and handleNew functions
  // Removed handleExport function
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const [notification, setNotification] = useState<{ open: boolean; severity: 'error' | 'success'; message: string }>({
    open: false,
    severity: 'success',
    message: '',
  });
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, severity, message });
    if (severity === 'success') {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, open: false }));
      }, 5000);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  const schema = yup.object().shape({
    itemid: yup.string().required('Item is required'),
    category: yup.string().required('Category is required'),
    price: yup.number()
      .typeError('Price must be a number')
      .required('Price is required')
      .positive('Price must be positive')
      .max(1000000, 'Price cannot exceed 1,000,000 TSh'),
    description: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: { itemid: '', category: '', price: undefined, description: '' },
  });

  const handleReset = () => {
    // Explicitly clear select fields and inputs
    reset({ itemid: '', category: '', price: undefined as any, description: '' });
    setApiErrors({});
  };

  // Removed add-to-table flow

  // Removed selected-rows submit flow and table

  const handleSubmitSingle = async () => {
    try {
      // validate needed fields
      const valid = await trigger(['itemid', 'category', 'price']);
      if (!valid) return;
      setIsSubmitting(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const values = getValues();
      const itemObj = Array.isArray(items) ? items.find((i: any) => String(i.itemID) === String(values.itemid)) : null;
      const payload = {
        item: Number(values.itemid),
        itemid: Number(values.itemid),
        itemName: itemObj ? itemObj.itemName : String(values.itemid),
        name: itemObj ? itemObj.itemName : String(values.itemid),
        category: values.category,
        price: Number(values.price),
        description: values.description || '',
      };
      console.log('Submitting single payload', payload);
      const response = await fetch('http://localhost:8000/api/menu/', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let maybeJson: any = null;
        try { maybeJson = await response.json(); } catch (_e) {
          try { maybeJson = await response.text(); } catch (__e) { maybeJson = null; }
        }
        const message = (maybeJson && (maybeJson.detail || maybeJson.message || (typeof maybeJson === 'string' ? maybeJson : JSON.stringify(maybeJson)))) || `Failed to submit: ${response.status}`;
        console.error('Submit single failed', response.status, maybeJson);
        showNotification(message, 'error');
        setIsSubmitting(false);
        return;
      }
      showNotification('Menu item saved successfully!', 'success');
      handleReset();
    } catch (err) {
      showNotification('Network error while submitting item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed row selection helpers

  return (
    <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6 }}>
      <Paper elevation={3} className="w-full max-w-6xl p-4 mx-auto">
        {/* Top Action Buttons */}
        {/* Top Action Buttons Removed: No Back, New Item, or Export buttons */}
        <Box
          sx={{
            backgroundColor: '#1976d2',
            padding: '16px',
            borderRadius: '8px',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Menu Item Form
          </Typography>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        {/* Display Success Message */}
        {notification.open && notification.severity === 'success' && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: '#f0f8f0',
              border: '1px solid #4caf50',
              borderRadius: '4px',
              color: '#2e7d32',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {notification.message}
          </Box>
        )}

        {/* Display API errors */}
        {Object.keys(apiErrors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">Please fix the following errors:</Typography>
            <ul>
              {Object.entries(apiErrors).map(([field, messages]) =>
                messages.map((message, index) => (
                  <li key={`${field}-${index}`}>
                    <strong>{field}:</strong> {message}
                  </li>
                ))
              )}
            </ul>
          </Alert>
        )}

        <div className="mt-4">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmitSingle(); }}
            className="space-y-5"
          >

            {/* Image Upload Row Removed: No icons or image upload UI */}

            {/* Row 1: Item and Category from backend */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="Item" />}
                fullWidth
                select
                {...register('itemid')}
                error={!!errors.itemid || !!apiErrors.itemid}
                helperText={`${errors.itemid?.message ?? (apiErrors.itemid && apiErrors.itemid[0]) ?? ''}`}
                disabled={itemLoading}
              >
                <MenuItem value=""><em>Select item</em></MenuItem>
                {itemLoading && <MenuItem value=""><em>Loading...</em></MenuItem>}
                {itemError && <MenuItem value=""><em>{itemError}</em></MenuItem>}
                {Array.isArray(items) && items.length > 0 && items.map((item) => (
                  <MenuItem key={item.itemID} value={String(item.itemID)}>
                    {item.itemName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                label={<RequiredLabel label="Category" />}
                fullWidth
                select
                {...register('category')}
                error={!!errors.category || !!apiErrors.category}
                helperText={`${errors.category?.message ?? (apiErrors.category && apiErrors.category[0]) ?? ''}`}
                disabled={itemLoading}
              >
                <MenuItem value=""><em>Select category</em></MenuItem>
                {itemLoading && <MenuItem value=""><em>Loading...</em></MenuItem>}
                {itemError && <MenuItem value=""><em>{itemError}</em></MenuItem>}
                {Array.isArray(items) && items.length > 0 && Array.from(new Set(items.map((item) => item.category))).map((cat) => (
                  <MenuItem key={cat} value={String(cat)}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="Price (TSh)" />}
                type="number"
                fullWidth
                {...register('price', { valueAsNumber: true })}
                error={!!errors.price || !!apiErrors.price}
                helperText={`${errors.price?.message ?? (apiErrors.price && apiErrors.price[0]) ?? 'Enter amount in Tanzanian Shillings'}`}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 1000000,
                    step: 0.01,
                  },
                }}
              />
              <TextField
                size="small"
                label="Description (optional)"
                fullWidth
                multiline
                rows={3}
                {...register('description')}
                error={!!errors.description || !!apiErrors.description}
                helperText={`${errors.description?.message ?? (apiErrors.description && apiErrors.description[0]) ?? ''}`}
              />
            </div>

            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </Button>

              <Box display="flex" gap={1}>
                <Button
                  type="button"
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleSubmitSingle}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
                >
                  {isSubmitting ? 'Saving...' : 'Save Menu Item'}
                </Button>
              </Box>
            </Box>
          </form>
        </div>
        {/* Removed table and submit-selected UI */}
      </Paper>
    </Box>
  );
};

export default MenuItems;