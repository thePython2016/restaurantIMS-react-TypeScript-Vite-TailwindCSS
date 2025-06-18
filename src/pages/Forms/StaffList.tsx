import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const StaffList: React.FC = () => {
  const staffData = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Manager',
      email: 'john@example.com',
      phone: '+255123456789',
      address: 'Mikocheni Street',
      city: 'Dar es Salaam',
      salary: 5000,
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Supervisor',
      email: 'jane@example.com',
      phone: '+255987654321',
      address: 'Arusha Town',
      city: 'Arusha',
      salary: 4000,
    },
    // Add more staff as needed
  ];

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'city', headerName: 'Region', flex: 1 },
    { field: 'salary', headerName: 'Salary', type: 'number', flex: 1 },
  ];

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-6xl p-6 mx-auto">
        <Typography variant="h5" className="mb-4 text-center font-bold">
          Staff List
        </Typography>

        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={staffData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
          />
        </div>
      </Paper>
    </Box>
  );
};

export default StaffList;
