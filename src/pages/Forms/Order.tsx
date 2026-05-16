import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  FormHelperText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  orderDate: yup.mixed().required('Order date is required'),
  menuItem: yup.string().required('Menu item is required'),
  notes: yup.string().notRequired(),
});

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red', marginLeft: 2 }}>*</span>
  </>
);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface MenuItemDto {
  id?: number;
  itemID?: number;
  name: string;
  price: number;
}

const today = () => dayjs();

const OrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<{ id: string | number; fullName: string }[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerName: '',
      orderDate: today(),
      menuItem: '',
      notes: '',
    },
  });

  const menuItem = watch('menuItem') as string;
  const [quantity, setQuantity] = useState<number>(1);

  const priceMap = useMemo(() => {
    const map: Record<string, number> = {};
    menuItems.forEach(mi => { map[mi.name] = mi.price; });
    return map;
  }, [menuItems]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }, [items]);

  useEffect(() => {
    setItemsError(null);
  }, [items]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        setMenuError(null);
        const response = await fetch('http://127.0.0.1:8000/api/item/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setMenuError('Failed to load menu items');
        setMenuItems([]);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [accessToken]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        setCustomerError(null);
        const response = await fetch('http://127.0.0.1:8000/api/customer/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const mapped = list
          .map((c: any) => ({
            id: c.customerID ?? c.id,
            fullName: c.fullname ?? c.fullName ?? c.name,
          }))
          .filter((c: any) => c.fullName);
        setCustomers(mapped);
      } catch (e: any) {
        setCustomerError('Failed to load customers');
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, [accessToken]);

  const handleAddItem = () => {
    if (!menuItem) return;
    const qty = Math.max(1, quantity || 1);
    const price = priceMap[menuItem] || 0;

    setItems((prev) => {
      const existingIndex = prev.findIndex((it) => it.name === menuItem);
      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qty,
        };
        return next;
      }
      return [...prev, { name: menuItem, quantity: qty, price }];
    });

    setValue('menuItem', '');
    setQuantity(1);
  };

  const handleRemoveItem = (name: string) => {
    setItems((prev) => prev.filter((it) => it.name !== name));
  };

  const handleChangeItemQty = (name: string, qty: number) => {
    const safeQty = Math.max(1, Number(qty) || 1);
    setItems((prev) =>
      prev.map((it) => (it.name === name ? { ...it, quantity: safeQty } : it))
    );
  };

  const onSubmit = async (data: any) => {
    if (items.length === 0) {
      setItemsError('Please add at least one menu item');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: data.customerName,
        orderDate: dayjs.isDayjs(data.orderDate) ? data.orderDate.format('YYYY-MM-DD') : data.orderDate,
        notes: data.notes,
        items,
        totalAmount,
      };
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
            <div className="flex gap-4 w-full">
              <FormControl
                fullWidth
                size="small"
                error={!!(errors as any)?.customerName || !!customerError}
                disabled={loadingCustomers}
              >
                <InputLabel>{<RequiredLabel label="Customer Name" /> as unknown as string}</InputLabel>
                <Select
                  label={<RequiredLabel label="Customer Name" /> as unknown as string}
                  value={watch('customerName') as string}
                  onChange={(e: any) => setValue('customerName', e.target.value)}
                  displayEmpty={false}
                >
                  {loadingCustomers && (
                    <MenuItem disabled value="">
                      Loading customers...
                    </MenuItem>
                  )}
                  {!!customerError && !loadingCustomers && (
                    <MenuItem disabled value="">
                      Failed to load customers
                    </MenuItem>
                  )}
                  {!loadingCustomers && !customerError && customers.length === 0 && (
                    <MenuItem disabled value="">
                      No customers found
                    </MenuItem>
                  )}
                  {customers.map((c) => (
                    <MenuItem key={c.id} value={c.fullName}>
                      {c.fullName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {(errors as any)?.customerName?.message || customerError || ''}
                </FormHelperText>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="orderDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label={<RequiredLabel label="Order Date" /> as unknown as string}
                      value={field.value as Dayjs}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!(errors as any)?.orderDate,
                          helperText: (errors as any)?.orderDate?.message as string,
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <FormControl fullWidth size="small" disabled={loadingMenu || !!menuError} error={!!(errors as any)?.menuItem}>
                <InputLabel>
                  Menu Item
                </InputLabel>
                <Select
                  label={"Menu Item" as unknown as string}
                  native={false}
                  value={watch('menuItem') as string}
                  onChange={(e: any) => setValue('menuItem', e.target.value)}
                >
                  {menuItems.map((item) => (
                    <MenuItem key={item.itemID || item.id || item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {(errors as any)?.menuItem?.message as string || ''}
                </FormHelperText>
              </FormControl>
              <TextField
                size="small"
                label={<RequiredLabel label="Quantity" />}
                type="number"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  disabled={!watch('menuItem')}
                >
                  Add Item
                </Button>
              </Box>
            </div>

            {/* Items summary */}
            <div>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Line Total</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" style={{ color: '#6b7280' }}>
                          No items added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((it) => (
                        <TableRow key={it.name}>
                          <TableCell>{it.name}</TableCell>
                          <TableCell align="right">{it.price.toLocaleString()} Tsh</TableCell>
                          <TableCell align="right" style={{ width: 120 }}>
                            <TextField
                              size="small"
                              type="number"
                              value={it.quantity}
                              onChange={(e) => handleChangeItemQty(it.name, Number(e.target.value))}
                              inputProps={{ min: 1 }}
                              sx={{ width: 90 }}
                            />
                          </TableCell>
                          <TableCell align="right">{(it.price * it.quantity).toLocaleString()} Tsh</TableCell>
                          <TableCell align="right">
                            <IconButton aria-label="remove" onClick={() => handleRemoveItem(it.name)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    <TableRow>
                      <TableCell colSpan={3} align="right" style={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell align="right" style={{ fontWeight: 700 }}>
                        {totalAmount.toLocaleString()} Tsh
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {itemsError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>{itemsError}</Typography>
              )}
              {menuError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>{menuError}</Typography>
              )}
            </div>

            {/* Notes */}
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