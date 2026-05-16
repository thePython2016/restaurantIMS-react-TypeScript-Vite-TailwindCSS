import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address?: string;
}

const Demo: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/customers/', {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch customers');
        setLoading(false);
      });
  }, []);

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-4xl p-8">
        <Typography variant="h5" className="text-left font-bold" sx={{ mb: 4, pb: 1, borderBottom: '1px solid #ccc' }}>
          Customer Info
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && customers.length === 0 && (
          <Typography>No customers found.</Typography>
        )}

        {!loading && !error && customers.map((customer) => (
          <Box key={customer.id} className="mb-4 p-4 border rounded bg-white shadow">
            <Typography variant="subtitle1" fontWeight="bold">
              {customer.first_name} {customer.last_name}
            </Typography>
            <Typography variant="body2">Phone: {customer.phone}</Typography>
            <Typography variant="body2">Email: {customer.email}</Typography>
            {customer.address && (
              <Typography variant="body2">Address: {customer.address}</Typography>
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default Demo;
