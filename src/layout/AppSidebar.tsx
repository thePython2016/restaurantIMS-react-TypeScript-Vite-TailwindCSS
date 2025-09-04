import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94A3B8;
  }

  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
  }

  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748B;
  }
`;

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  GroupIcon,
  BoxIconLine,
  DollarLineIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

const navItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Contacts",
    icon: <GroupIcon />,
    subItems: [
      { name: "Staff", path: "/staff-contacts", pro: false, icon: <PlusIcon /> },
      { name: "Customers", path: "/customers-contacts", pro: false, icon: <ListIcon /> },
      // { name: "demo", path: "/demo", pro: false, icon: <ListIcon /> },
      // { name: "Update", path: "/update", pro: false, icon: <PencilIcon /> }
    ],
  },
  {
    name: "Staff",
    icon: <GroupIcon />,
    subItems: [
      { name: "Add New", path: "/staff", pro: false, icon: <PlusIcon /> },
      { name: "Staff List", path: "/staff-list", pro: false, icon: <ListIcon /> },
      // { name: "demo", path: "/demo", pro: false, icon: <ListIcon /> },
      { name: "Update", path: "/update", pro: false, icon: <PencilIcon /> }
    ],
  },
  {
    name: "Menu Items",
    icon: <BoxIconLine />,
    subItems: [
      { name: "Add New", path: "/menu", pro: false, icon: <PlusIcon /> },
      { name: "View Item", path: "/item-list", pro: false, icon: <ListIcon /> },
      { name: "Update Item", path: "/update-menu", pro: false, icon: <PencilIcon /> }
    ],
  },
  {
    name: "Orders",
    icon: <ListIcon />,
    subItems: [
      { name: "Add New", path: "order", pro: false, icon: <PlusIcon /> },
      { name: "Orders List", path: "/order-list", pro: false, icon: <ListIcon /> },
      { name: "Update Order", path: "/update-order", pro: false, icon: <PencilIcon /> },
    ],
  },
  {
    name: "Active Customer",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "Add New", path: "/customer", pro: false, icon: <PlusIcon /> },
      { name: "Customers List", path: "/customer-list", pro: false, icon: <ListIcon /> },
      { name: "Update", path: "/update-customer", pro: false, icon: <PencilIcon /> },
    ],
  },
  {
    name: "Invoice",
    icon: <PageIcon />,
    subItems: [
      { name: "Create Invoice", path: "/invoice", pro: false, icon: <PlusIcon /> },
      { name: "Invoice List", path: "/invoice-list", pro: false, icon: <ListIcon /> }
    ],
  },
  {
    name: "Sales",
    icon: <DollarLineIcon />,
    subItems: [
      { name: "Add New", path: "/sales", pro: false, icon: <PlusIcon /> },
      { name: "Sales by Item details", path: "/sales-item", pro: false, icon: <BoxIconLine /> },
      { name: "Sales Customer details", path: "/sales-Customer", pro: false, icon: <UserCircleIcon /> }
    ]
  },
  {
    name: "Message",
    icon: <DollarLineIcon />,
    subItems: [

      { name: "Send Single Message", path: "/single-sms", pro: false, icon: <PlusIcon /> },
      { name: "Send Bulk Messages", path: "/bulk-sms", pro: false, icon: <PlusIcon /> },
      { name: "Sent Messages", path: "/sent-sms", pro: false, icon: <PlusIcon /> },
      { name: "Message Balance", path: "/message-balance", pro: false, icon: <PlusIcon /> },
      
      // { name: "Sales by Item details", path: "/sales-item", pro: false, icon: <BoxIconLine /> },
      // { name: "Sales Customer details", path: "/sales-Customer", pro: false, icon: <UserCircleIcon /> }
    ]
  }
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Reports",
    path: "/reports",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Charts",
    path: "/charts",
    
    
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleSidebar } = useSidebar();
  const { user, accessToken } = useAuth();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
                         <button
               onClick={() => {
                 if (!isExpanded) {
                   toggleSidebar();
                 }
                 handleSubmenuToggle(index, menuType);
               }}
               className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index && (isExpanded || isMobileOpen)
                  ? "menu-item-active"
                  : "menu-item-inactive"
                             } cursor-pointer ${
                 !isExpanded
                   ? "lg:justify-center"
                   : "lg:justify-start"
               }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index && (isExpanded || isMobileOpen)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
                             {(isExpanded || isMobileOpen) && (
                 <span className="menu-item-text">{nav.name}</span>
               )}
               {(isExpanded || isMobileOpen) && (
                 <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-100 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
                             <Link
                 to={nav.path}
                 onClick={() => !isExpanded && toggleSidebar()}
                 className={`menu-item group ${
                   isActive(nav.path) && (isExpanded || isMobileOpen) ? "menu-item-active" : "menu-item-inactive"
                 }`}
               >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) && (isExpanded || isMobileOpen)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-150"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? subMenuHeight[`${menuType}-${index}`]
                    : 0,
              }}
            >
              <ul className="flex flex-col gap-2 pl-4 mt-2">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        isActive(subItem.path)
                          ? "text-brand-500 bg-brand-50 dark:bg-brand-500/10"
                          : "text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-500 dark:hover:bg-brand-500/10"
                      }`}
                    >
                      {subItem.icon ? (
                        <span className="w-4 h-4">{subItem.icon}</span>
                      ) : (
                        <span className="text-xs font-medium">&gt;&gt;</span>
                      )}
                      <span>{subItem.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <style>{scrollbarStyles}</style>
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-100 ease-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      style={{
        transition: 'width 0.1s ease-out, transform 0.1s ease-out'
      }}
    >
      <div
        className={`py-8 flex items-center ${
          !isExpanded ? "lg:justify-center" : "justify-start"
        } gap-2`}
      >
        <button
          className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-75 active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            toggleSidebar();
          }}
          aria-label="Toggle Sidebar"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H4Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <Link to="/">
          {isExpanded || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>



      {user && accessToken && (
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear custom-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Dashboard Section */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 ${
                  !isExpanded
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  "Dashboard"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => !isExpanded && toggleSidebar()}
                    className={`menu-item group ${
                      location.pathname === "/dashboard" && (isExpanded || isMobileOpen) ? "menu-item-active" : "menu-item-inactive"
                    }`}
                    style={location.pathname === "/dashboard" && (isExpanded || isMobileOpen) ? {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                      color: 'white'
                    } : {}}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        location.pathname === "/dashboard" && (isExpanded || isMobileOpen)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                      style={location.pathname === "/dashboard" && (isExpanded || isMobileOpen) ? { color: 'white' } : {}}
                    >
                      <GridIcon />
                    </span>
                    {(isExpanded || isMobileOpen) && (
                      <span 
                        className="menu-item-text"
                        style={location.pathname === "/dashboard" && (isExpanded || isMobileOpen) ? { color: 'white' } : {}}
                      >
                        Dashboard
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Menu Section */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 ${
                  !isExpanded
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 ${
                  !isExpanded
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
        )}
    </aside>
    </>
  );
};

export default AppSidebar;

