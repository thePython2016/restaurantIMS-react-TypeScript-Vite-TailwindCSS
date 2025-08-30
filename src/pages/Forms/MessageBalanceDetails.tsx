import React, { useEffect, useState } from "react";
import { Box, Divider, Alert, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../../context/AuthContext";

interface BalanceRow {
  id: number;
  companyId: string;
  initialBalance: number;
  availableBalance: number;
  createdAt: string;
  updatedAt: string;
}

export default function MessageBalanceDetails() {
  const [rows, setRows] = useState<BalanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, accessToken } = useAuth();

  // Django backend URL
  const DJANGO_API_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Check if user is authenticated
        if (!accessToken) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${DJANGO_API_URL}/api/v1/sms/balance/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Authentication failed. Please log in again.");
          } else if (res.status === 403) {
            setError("Access denied. You don't have permission to view SMS balance.");
          } else {
            setError(`HTTP error! status: ${res.status}`);
          }
          return;
        }

        const data = await res.json();
        console.log('API Response:', data); // Debug log

        // Handle the actual API response structure
        console.log('Full API Response:', JSON.stringify(data, null, 2)); // Debug full response
        
        if (data.success && data.balance) {
          const balanceData = data.balance;
          console.log('Balance Data:', balanceData); // Debug log
          console.log('Initial Balance:', balanceData.initial_balance, 'Type:', typeof balanceData.initial_balance);
          console.log('Available Balance:', balanceData.available_balance, 'Type:', typeof balanceData.available_balance);
          
          const rowData = {
            id: parseInt(balanceData.id) || 1,
            companyId: balanceData.company_id || 'Mambo SMS',
            initialBalance: parseFloat(balanceData.initial_balance) || 0,
            availableBalance: parseFloat(balanceData.available_balance) || 0,
            createdAt: balanceData.created_at ? new Date(balanceData.created_at).toLocaleString() : new Date().toLocaleString(),
            updatedAt: balanceData.updated_at ? new Date(balanceData.updated_at).toLocaleString() : new Date().toLocaleString(),
          };
          
          console.log('Row Data:', rowData); // Debug log
          setRows([rowData]);
        } else if (data.balance) {
          // Fallback: if success field is not present but balance data exists
          const balanceData = data.balance;
          console.log('Fallback Balance Data:', balanceData); // Debug log
          
          const rowData = {
            id: parseInt(balanceData.id) || 1,
            companyId: balanceData.company_id || 'Mambo SMS',
            initialBalance: parseFloat(balanceData.initial_balance) || 0,
            availableBalance: parseFloat(balanceData.available_balance) || 0,
            createdAt: balanceData.created_at ? new Date(balanceData.created_at).toLocaleString() : new Date().toLocaleString(),
            updatedAt: balanceData.updated_at ? new Date(balanceData.updated_at).toLocaleString() : new Date().toLocaleString(),
          };
          
          console.log('Fallback Row Data:', rowData); // Debug log
          setRows([rowData]);
        } else if (data.raw_data) {
          // Try to extract from raw_data if balance is not directly available
          const rawData = data.raw_data;
          console.log('Raw Data:', rawData); // Debug log
          
          if (rawData.initial_balance !== undefined || rawData.available_balance !== undefined) {
            const rowData = {
              id: parseInt(rawData.id) || 1,
              companyId: rawData.company_id || 'Mambo SMS',
              initialBalance: parseFloat(rawData.initial_balance) || 0,
              availableBalance: parseFloat(rawData.available_balance) || 0,
              createdAt: rawData.created_at ? new Date(rawData.created_at).toLocaleString() : new Date().toLocaleString(),
              updatedAt: rawData.updated_at ? new Date(rawData.updated_at).toLocaleString() : new Date().toLocaleString(),
            };
            
            console.log('Raw Data Row:', rowData); // Debug log
            setRows([rowData]);
          } else {
            setError("Balance data not found in response.");
          }
        } else {
          setError("No balance data available.");
        }
      } catch (err: any) {
        console.error("Error fetching SMS balance:", err);
        if (err.name === 'TypeError' && err.message.includes('JSON')) {
          setError("Invalid response from server. Please try again later.");
        } else {
          setError(err.message || "Failed to fetch SMS balance.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBalance();
    } else {
      setError("Please log in to view SMS balance.");
      setLoading(false);
    }
  }, [user, DJANGO_API_URL, accessToken]);

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "companyId", headerName: "Company ID", flex: 1, minWidth: 120 },
    {
      field: "initialBalance",
      headerName: "Initial Balance",
      flex: 1,
      minWidth: 150,
      valueFormatter: ({ value }: { value: number }) => {
        if (value === null || value === undefined || isNaN(value)) {
          return '0';
        }
        return numberFormat(value);
      },
    },
    {
      field: "availableBalance",
      headerName: "Available Balance",
      flex: 1,
      minWidth: 150,
      valueFormatter: ({ value }: { value: number }) => {
        if (value === null || value === undefined || isNaN(value)) {
          return '0';
        }
        return numberFormat(value);
      },
    },
    { field: "createdAt", headerName: "Created At", flex: 1.2, minWidth: 200 },
    { field: "updatedAt", headerName: "Updated At", flex: 1.2, minWidth: 200 },
  ];

  return (
    <Box className="flex flex-col min-h-screen p-4" sx={{ mt: 6 }}>
      <Paper elevation={3} className="w-full max-w-6xl p-8 mx-auto">
        <Typography variant="h5" gutterBottom>
          SMS Balance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Overview of your available SMS credits
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{ border: 0 }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

const numberFormat = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
