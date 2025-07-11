import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { PieChartIcon } from '../../icons';
import MenuItemReport from './MenuItemList';
import OrderReport from './OrderList';
import CustomerReport from './CustomerList';
import SalesItemReport from './SalesItem';
import SalesCustomerReport from './SalesCustomer';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('');

  const reportOptions = [
    { value: 'menu-items', label: 'Menu Items Report', component: MenuItemReport },
    { value: 'order-report', label: 'Orders Report', component: OrderReport },
    { value: 'customer-report', label: 'Customers Report', component: CustomerReport },
    { value: 'sales-item-report', label: 'Sales by Item Report', component: SalesItemReport },
    { value: 'sales-customer-report', label: 'Sales by Customer Report', component: SalesCustomerReport },
  ];

  const handleReportChange = (event: any) => {
    setSelectedReport(event.target.value);
  };

  const selectedReportData = reportOptions.find(option => option.value === selectedReport);
  const ReportComponent = selectedReportData?.component;

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-7xl mx-auto p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} borderBottom="1px solid #ccc" pb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <PieChartIcon />
            <Typography variant="h5" fontWeight="bold">Reports Dashboard</Typography>
          </Box>
        </Box>

        {/* Report Selection Dropdown - Always Visible */}
        <Box sx={{ mb: 4, maxWidth: 400 }}>
          <FormControl fullWidth size="large">
            <InputLabel>Choose Report</InputLabel>
            <Select
              value={selectedReport}
              label="Choose Report"
              onChange={handleReportChange}
            >
              {reportOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Report Content Area */}
        <Box>
          {ReportComponent ? (
            <ReportComponent />
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Select a report type from the dropdown above to view detailed analytics and data.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Reports;
