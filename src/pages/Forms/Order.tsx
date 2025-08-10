import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const menuPrices = {
  'Chicken Burger': 8500,
  'Mango Juice': 3000,
  'Veggie Pizza': 9500,
  'Coffee': 2000,
  'Fruit Salad': 4000,
};

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  menuItem: yup.string().required('Menu item is required'),
  quantity: yup.number().required('Quantity is required').min(1),
  notes: yup.string().notRequired(),
});

const OrderForm = () => {
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerName: '',
      menuItem: '',
      quantity: 1,
      notes: '',
    },
  });

  const menuItem = watch('menuItem');
  const quantity = watch('quantity');

  useEffect(() => {
    const price = menuPrices[menuItem] || 0;
    setAmount(price * quantity);
  }, [menuItem, quantity]);

  const onSubmit = (data) => {
    const orderData = { ...data, amount };
    console.log('Order submitted:', orderData);
    // Submission logic here
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/order')}
        >
          Add Order
        </Button>
      </div>
      <Box className="flex flex-col min-h-screen bg-gray-100 p-4 pt-12">
        <Paper elevation={3} className="w-full max-w-4xl p-8 mx-auto">
          <Typography variant="h5" sx={{ mb: 4, pb: 2, borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 700 }}>
            Order Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex gap-6">
              <TextField
                label={<><span>Customer Name</span><span style={{color: 'red'}}>*</span></>}
                fullWidth
                {...register('customerName')}
                error={!!errors.customerName}
                helperText={errors.customerName?.message}
              />
              <FormControl fullWidth error={!!errors.menuItem}>
                <InputLabel>
                  <span>Menu Item</span><span style={{color: 'red'}}>*</span>
                </InputLabel>
                <Select
                  label={<><span>Menu Item</span><span style={{color: 'red'}}>*</span></>}
                  {...register('menuItem')}
                  defaultValue=""
                >
                  {Object.keys(menuPrices).map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex gap-6">
              <TextField
                label={<><span>Quantity</span><span style={{color: 'red'}}>*</span></>}
                type="number"
                fullWidth
                {...register('quantity')}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Amount (Tsh)"
                fullWidth
                value={amount}
                InputProps={{ readOnly: true }}
              />
            </div>

            <div className="flex gap-6">
              <TextField
                label="Notes (optional)"
                fullWidth
                {...register('notes')}
                multiline
                rows={3}
              />
              <div className="w-full" /> {/* empty space for alignment */}
            </div>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit Order
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default OrderForm;
