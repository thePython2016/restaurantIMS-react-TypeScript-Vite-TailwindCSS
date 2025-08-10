import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PasswordResetRequest from "./pages/AuthPages/PasswordResetRequest.jsx";
import PasswordResetConfirm from "./pages/AuthPages/PasswordResetConfirm.jsx";
import SignIn from "./pages/AuthPages/SignIn";
import { SignupForm as SignUp } from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";

import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Welcome from "./pages/Forms/WelcomePage";
import SignupForm from "./pages/AuthPages/SignupForm";

import Staff from './pages/Forms/Staff';
import StaffList from './pages/Forms/StaffList';
import Update from './pages/Forms/UpdateStaff';
import MenuItems from './pages/Forms/menu';
import MenuItemList from './pages/Forms/MenuItemList';
import UpdateMenuItem from './pages/Forms/UpdateMenuItem';
import OrderForm from './pages/Forms/Order';
import OrderList from './pages/Forms/OrderList';
import UpdateOrder from './pages/Forms/UpdateOrder';
import Customer from './pages/Forms/Customer';
import CustomerList from './pages/Forms/CustomerList';
import UpdateCustomer from './pages/Forms/UpdateCustomer';
import GoogleLoginButton from './pages/AuthPages/GoogleLoginButton';
import PasswordResetPage from './pages/AuthPages/PasswordResetRequest.jsx';

import Invoice from './pages/Forms/Invoice';
import InvoiceList from './pages/Forms/InvoiceList';
import SalesItem from './pages/Forms/SalesItem';
import Sales from './pages/Forms/Sales';
import SalesCustomer from './pages/Forms/SalesCustomer';
import AllCharts from './pages/Forms/AllCharts';
import Reports from './pages/Reports/Reports';
import PublicOrderForm from './pages/Forms/PublicOrderForm';
import Demo from './pages/Forms/Demo';
import ChangePassword from './pages/AuthPages/ChangePassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const location = useLocation();
  const { user, accessToken } = useAuth ? useAuth() : { user: null, accessToken: null };

  React.useEffect(() => {
    if (!user || !accessToken) {
      document.title = 'Login';
    } else if (location.pathname === '/dashboard') {
      document.title = 'Dashboard';
    } else if (location.pathname === '/profile') {
      document.title = 'Profile';
    } else {
      document.title = 'App';
    }
  }, [user, accessToken, location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* Default redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Routes - No Authentication Required */}
        <Route path="/public-order" element={<PublicOrderForm/>} />
        <Route path="/signup-form" element={<SignupForm/>} />
        <Route path="/signup-page" element={<SignupForm/>} />
        <Route path="/password-reset" element={<PasswordResetRequest/>} />
        <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Protected App Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/change-password" element={<ChangePassword />} />
          
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
        

          <Route path="/menu" element={<MenuItems />} />
          <Route path="/item-list" element={<MenuItemList />} />
          <Route path="/update-menu" element={<UpdateMenuItem />} />

          <Route path="/order" element={<OrderForm />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/update-order" element={<UpdateOrder />} />

          <Route path="/customer" element={<Customer />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/update-customer" element={<UpdateCustomer />} />

          <Route path="/staff" element={<Staff />} />
          <Route path="/staff-list" element={<StaffList />} />
          <Route path="/update" element={<Update />} />

          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice-list" element={<InvoiceList />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales-item" element={<SalesItem />} />
          <Route path="/sales-customer" element={<SalesCustomer />} />

          <Route path="/charts" element={<AllCharts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/demo" element={<Demo />} />

          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
        </Route>

        {/* Auth Pages */}
        <Route path="/log" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
