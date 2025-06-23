import React from 'react';
import {
  TextField,
  Button,
  MenuItem as MuiMenuItem,
  Paper,
  Typography,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useForm } from 'react-hook-form';

// ✅ Case-sensitive function
function menuItem(data) {
  console.log('📦 New Menu Item:', data);
}

export default function MenuItemForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    menuItem(data);
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Paper elevation={4} className="p-8 w-full max-w-md rounded-2xl shadow-xl">
        <div className="flex items-center mb-4 gap-2">
          <RestaurantMenuIcon className="text-blue-600" />
          <Typography variant="h5" className="text-blue-700 font-semibold">
            Add Menu Item
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <TextField
            label="Item Name"
            fullWidth
            {...register('name', { required: true })}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...register('description')}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            inputProps={{ min: 0, step: '0.01' }}
            {...register('price', { required: true })}
          />

          <TextField
            label="Category"
            select
            fullWidth
            defaultValue=""
            {...register('category', { required: true })}
          >
            <MuiMenuItem value="Appetizer">Appetizer</MuiMenuItem>
            <MuiMenuItem value="Main Course">Main Course</MuiMenuItem>
            <MuiMenuItem value="Dessert">Dessert</MuiMenuItem>
            <MuiMenuItem value="Drink">Drink</MuiMenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            className="!bg-blue-600 hover:!bg-blue-700 text-white mt-2"
            fullWidth
          >
            Add Item
          </Button>
        </form>
      </Paper>
    </div>
  );
}
