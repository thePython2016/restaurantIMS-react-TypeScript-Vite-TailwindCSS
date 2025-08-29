import * as React from "react";
import { Card, CardHeader, CardContent, Box, Divider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DataGrid, GridToolbar, GridPaginationModel } from "@mui/x-data-grid";

interface MessageBalanceRow {
  id: number;
  period: string;
  smsBalance: number;
  sent: number;
  failed: number;
  totalCost: number;
}

// Optional: pass in your own data via props.
// If you don't pass data, it will use the demoRows below.
export default function MessageBalanceDetails({
  rows = demoRows,
  currency = "TZS",
  height = 460,
}: {
  rows?: MessageBalanceRow[];
  currency?: string;
  height?: number;
}) {
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "period",
      headerName: "Period",
      flex: 1,
      minWidth: 140,
      description: "Date or period this summary applies to",
    },
    {
      field: "smsBalance",
      headerName: "SMS Balance",
      type: "number" as const,
      flex: 0.7,
      minWidth: 140,
      valueFormatter: ({ value }: { value: number }) => numberFormat(value),
    },
    {
      field: "sent",
      headerName: "Sent Messages",
      type: "number" as const,
      flex: 0.7,
      minWidth: 150,
      valueFormatter: ({ value }: { value: number }) => numberFormat(value),
    },
    {
      field: "failed",
      headerName: "Failed Messages",
      type: "number" as const,
      flex: 0.7,
      minWidth: 160,
      valueFormatter: ({ value }: { value: number }) => numberFormat(value),
      cellClassName: (params: any) =>
        params.value > 0 ? "text-red-600" : "",
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      type: "number" as const,
      flex: 0.8,
      minWidth: 140,
      valueFormatter: ({ value }: { value: number }) =>
        new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(value),
    },
  ];

  return (
    <Card elevation={2}>
      <CardHeader
        title="Message Balance"
        subheader="Overview of SMS usage and costs"
      />
      <Divider sx={{ mx: 2 }} />
      <CardContent>
        {/* Rows per page control */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={paginationModel.pageSize}
              label="Rows per page"
              onChange={(e) => setPaginationModel(prev => ({ ...prev, pageSize: Number(e.target.value), page: 0 }))}
            >
              {[5, 10, 25, 50].map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              sorting: { sortModel: [{ field: "period", sort: "desc" }] },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 300 },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

const numberFormat = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

// --- Demo rows (replace with your real data) ---
const demoRows = [
  {
    id: 1,
    period: "2025-08-28",
    smsBalance: 12500,
    sent: 3500,
    failed: 23,
    totalCost: 175000, // TZS
  },
  {
    id: 2,
    period: "2025-08-27",
    smsBalance: 16000,
    sent: 2900,
    failed: 5,
    totalCost: 145000,
  },
  {
    id: 3,
    period: "2025-08-26",
    smsBalance: 18900,
    sent: 2100,
    failed: 0,
    totalCost: 105000,
  },
];
