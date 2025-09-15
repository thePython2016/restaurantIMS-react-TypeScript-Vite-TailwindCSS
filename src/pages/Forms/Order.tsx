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
  CircularProgress,
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

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

const OrderForm = () => {
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const price = (menuPrices as Record<string, number>)[menuItem as keyof typeof menuPrices] || 0;
    const qty = Number(quantity) || 0;
    setAmount(price * qty);
  }, [menuItem, quantity]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const orderData = { ...data, amount };
      console.log('Order submitted:', orderData);
      // Submission logic here
    } finally {
      setIsSubmitting(false);
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
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Order Form
          </Typography>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', mb: 0 }} />
        </Box>

        <div className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="Customer Name" />}
                fullWidth
                {...register('customerName')}
                error={!!errors.customerName}
                helperText={errors.customerName?.message as string}
              />
              <FormControl fullWidth error={!!errors.menuItem} size="small">
                <InputLabel>
                  <RequiredLabel label="Menu Item" />
                </InputLabel>
                <Select
                  label={<RequiredLabel label="Menu Item" /> as unknown as string}
                  native={false}
                  defaultValue=""
                  {...register('menuItem')}
                >
                  {Object.keys(menuPrices).map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label={<RequiredLabel label="Quantity" />}
                type="number"
                fullWidth
                {...register('quantity')}
                error={!!errors.quantity}
                helperText={errors.quantity?.message as string}
                inputProps={{ min: 1 }}
              />
              <TextField
                size="small"
                label="Amount (TSh)"
                fullWidth
                value={amount}
                InputProps={{ readOnly: true }}
              />
            </div>

            {/* Row 3 */}
            <div className="flex gap-4">
              <TextField
                size="small"
                label="Notes (optional)"
                fullWidth
                {...register('notes')}
                multiline
                rows={3}
              />
              <div className="w-full" />
            </div>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </Button>
            </Box>
          </form>
        </div>
      </Paper>
    </Box>
  );
};

export default OrderForm;
