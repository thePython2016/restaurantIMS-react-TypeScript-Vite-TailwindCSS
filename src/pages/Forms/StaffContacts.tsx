import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Card, CardContent } from "@mui/material";

// Sample contact data
const contacts = [
  { id: 1, name: "John Doe", phone: "0712345678", email: "john@example.com", department: "HR" },
  { id: 2, name: "Jane Smith", phone: "0723456789", email: "jane@example.com", department: "IT" },
  { id: 3, name: "Michael Brown", phone: "0734567890", email: "michael@example.com", department: "Finance" },
  // Add more contacts as needed
];

// Define columns for the table
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "department", headerName: "Department", width: 150 },
];

const StaffContacts = () => {
  return (
    <Card sx={{ m: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Staff Contact Details
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={contacts}
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

export { StaffContacts };
