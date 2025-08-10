import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import AddIcon from '@mui/icons-material/Add';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const generateInvoices = (count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    invoiceNumber: `INV-${1000 + i}`,
    customerName: ['Ali', 'Zainab', 'Mohamed', 'Anna'][i % 4],
    date: `2024-06-${(i % 30 + 1).toString().padStart(2, '0')}`,
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
  const [dateFilter, setDateFilter] = useState('');
  const [amountFilterType, setAmountFilterType] = useState('All');
  const [amountFilterValue, setAmountFilterValue] = useState('');
  const dataGridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dataGridRef.current && !dataGridRef.current.contains(event.target as Node)) {
        setSelectedId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSortedRows = useMemo(() => {
    let filtered = rows;

    if (search.trim()) {
      filtered = filtered.filter((row) =>
        [row.customerName, row.invoiceNumber].some((val) =>
          val.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((row) => row.date === dateFilter);
    }

    if (amountFilterType !== 'All' && amountFilterValue) {
      const val = parseFloat(amountFilterValue);
      if (!isNaN(val)) {
        filtered = filtered.filter((row) => {
          const total = parseFloat(row.total);
          if (amountFilterType === 'Less Than') return total < val;
          if (amountFilterType === 'Greater Than') return total > val;
          if (amountFilterType === 'Equal To') return total === val;
          return true;
        });
      }
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
  }, [rows, search, sortModel, dateFilter, amountFilterType, amountFilterValue]);

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
    <>
      <div className="flex justify-end mb-2">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/invoice')}
        >
          Create Invoice
        </Button>
      </div>
      <Box className="flex flex-col min-h-screen bg-gray-100 p-4">
        <Paper elevation={3} sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]}`,
          borderRadius: 3,
          p: 6,
          mx: 'auto'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="1px solid #ccc" pb={1}>
            <Typography variant="h5" fontWeight="bold">Invoice List</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Left side: Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rows per page</InputLabel>
                <Select
                  value={paginationModel.pageSize}
                  label="Rows per page"
                  onChange={(e) => setPaginationModel(prev => ({
                    ...prev,
                    page: 0, // Reset to first page when changing page size
                    pageSize: e.target.value as number
                  }))}
                >
                  {[5, 10, 25, 50].map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Search invoices"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 200 }}
              />

              <TextField
                size="small"
                type="date"
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                sx={{ width: 180 }}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Amount Filter</InputLabel>
                <Select
                  value={amountFilterType}
                  label="Amount Filter"
                  onChange={(e) => setAmountFilterType(e.target.value)}
                >
                  {['All', 'Less Than', 'Greater Than', 'Equal To'].map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Amount"
                type="number"
                value={amountFilterValue}
                onChange={(e) => setAmountFilterValue(e.target.value)}
                sx={{ width: 120 }}
              />
            </Box>

            {/* Right side: Action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            ref={dataGridRef}
          />
        </Paper>
      </Box>
    </>
  );
};

export default InvoiceList;
