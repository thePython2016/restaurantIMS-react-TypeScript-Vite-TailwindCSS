import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
} from '@mui/material';
import axios from 'axios';

interface MenuItemData {
  name: string;
  category: string;
  description: string;
  price: number;
  availability: string;
}

const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];
const availabilityOptions = ['Available', 'Out of Stock'];

const schema = yup.object({
  name: yup.string().required('Item name is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  availability: yup.string().required('Availability is required'),
});

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const MenuItems: React.FC = () => {
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string[] }>({});
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      price: undefined,
      availability: ''
    }
  });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
    
    // Auto-hide success messages after 5 seconds
    if (severity === 'success') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, open: false }));
      }, 5000);
    }
  };

  const onSubmit = async (data: MenuItemData) => {
    try {
      setApiErrors({}); // Clear previous API errors
      
      // Get authentication token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      if (!token) {
        showNotification('No authentication token found. Please log in again.', 'error');
        return;
      }
      
      // Make API call with authentication
      await axios.post('http://127.0.0.1:8000/api/item/', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      showNotification('Menu item saved successfully!', 'success');
      handleReset(); // Clear all fields including select fields
    } catch (err: any) {
      console.error('Error saving item:', err);
      
      if (err.response?.status === 401) {
        showNotification('Authentication required. Please login first.', 'error');
      } else if (err.response?.data?.errors) {
        // Handle validation errors from API
        setApiErrors(err.response.data.errors);
      } else {
        showNotification('Failed to save menu item', 'error');
      }
    }
  };

  const handleReset = () => {
    // Reset all form fields to default values and clear all form state
    reset({
      name: '',
      category: '',
      description: '',
      price: undefined,
      availability: ''
    });
    setApiErrors({});
  };

  return (
    <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6 }}>
      <Paper elevation={3} className="w-full max-w-6xl p-4 mx-auto">
        <Box
          sx={{
            backgroundColor: '#1976d2',
            padding: '16px',
            borderRadius: '8px',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
          >
            Menu Item Registration Form
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
              textAlign: 'center'
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
              {Object.entries(apiErrors).map(([field, messages]) => (
                messages.map((message, index) => (
                  <li key={`${field}-${index}`}>
                    <strong>{field}:</strong> {message}
                  </li>
                ))
              ))}
            </ul>
          </Alert>
        )}

        {/* Display Error Message */}
        {notification.open && notification.severity === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {notification.message}
          </Alert>
        )}

        <div className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                variant="outlined"
                label={<RequiredLabel label="Item Name" />}
                fullWidth
                {...register('name')}
                error={!!errors.name || !!apiErrors.name}
                helperText={errors.name?.message || (apiErrors.name && apiErrors.name[0])}
                autoComplete="off"
              />
              <TextField
                size="small"
                variant="outlined"
                label={<RequiredLabel label="Category" />}
                fullWidth
                select
                {...register('category')}
                error={!!errors.category || !!apiErrors.category}
                helperText={errors.category?.message || (apiErrors.category && apiErrors.category[0])}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                variant="outlined"
                label={<RequiredLabel label="Price (TSh)" />}
                type="number"
                fullWidth
                {...register('price')}
                error={!!errors.price || !!apiErrors.price}
                helperText={
                  errors.price?.message || (apiErrors.price && apiErrors.price[0]) || 'Enter amount in Tanzanian Shillings'
                }
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
                variant="outlined"
                label={<RequiredLabel label="Availability" />}
                fullWidth
                select
                {...register('availability')}
                error={!!errors.availability || !!apiErrors.availability}
                helperText={errors.availability?.message || (apiErrors.availability && apiErrors.availability[0])}
              >
                {availabilityOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Row 3 */}
            <TextField
              size="small"
              variant="outlined"
              label={<RequiredLabel label="Description" />}
              fullWidth
              multiline
              rows={3}
              {...register('description')}
              error={!!errors.description || !!apiErrors.description}
              helperText={errors.description?.message || (apiErrors.description && apiErrors.description[0])}
            />

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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Menu Item'}
              </Button>
            </Box>
          </form>
        </div>

      </Paper>
    </Box>
  );
};

export default MenuItems;