import React from 'react';
import { BoxLine, ArrowUp } from '../../icons';
import Badge from '../ui/badge/Badge';

const MenuCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] w-[300px] h-[140px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
          <BoxLine className="text-gray-800 w-5 h-5 dark:text-white/90" />
        </div>
        <Badge color="success">
          <ArrowUp className="w-4 h-4" />
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
  );
};

export default MenuCard; 