import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample invoice data
const generateInvoices = (count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    invoiceNumber: `INV-${1000 + i}`,
    customerName: ['Ali', 'Zainab', 'Mohamed', 'Anna'][i % 4],
    date: `2024-06-${(i % 30) + 1}`.padStart(10, '0'),
    total: (Math.random() * 50000 + 10000).toFixed(2),
  }));

const columns: GridColDef[] = [
  { field: 'invoiceNumber', headerName: 'Invoice No', flex: 1 },
  { field: 'customerName', headerName: 'Customer Name', flex: 1 },
  { field: 'date', headerName: 'Date', flex: 1 },
  { field: 'total', headerName: 'Total (TZS)', flex: 1 },
];

const InvoiceList: React.FC = () => {
  const initialData = useMemo(() => generateInvoices(50), []);
  const [rows, setRows] = useState(initialData);
  const [search, setSearch] = useState('');
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredSortedRows = useMemo(() => {
    let filtered = rows;
    if (search.trim()) {
      filtered = filtered.filter((row) =>
        [row.customerName, row.invoiceNumber].some((val) =>
          val.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      filtered = [...filtered].sort((a, b) => {
        if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
        return 0;
      });
    }
    return filtered;
  }, [rows, search, sortModel]);

  const pagedRows = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    return filteredSortedRows.slice(start, start + paginationModel.pageSize);
  }, [filteredSortedRows, paginationModel]);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text('Invoice List', 14, 10);
    autoTable(doc, {
      head: [['Invoice No', 'Customer Name', 'Date', 'Total']],
      body: filteredSortedRows.map((row) => [
        row.invoiceNumber,
        row.customerName,
        row.date,
        row.total,
      ]),
    });
    doc.save('invoice_list.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr><th>Invoice No</th><th>Customer</th><th>Date</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${filteredSortedRows
            .map(
              (row) => `
            <tr>
              <td>${row.invoiceNumber}</td>
              <td>${row.customerName}</td>
              <td>${row.date}</td>
              <td>${row.total}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
    const printWin = window.open('', '', 'width=900,height=700');
    if (!printWin) return;
    printWin.document.write(`<html><body><h2>Invoice List</h2>${tableHTML}</body></html>`);
    printWin.document.close();
    printWin.print();
    printWin.close();
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-7xl mx-auto p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="1px solid #ccc" pb={1}>
          <Typography variant="h5" fontWeight="bold">Invoice List</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          {selectedId !== null && (
            <>
              <IconButton color="primary" onClick={() => alert(`Edit invoice ID ${selectedId}`)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  if (window.confirm('Delete this invoice?')) {
                    setRows((prev) => prev.filter((r) => r.id !== selectedId));
                    setSelectedId(null);
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePDF}
          >
            PDF
          </Button>
        </Box>

        <DataGrid
          rows={pagedRows}
          columns={columns}
          rowCount={filteredSortedRows.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onRowClick={(params) => setSelectedId(params.id as number)}
          getRowClassName={(params) =>
            params.id === selectedId ? 'selected-row' : ''
          }
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 10, 25, 50]}
          sx={{
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .selected-row': { backgroundColor: '#d1eaff !important' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #ccc' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default InvoiceList;
