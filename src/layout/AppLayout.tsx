import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import Footer from "../components/common/Footer";
import { Box } from '@mui/material';
import LogoutButton from "../components/pages/AuthPages/LogoutButton";


const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <Box className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Box>
        <AppSidebar />
        <Backdrop />
      </Box>
      <Box
        sx={{
          flex: 1,
          transition: 'margin-left 0.1s ease-out',
          ml: {
            lg: isExpanded || isHovered ? '290px' : '90px',
            xs: isMobileOpen ? 0 : 'auto'
          }
        }}
      >
        <AppHeader />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '2xl', mx: 'auto' }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
