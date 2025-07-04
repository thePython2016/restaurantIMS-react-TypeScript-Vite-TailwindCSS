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
import BarChartOne from "../../components/charts/bar/BarChartOne";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PieChart from "../../components/charts/pie/pieChart";
import { SelectChangeEvent } from '@mui/material/Select';

const cardStyle = {
  background: '#f7f7f9',
  padding: 16,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const Charts: React.FC = () => {
  
  

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-7xl mx-auto p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} borderBottom="1px solid #ccc" pb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <PieChartIcon />
            <Typography variant="h5" fontWeight="bold">Charts Dashboard</Typography>
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
            <div style={cardStyle}>
              <BarChartOne />
            </div>
            <div
              style={{
                ...cardStyle,
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
            <div style={cardStyle}>
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
