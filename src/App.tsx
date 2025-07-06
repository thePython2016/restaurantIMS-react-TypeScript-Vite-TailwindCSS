import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Staff from './pages/Forms/Staff';
import StaffList from './pages/Forms/StaffList';
import Update from './pages/Forms/UpdateStaff';
import MenuItems from './pages/Forms/Menu';
import MenuItemList from './pages/Forms/MenuItemList';
import UpdateMenuItem from './pages/Forms/UpdateMenuItem';
import OrderForm from './pages/Forms/Order';
import OrderList from './pages/Forms/OrderList';
import UpdateOrder from './pages/Forms/UpdateOrder';
import Customer from './pages/Forms/Customer';
import CustomerList from './pages/Forms/CustomerList';
import UpdateCustomer from './pages/Forms/UpdateCustomer';    
import Invoice from './pages/Forms/Invoice';    
import InvoiceList from './pages/Forms/InvoiceList';    
import SalesItem from './pages/Forms/SalesItem';
import Sales from './pages/Forms/Sales';
import SalesCustomer from './pages/Forms/SalesCustomer';
import AllCharts from './pages/Forms/AllCharts';
import Login from './pages/Forms/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
// import StaffList from './pages/Forms/StaffList';


// Reports imports
import Reports from './pages/Reports/Reports';

export const theme = createTheme({
  typography: {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
  },
  palette: {
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index path="/" element={<Home />} />

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* MENU ITEMS */}
          <Route path="/menu" element={<MenuItems/>} />
          <Route path="/item-list" element={<MenuItemList/>} />
          <Route path="/update-menu" element={<UpdateMenuItem/>} />

          {/* ORDERS */}
          <Route path="/order" element={<OrderForm/>} />
          <Route path="/order-list" element={<OrderList/>} />
          <Route path="/update-order" element={<UpdateOrder/>} />

          {/* CUSTOMER */}
          <Route path="/customer" element={<Customer />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/update-customer" element={<UpdateCustomer />} />

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/charts" element={<AllCharts/>} />
        

          {/* Staff Page */}
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff-list" element={<StaffList />} />
          <Route path="/update" element={<Update />} />
          {/* Invoice inside layout */}
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice-list" element={<InvoiceList />} />

          {/* Sales */}
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales-item" element={<SalesItem />} />
          <Route path="/sales-customer" element={<SalesCustomer />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Auth Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    
  );
}
