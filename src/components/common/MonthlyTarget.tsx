import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));
const MonthlyTarget: React.FC = () => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Monthly Target
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1">
            Current Progress
          </Typography>
          <Typography variant="subtitle1" color="primary">
            75%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={75} />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Target: $100,000
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Achieved: $75,000
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default MonthlyTarget;
