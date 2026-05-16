import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';

interface StaffFormData {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  salary: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: { [key: string]: string[] };
}

const positions = ['Manager', 'Supervisor', 'Staff', 'Intern'];

const tanzaniaRegions = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi',
  'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Morogoro',
  'Mtwara', 'Mwanza', 'Njombe', 'Pemba North', 'Pemba South', 'Pwani',
  'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe',
  'Tabora', 'Tanga', 'Unguja North', 'Unguja South'
];

const preventNumberInput = (e: React.KeyboardEvent) => {
  if (!isNaN(Number(e.key)) && e.key !== ' ' && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
    e.preventDefault();
  }
};

const schema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters')
    .required('Last name is required'),
  position: yup.string().required('Position is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .matches(/^\d{3}\s\d{3}\s\d{3}$/, 'Phone must be 9 digits (format: 123 456 789)')
    .required('Phone is required'),
  address: yup
    .string()
    .min(5, 'Address must be at least 5 characters')
    .required('Address is required'),
  city: yup.string().required('Region is required'),
  salary: yup
    .number()
    .positive('Salary must be positive')
    .min(100000, 'Minimum salary is 100,000 TSh')
    .required('Salary is required'),
});

// API Service for POST request
const createStaff = async (data: StaffFormData, accessToken: string): Promise<ApiResponse> => {
  try {
    if (!accessToken) {
      return {
        success: false,
        message: 'No authentication token found. Please log in again.',
        errors: {}
      };
    }

    const response = await fetch('http://localhost:8000/api/staff/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to create staff member',
        errors: result.errors || {}
      };
    }

    return result;
  } catch (error) {
    console.error('Network error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please check your connection.',
      errors: {}
    };
  }
};

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  let formatted = '';

  if (digits.length <= 3) {
    formatted = digits;
  } else if (digits.length <= 6) {
    formatted = digits.slice(0, 3) + ' ' + digits.slice(3);
  } else if (digits.length <= 9) {
    formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
  } else {
    formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 9);
  }

  return formatted;
};

const Staff: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
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
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: yupResolver(schema),
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

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const onSubmit = async (data: StaffFormData) => {
    try {
      // Clear previous API errors
      setApiErrors({});

      // Format phone number for API
      let phone = data.phone.replace(/\s/g, '');
      if (phone.startsWith('+255')) {
        phone = phone.slice(4);
      }
      
      const submitData = { 
        ...data, 
        phone: `+255${phone}`,
        region: data.city // Map city to region for backend
      };

      console.log('Submitting staff data:', submitData);

      // Call API
      if (!accessToken) {
        showNotification('Authentication required. Please log in again.', 'error');
        return;
      }
      
      const result = await createStaff(submitData, accessToken!);

      if (result.success) {
        showNotification('Staff member created successfully!', 'success');
        reset(); // Clear form
      } else {
        showNotification(result.message || 'Failed to create staff member', 'error');
        
        // Handle field-specific errors
        if (result.errors) {
          setApiErrors(result.errors);
          
          // Set form errors for specific fields
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof StaffFormData, {
                type: 'server',
                message: messages[0]
              });
            }
          });
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      showNotification('An unexpected error occurred. Please try again.', 'error');
    }
  };

  const handleReset = () => {
    reset();
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
            mb: 2
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Staff Registration Form
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

        <div className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="First Name" />}
                fullWidth
                {...register('firstName')}
                onKeyDown={preventNumberInput}
                error={!!errors.firstName || !!apiErrors.firstName}
                helperText={errors.firstName?.message || (apiErrors.firstName && apiErrors.firstName[0])}
                autoComplete="given-name"
              />
              <TextField
                size="small"
                label={<RequiredLabel label="Last Name" />}
                fullWidth
                {...register('lastName')}
                onKeyDown={preventNumberInput}
                error={!!errors.lastName || !!apiErrors.lastName}
                helperText={errors.lastName?.message || (apiErrors.lastName && apiErrors.lastName[0])}
                autoComplete="family-name"
              />
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="Position" />}
                fullWidth
                select
                {...register('position')}
                error={!!errors.position || !!apiErrors.position}
                helperText={errors.position?.message || (apiErrors.position && apiErrors.position[0])}
              >
                {positions.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                label={<RequiredLabel label="Email" />}
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email || !!apiErrors.email}
                helperText={errors.email?.message || (apiErrors.email && apiErrors.email[0])}
                autoComplete="email"
              />
            </div>

            {/* Row 3 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="Phone" />}
                fullWidth
                {...register('phone')}
                error={!!errors.phone || !!apiErrors.phone}
                helperText={errors.phone?.message || (apiErrors.phone && apiErrors.phone[0])}
                placeholder="123 456 789"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+255</InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.startsWith('+255')) {
                    val = val.slice(4);
                  }
                  val = formatPhoneNumber(val);
                  setValue('phone', val, { shouldValidate: true, shouldDirty: true });
                }}
                autoComplete="tel"
              />
              <TextField
                size="small"
                label={<RequiredLabel label="Address" />}
                fullWidth
                {...register('address')}
                error={!!errors.address || !!apiErrors.address}
                helperText={errors.address?.message || (apiErrors.address && apiErrors.address[0])}
                autoComplete="street-address"
              />
            </div>

            {/* Row 4 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="Region" />}
                select
                fullWidth
                {...register('city')}
                error={!!errors.city || !!apiErrors.region}
                helperText={errors.city?.message || (apiErrors.region && apiErrors.region[0])}
              >
                {tanzaniaRegions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                label={<RequiredLabel label="Salary (TSh)" />}
                type="number"
                fullWidth
                {...register('salary')}
                error={!!errors.salary || !!apiErrors.salary}
                helperText={errors.salary?.message || (apiErrors.salary && apiErrors.salary[0]) || 'Enter amount in Tanzanian Shillings'}
                InputProps={{
                  inputProps: { 
                    min: 100000, 
                    max: 50000000,
                    step: 10000
                  }
                }}
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
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="small"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Saving...' : 'Save Staff'}
              </Button>
            </Box>
          </form>
        </div>
      </Paper>

    </Box>
  );
};

export default Staff;