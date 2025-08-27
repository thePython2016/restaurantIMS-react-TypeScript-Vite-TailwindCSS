import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import UserCircleIcon from '../../icons/user-circle.svg';

interface StaffFormData {
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  salary: number;
}

const positions = [
  'Manager',
  'Supervisor',
  'Staff',
  'Intern'
];

const tanzaniaRegions = [
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Dodoma',
  'Mbeya'
];

const preventNumberInput = (e: React.KeyboardEvent) => {
  if (!isNaN(Number(e.key))) {
    e.preventDefault();
  }
};

const schema = yup.object({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('Region is required'),
  salary: yup.number().required('Salary is required')
});

// Helper component to add red asterisk to required fields
const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

// Format phone number with spaces after certain digits: e.g. "712 345 678"
const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: yupResolver(schema),
  });

  const handleAddNewStaff = () => {
    navigate('/staff-list');
  };

  const onSubmit = (data: StaffFormData) => {
    let phone = data.phone.replace(/\s/g, ''); // remove spaces
    if (phone.startsWith('+255')) {
      phone = phone.slice(4);
    }
    // Prepare data for backend
    const submitData = { ...data, phone };
    console.log(submitData);
    reset();
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4" sx={{ mt: 6 }}>
      <div className="flex justify-end mb-6">
        <Button
          variant="contained"
          color="primary"
          startIcon={<span className="text-xl">+</span>}
          className="bg-blue-600 hover:bg-blue-700"
            onClick={handleAddNewStaff}
        >
            Add New Staff
        </Button>
        </div>

      <Paper elevation={3} className="w-full max-w-4xl p-8 mx-auto">
        <Box display="flex" alignItems="center" className="mb-10 pb-4 border-b border-gray-200">
          <img src={UserCircleIcon} alt="Staff Icon" style={{ width: 32, height: 32, marginRight: 12 }} />
          <Typography variant="h5" className="font-bold">
          Staff Registration Form
        </Typography>
        </Box>
        <div className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Row 1 */}
            <div className="flex gap-6">
                <TextField
                label={<RequiredLabel label="Full Name" />}
                  fullWidth
                {...register('name')}
                onKeyDown={preventNumberInput}
                error={!!errors.name}
                helperText={errors.name?.message}
                />
                <TextField
                label={<RequiredLabel label="Position" />}
                  fullWidth
                select
                {...register('position')}
                onKeyDown={preventNumberInput}
                error={!!errors.position}
                helperText={errors.position?.message}
              >
                {positions.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Row 2 */}
            <div className="flex gap-6">
                <TextField
                label={<RequiredLabel label="Email" />}
                type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                label={<RequiredLabel label="Phone" />}
                  fullWidth
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
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
                />
              </div>

            {/* Row 3 */}
            <div className="flex gap-6">
                <TextField
                label={<RequiredLabel label="Address" />}
                  fullWidth
                {...register('address')}
                onKeyDown={preventNumberInput}
                error={!!errors.address}
                helperText={errors.address?.message}
                />
                <TextField
                label={<RequiredLabel label="Region" />}
                  select
                  fullWidth
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
                >
                {tanzaniaRegions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
                </TextField>
            </div>

            {/* Row 4 */}
            <div className="flex gap-6">
                <TextField
                label={<RequiredLabel label="Salary" />}
                type="number"
                  fullWidth
                  {...register('salary')}
                  error={!!errors.salary}
                  helperText={errors.salary?.message}
                />
              <div className="w-full" /> {/* empty space */}
            </div>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button type="submit" variant="contained" color="primary" size="medium">
                Save
              </Button>
            </Box>
          </form>
        </div>
      </Paper>
    </Box>
  );
};

export default Staff;
