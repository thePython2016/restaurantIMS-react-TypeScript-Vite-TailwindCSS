import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type MenuItemData = {
  name: string;
  category: string;
  description: string;
  price: number;
  availability: string;
};

const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];
const availabilityOptions = ['Available', 'Out of Stock'];

const schema = yup.object().shape({
  name: yup.string().required('Item name is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Must be positive')
    .required('Price is required'),
  availability: yup.string().required('Availability is required'),
});

const MenuItems: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<MenuItemData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      price: 0,
      availability: '',
    },
  });

  const onSubmit = (data: MenuItemData) => {
    console.log(data);
    reset();
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-4xl p-8">
        <Typography variant="h5" align="left" fontWeight={700} mb={1}>
          Menu Item
        </Typography>
        <Box sx={{ borderBottom: '1px solid #ededed', mb: 3 }} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-6">
            <TextField
              label="Item Name *"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Category *"
              select
              fullWidth
              value={watch('category') ?? ''}
              {...register('category')}
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="flex gap-6">
            <TextField
              label="Price (Tsh) *"
              type="number"
              fullWidth
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Availability *"
              select
              fullWidth
              value={watch('availability') ?? ''}
              {...register('availability')}
              error={!!errors.availability}
              helperText={errors.availability?.message}
            >
              <MenuItem value="">Select Availability</MenuItem>
              {availabilityOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <TextField
            label="Description *"
            fullWidth
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }}>
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default MenuItems;
