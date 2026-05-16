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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample order data - replace with your actual data
const sampleOrders = [
  { id: 1, orderNumber: 'ORD-001', customerName: 'John Doe', date: '2024-01-15', total: 45000 },
  { id: 2, orderNumber: 'ORD-002', customerName: 'Jane Smith', date: '2024-01-16', total: 32000 },
  { id: 3, orderNumber: 'ORD-003', customerName: 'Mike Johnson', date: '2024-01-17', total: 28000 },
  { id: 4, orderNumber: 'ORD-004', customerName: 'Sarah Wilson', date: '2024-01-18', total: 55000 },
  { id: 5, orderNumber: 'ORD-005', customerName: 'David Brown', date: '2024-01-19', total: 38000 },
];

const columns: GridColDef[] = [
  { field: 'orderNumber', headerName: 'Order Number', flex: 1 },
  { field: 'customerName', headerName: 'Customer Name', flex: 1 },
  { field: 'date', headerName: 'Date', flex: 1 },
  { field: 'total', headerName: 'Total (TZS)', type: 'number', flex: 1 },
];

const OrderReport: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [amountFilterType, setAmountFilterType] = useState('All');
  const [amountFilterValue, setAmountFilterValue] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rows, setRows] = useState<any[]>(sampleOrders);
  const dataGridRef = useRef<HTMLDivElement>(null);

  // Click outside handler to deselect rows
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
        [row.customerName, row.orderNumber].some((val) =>
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
    doc.text('Orders Report', 14, 10);
    autoTable(doc, {
      head: [['Order Number', 'Customer Name', 'Date', 'Total']],
      body: filteredSortedRows.map((row) => [
        row.orderNumber,
        row.customerName,
        row.date,
        row.total,
      ]),
    });
    doc.save('orders_report.pdf');
  };

  const handlePrint = () => {
    const tableHTML = `
      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#e0e0e0;">
          <tr><th>Order Number</th><th>Customer</th><th>Date</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${filteredSortedRows
            .map(
              (row) => `
            <tr>
              <td>${row.orderNumber}</td>
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
    printWin.document.write(`<html><body><h2>Orders Report</h2>${tableHTML}</body></html>`);
    printWin.document.close();
    printWin.print();
    printWin.close();
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="1px solid #ccc" pb={1}>
        <Typography variant="h6" fontWeight={600}>
          Orders Report
        </Typography>
      </Box>

      {/* Controls Row - Search form after amount field */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={paginationModel.pageSize}
            label="Rows per page"
            onChange={(e) => setPaginationModel(prev => ({
              ...prev,
              page: 0,
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

        <TextField
          size="small"
          label="Search orders"
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
      </Box>

      {/* Centered Print/PDF Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 2 }}>
        {selectedId !== null && (
          <>
            <IconButton color="primary" onClick={() => alert(`Edit order ID ${selectedId}`)}>
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                if (window.confirm('Delete this order?')) {
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

      {/* DataGrid Table */}
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
          '& .MuiDataGrid-columnHeaders': { 
            borderBottom: '2px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          },
          '& .MuiDataGrid-columnHeader': {
            borderRight: '1px solid #e0e0e0',
            '&:last-child': {
              borderRight: 'none'
            }
          },
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid #f0f0f0',
            '&:last-child': {
              borderRight: 'none'
            }
          }
        }}
        ref={dataGridRef}
      />
    </Paper>
  );
};

export default OrderReport; 