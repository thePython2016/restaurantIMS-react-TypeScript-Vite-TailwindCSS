import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function SentMessages() {
  // Sample data (you can replace with API data)
  const rows = [
    { id: 1, recipient: "0713000000", message: "Hello John!", status: "Sent", date: "2025-08-27 18:00" },
    { id: 2, recipient: "0722000000", message: "Meeting at 3 PM", status: "Delivered", date: "2025-08-27 19:10" },
    { id: 3, recipient: "0733000000", message: "Payment received", status: "Sent", date: "2025-08-27 20:30" },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "recipient", headerName: "Recipient", flex: 1 },
    { field: "message", headerName: "Message", flex: 2 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "date", headerName: "Date Sent", flex: 1.5 },
  ];

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sent Messages
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              components={{ Toolbar: GridToolbar }} // includes export, filter, search
            />
                  </div>
      </CardContent>
    </Card>
  );
}
