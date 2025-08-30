import React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';

// Define validation schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('Region is required'),
});

type CustomerFormData = yup.InferType<typeof schema>;

const tanzaniaRegions = [
  'Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya', 'Morogoro'
];

const Customer: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: CustomerFormData) => {
    console.log('Submitted Customer:', data);
    reset();
  };

  return (
    <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6 }}>
      <Paper elevation={3} className="w-full max-w-6xl p-8 mx-auto">
        <Typography
          variant="h5"
          className="text-left font-bold"
          sx={{
            mb: 4,
            pb: 1,
            borderBottom: '1px solid #ccc',
          }}
        >
          Customer Registration Form
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1 */}
          <div className="flex gap-6">
            <TextField
              label={<span>Full Name <span style={{ color: 'red' }}>*</span></span>}
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label={<span>Phone <span style={{ color: 'red' }}>*</span></span>}
              fullWidth
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </div>

          {/* Row 2 */}
          <div className="flex gap-6">
            <TextField
              label={<span>Address <span style={{ color: 'red' }}>*</span></span>}
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
                  label={<span>Region <span style={{ color: 'red' }}>*</span></span>}
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
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Customer;
