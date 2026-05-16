import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';

// Define validation schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Enter exactly 10 digits'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('Region is required'),
});

type CustomerFormData = yup.InferType<typeof schema>;

const tanzaniaRegions = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi',
  'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Morogoro',
  'Mtwara', 'Mwanza', 'Njombe', 'Pemba North', 'Pemba South', 'Pwani',
  'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe',
  'Tabora', 'Tanga', 'Unguja North', 'Unguja South'
];

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const Customer: React.FC = () => {
  const { accessToken } = useAuth();
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error'; }>(
    { open: false, message: '', severity: 'success' }
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: yupResolver(schema),
  });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
    if (severity === 'success') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, open: false }));
      }, 5000);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    

    if (!accessToken) {
      showNotification('Authentication required. Please log in again.', 'error');
      setSubmitting(false);
      return;
    }

    // Map form fields to API payload expected by Django (updated model)
    const payload = {
      fullname: data.name.trim(),
      phoneNumber: data.phone.trim().replace(/\D/g, '').slice(0, 10),
      physicalAddress: data.address.trim(),
      region: data.city,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/customer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        try {
          const errJson = await response.json();
          const fieldErrors = errJson || {};
          // Map backend field errors to form fields
          if (fieldErrors.phoneNumber && Array.isArray(fieldErrors.phoneNumber) && fieldErrors.phoneNumber.length > 0) {
            const phoneMsg = fieldErrors.phoneNumber[0];
            setError('phone', { type: 'server', message: phoneMsg });
            message = phoneMsg;
          } else if (fieldErrors.fullname && Array.isArray(fieldErrors.fullname) && fieldErrors.fullname.length > 0) {
            message = fieldErrors.fullname[0];
          } else if (typeof fieldErrors.detail === 'string') {
            message = fieldErrors.detail;
          }
        } catch (_) {
          try {
            message = await response.text();
          } catch {}
        }
        throw new Error(message);
      }

      showNotification('Customer created successfully!', 'success');
      reset();
    } catch (err: any) {
      const msg: string = err?.message || 'Failed to save customer.';
      setSubmitError(msg);
      showNotification(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6 }}>
      <Paper elevation={3} className="w-full max-w-6xl p-4 mx-auto">
        <Box
          sx={{ 
            backgroundColor: '#1976d2', 
            padding: '16px', 
            borderRadius: '8px', 
            mb: 2
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Customer Registration Form
          </Typography>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        {/* Display Success Message (same style as Staff form) */}
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

        {/* Display Error Message (if any) */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1 */}
          <div className="flex gap-4">
            <TextField
              size="small"
              label={<RequiredLabel label="Full Name" />}
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              size="small"
              label={<RequiredLabel label="Phone" />}
              fullWidth
              inputProps={{ maxLength: 10 }}
              {...register('phone', {
                onChange: (e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  e.target.value = digits;
                },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+255</InputAdornment>
                ),
              }}
            />
          </div>

          {/* Row 2 */}
          <div className="flex gap-4">
            <TextField
              size="small"
              label={<RequiredLabel label="Address" />}
              fullWidth
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            <Controller
              name="city"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label={<RequiredLabel label="Region" />}
                  select
                  fullWidth
                  error={!!errors.city}
                  helperText={errors.city?.message}
                >
                  {tanzaniaRegions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>

          {/* Save Button */}
          <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
            <Button type="submit" variant="contained" color="primary" size="small" disabled={submitting} startIcon={<AddIcon />}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Customer;
