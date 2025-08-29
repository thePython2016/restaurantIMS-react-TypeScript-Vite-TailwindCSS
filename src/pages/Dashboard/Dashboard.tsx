import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import StaffCard from '../../components/common/StaffCard';
import MonthlyTarget from '../../components/common/MonthlyTarget';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" mb={4}>
        Dashboard
      </Typography>
      
      {/* Top Cards Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StaffCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StaffCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StaffCard />
        </Grid>
      </Grid>

      {/* Monthly Target */}
      <MonthlyTarget />
    </Box>
  );
};

export default Dashboard;
