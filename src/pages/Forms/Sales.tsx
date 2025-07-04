import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Sample menu items
const menuItems = [
  { name: 'Chicken Burger', price: 6000 },
  { name: 'Mango Juice', price: 3000 },
  { name: 'Veggie Pizza', price: 8000 },
  { name: 'Coffee', price: 2000 },
  { name: 'Fruit Salad', price: 4500 },
];

interface SalesFormData {
  customerName: string;
  menuItem: string;
  quantity: number;
  notes: string;
}

// Validation schema
const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  menuItem: yup.string().required('Menu item is required'),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  notes: yup.string().optional().default(''),
});

// Red asterisk helper
const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const Sales: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SalesFormData>({
    resolver: yupResolver(schema),
  });

  const quantity = watch('quantity') || 0;
  const selectedItem = menuItems.find((item) => item.name === watch('menuItem'));
  const amount = selectedItem ? quantity * selectedItem.price : 0;

  const onSubmit = (data: any) => {
    console.log('Sale Submitted:', { ...data, amount });
    reset();
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Typography variant="h5" mb={1} fontWeight={700}>
          Sales Form
        </Typography>
        <Box sx={{ borderBottom: '1px solid #ededed', mb: 3 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              label={<RequiredLabel label="Customer Name" />}
              fullWidth
              size="small"
              {...register('customerName')}
              error={!!errors.customerName}
              helperText={errors.customerName?.message}
              sx={{ flex: { sm: '0 0 48%', xs: '100%' } }}
            />

            <FormControl
              fullWidth
              size="small"
              error={!!errors.menuItem}
              sx={{ flex: { sm: '0 0 48%', xs: '100%' } }}
            >
              <InputLabel>
                <RequiredLabel label="Menu Item" />
              </InputLabel>
              <Select
                label="Menu Item"
                defaultValue=""
                {...register('menuItem')}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.name} value={item.name}>
                    {item.name} - {item.price.toLocaleString()} Tsh
                  </MenuItem>
                ))}
              </Select>
              {errors.menuItem && (
                <Typography color="error" variant="caption">
                  {errors.menuItem.message}
                </Typography>
              )}
            </FormControl>

            <TextField
              label={<RequiredLabel label="Quantity" />}
              type="number"
              fullWidth
              size="small"
              {...register('quantity')}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              sx={{ flex: { sm: '0 0 48%', xs: '100%' } }}
            />

            <TextField
              label="Total Amount (Tsh)"
              value={amount.toLocaleString()}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ flex: { sm: '0 0 48%', xs: '100%' } }}
            />

            <TextField
              label="Notes"
              multiline
              rows={3}
              fullWidth
              size="small"
              {...register('notes')}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button type="submit" variant="contained" size="small">
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Sales;
