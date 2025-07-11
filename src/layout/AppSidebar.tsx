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

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Staff",
    icon: <GroupIcon />,
    subItems: [
      { name: "Add New", path: "/staff", pro: false, icon: <PlusIcon /> },
      { name: "Staff List", path: "/staff-list", pro: false, icon: <ListIcon /> },
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
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
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
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
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
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
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
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear custom-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
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
    </aside>
    </>
  );
};

export default AppSidebar;

