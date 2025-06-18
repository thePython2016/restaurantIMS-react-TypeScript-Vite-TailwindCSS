import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  return (
    <div className="flex flex-row gap-3">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] w-[280px] h-[140px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-5 dark:text-white/90" />
          </div>
          <Badge color="success">
            <ArrowUpIcon className="w-4 h-4" />
            11.01%
          </Badge>
        </div>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Customers
          </span>
          <h4 className="mt-1 font-semibold text-gray-800 text-lg dark:text-white/90">
            3,782
          </h4>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] w-[280px] h-[140px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-5 dark:text-white/90" />
          </div>
          <Badge color="error">
            <ArrowDownIcon className="w-4 h-4" />
            9.05%
          </Badge>
        </div>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Orders
          </span>
          <h4 className="mt-1 font-semibold text-gray-800 text-lg dark:text-white/90">
            5,359
          </h4>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Staff Metric Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] w-[280px] h-[140px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-5 dark:text-white/90" />
          </div>
          <Badge color="success">
            <ArrowUpIcon className="w-4 h-4" />
            11.01%
          </Badge>
        </div>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Staff
          </span>
          <h4 className="mt-1 font-semibold text-gray-800 text-lg dark:text-white/90">
            45
          </h4>
        </div>
      </div>
      {/* <!-- Staff Metric End --> */}

      {/* <!-- Menu Metric Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] w-[280px] h-[140px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-5 dark:text-white/90" />
          </div>
          <Badge color="success">
            <ArrowUpIcon className="w-4 h-4" />
            8.2%
          </Badge>
        </div>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Menu Items
          </span>
          <h4 className="mt-1 font-semibold text-gray-800 text-lg dark:text-white/90">
            156
          </h4>
        </div>
      </div>
      {/* <!-- Menu Metric End --> */}
    </div>
  );
}
