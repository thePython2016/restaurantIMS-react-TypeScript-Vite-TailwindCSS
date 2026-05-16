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
import MenuItemReport from './ItemList';
import OrderReport from './OrderList';
import CustomerReport from './CustomerList';
import SalesItemReport from './SalesItem';
import SalesCustomerReport from './SalesCustomer';
import BarChartOne from "../../components/charts/bar/BarChartOne";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PieChart from "../../components/charts/pie/pieChart";
import { SelectChangeEvent } from '@mui/material/Select';

const Charts: React.FC = () => {
  
  

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
      <Paper elevation={3} className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} borderBottom="1px solid #ccc" pb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <PieChartIcon />
            <Typography variant="h5" fontWeight="bold" className="text-gray-800 dark:text-white">Charts Dashboard</Typography>
          </Box>
        </Box>

        {/* Report Selection Dropdown - Always Visible */}
        <div className="charts">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 16,
              alignItems: 'stretch',
            }}
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <BarChartOne />
            </div>
            <div
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
              style={{
                gridColumn: 2,
                gridRow: '1 / span 2',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PieChart />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <LineChartOne />
            </div>
          </div>
        </div>
        {/* Report Content Area */}
      
      </Paper>
    </Box>
  );
};

export default Charts;
