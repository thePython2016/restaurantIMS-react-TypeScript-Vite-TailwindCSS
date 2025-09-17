import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

interface InventoryData {
  itemName: string;
  unitOfMeasure: string;
  dateAdded: Dayjs | null;
}

const unitOfMeasureOptions = ['kg', 'grams', 'liters', 'ml', 'pieces', 'boxes', 'bags', 'bottles', 'cans'];

const schema = yup.object({
  itemName: yup.string().required('Item name is required'),
  unitOfMeasure: yup.string().required('Unit of measure is required'),
  dateAdded: yup.mixed<Dayjs | null>().required('Date is required').test(
    'is-valid-date',
    'Date is required',
    (value) => value !== null && dayjs.isDayjs(value)
  ),
});

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const InventoryItem: React.FC = () => {
  const location = useLocation();
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
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InventoryData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      itemName: '',
      unitOfMeasure: '',
      dateAdded: dayjs() // Today's date as dayjs object
    }
  });

  // Pre-populate item name if coming from ReceiveInventory form
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newItemName = urlParams.get('newItemName');
    
    if (newItemName) {
      setValue('itemName', newItemName);
      showNotification(`Pre-filled with item: ${newItemName}`, 'success');
    }
  }, [setValue]);

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
    
    // Auto-hide success messages after 5 seconds
    if (severity === 'success') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, open: false }));
      }, 5000);
    }
  };

  const onSubmit = async (data: InventoryData) => {
    try {
      setApiErrors({}); // Clear previous API errors
      
      // Get authentication token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      if (!token) {
        showNotification('No authentication token found. Please log in again.', 'error');
        return;
      }
      
      // Convert dayjs date to string format for API
      const formattedData = {
        ...data,
        dateAdded: data.dateAdded ? data.dateAdded.format('YYYY-MM-DD') : ''
      };
      
      // Make API call with authentication
      await axios.post('http://127.0.0.1:8000/api/inventory/', formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      showNotification('Inventory item saved successfully!', 'success');
      handleReset(); // Clear all fields including select fields
    } catch (err: any) {
      console.error('Error saving inventory item:', err);
      
      if (err.response?.status === 401) {
        showNotification('Authentication required. Please login first.', 'error');
      } else if (err.response?.data?.errors) {
        // Handle validation errors from API
        setApiErrors(err.response.data.errors);
      } else {
        showNotification('Failed to save inventory item', 'error');
      }
    }
  };

  const handleReset = () => {
    // Reset all form fields to default values and clear all form state
    reset({
      itemName: '',
      unitOfMeasure: '',
      dateAdded: dayjs() // Keep today's date as default
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
            Inventory Registration Form
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="mt-4">
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
              {/* Row 1 - Date First */}
              <div className="flex gap-4">
                <Controller
                  name="dateAdded"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label={<RequiredLabel label="Date" />}
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      disableFuture
                      slotProps={{
                        textField: {
                          size: 'small',
                          variant: 'outlined',
                          fullWidth: true,
                          error: !!errors.dateAdded || !!apiErrors.dateAdded,
                          helperText: errors.dateAdded?.message || (apiErrors.dateAdded && apiErrors.dateAdded[0])
                        }
                      }}
                    />
                  )}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  label={<RequiredLabel label="Item Name" />}
                  fullWidth
                  {...register('itemName')}
                  error={!!errors.itemName || !!apiErrors.itemName}
                  helperText={errors.itemName?.message || (apiErrors.itemName && apiErrors.itemName[0])}
                  autoComplete="off"
                />
              </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                variant="outlined"
                label={<RequiredLabel label="Unit of Measure" />}
                fullWidth
                select
                {...register('unitOfMeasure')}
                error={!!errors.unitOfMeasure || !!apiErrors.unitOfMeasure}
                helperText={errors.unitOfMeasure?.message || (apiErrors.unitOfMeasure && apiErrors.unitOfMeasure[0])}
              >
                {unitOfMeasureOptions.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
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

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Inventory Item'}
                </Button>
              </Box>
            </form>
          </div>
        </LocalizationProvider>

      </Paper>
    </Box>
  );
};

export default InventoryItem