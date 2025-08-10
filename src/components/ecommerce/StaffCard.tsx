import React from 'react';
import { BoxIconLine, ArrowUpIcon } from '../../icons';
import Badge from '../ui/badge/Badge';

const StaffCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] w-[300px] h-[140px]">
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
  );
};

export default StaffCard;
