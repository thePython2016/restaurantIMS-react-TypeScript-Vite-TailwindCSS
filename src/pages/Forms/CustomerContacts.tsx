import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Card, CardContent } from "@mui/material";

// Sample customer data
const customers = [
  { id: 1, name: "Alice Johnson", phone: "0711000001", email: "alice@example.com", city: "Nairobi" },
  { id: 2, name: "Bob Williams", phone: "0711000002", email: "bob@example.com", city: "Mombasa" },
  { id: 3, name: "Catherine Lee", phone: "0711000003", email: "catherine@example.com", city: "Kisumu" },
  // Add more customers as needed
];

// Define columns for the table
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "city", headerName: "City", width: 150 },
];

const CustomerContacts = () => {
  return (
    <Card sx={{ m: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Customer Contact Details
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={customers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export { CustomerContacts };
