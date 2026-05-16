import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedReport = event.target.value as string;
    setReportType(selectedReport);

    // Navigate to the specific report page
    navigate(selectedReport);
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-4xl mx-auto p-6">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Generate Report
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="report-type-label">Select Report Type</InputLabel>
          <Select
            labelId="report-type-label"
            value={reportType}
            label="Select Report Type"
            onChange={handleChange}
          >
            <MenuItem value="/sales by Item details report">Sales by Item Report</MenuItem>
            <MenuItem value="/sales by Customer details report">Sales by Customer Report</MenuItem>
            <MenuItem value="/invoice Report">Invoice Report</MenuItem>
            <MenuItem value="/order report">Order Report</MenuItem>
            <MenuItem value="/customer report">Customer Report</MenuItem>
            <MenuItem value="/staff report">Staff Report</MenuItem>
            <MenuItem value="/item report">Menu Items Report</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default Reports;
