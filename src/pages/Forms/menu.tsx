import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { ListIcon } from '../../icons';

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
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MenuItemData>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const handleAddNewMenu = () => {
    navigate('/menu-list');
  };

  const onSubmit = (data: MenuItemData) => {
    console.log(data);
    reset();
  };

  return (
    <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6 }}>


      <Paper elevation={3} className="w-full max-w-6xl p-8 mx-auto">
        <Box display="flex" alignItems="center" className="mb-10 pb-4 border-b border-gray-200">
          <ListIcon style={{ width: 32, height: 32, marginRight: 12 }} />
          <Typography variant="h5" className="font-bold">
            Menu Item Form
          </Typography>
        </Box>

        <div className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Row 1 */}
            <div className="flex gap-6">
              <TextField
                label={<RequiredLabel label="Item Name" />}
                fullWidth
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label={<RequiredLabel label="Category" />}
                fullWidth
                select
                defaultValue=""
                {...register('category')}
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Row 2 */}
            <div className="flex gap-6">
              <TextField
                label={<RequiredLabel label="Price (Tsh)" />}
                type="number"
                fullWidth
                {...register('price')}
                error={!!errors.price}
                helperText={errors.price?.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Tsh</InputAdornment>,
                }}
              />
              <TextField
                label={<RequiredLabel label="Availability" />}
                fullWidth
                select
                defaultValue=""
                {...register('availability')}
                error={!!errors.availability}
                helperText={errors.availability?.message}
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
              label={<RequiredLabel label="Description" />}
              fullWidth
              multiline
              rows={3}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

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

export default MenuItems;
