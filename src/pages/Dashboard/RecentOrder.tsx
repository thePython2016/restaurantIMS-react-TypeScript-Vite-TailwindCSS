import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'firstName', headerName: 'First name', width: 150 },
  { field: 'lastName', headerName: 'Last name', width: 150 },
  { field: 'age', headerName: 'Age', width: 110 },
  { field: 'fullName', headerName: 'Full name', width: 160 },
];

const rows = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 30, fullName: 'John Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25, fullName: 'Jane Smith' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', age: 45, fullName: 'Bob Johnson' },
];

const RecentOrder: React.FC = () => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 5, page: 0 },
        },
      }}
      pageSizeOptions={[5, 10, 25, 50]}
      disableRowSelectionOnClick
      sx={{
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid rgba(224, 224, 224, 1)',
        },
      }}
    />
  );
};

export default RecentOrder; 