"use client";

import { motion } from "framer-motion";
import { FilterCategory, filterCategories } from "./../../data/projects";

interface FilterTabsProps {
  activeFilter: FilterCategory;
  onFilterChange: (category: FilterCategory) => void;
}

export const FilterTabs = ({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap gap-4 md:gap-8  pb-6"
    >
      {filterCategories.map((category) => {
        const isActive = activeFilter === category;

        return (
          <motion.button
            key={category}
            onClick={() => onFilterChange(category)}
            className={`relative pb-2 text-sm md:text-base font-medium transition-colors duration-300 ${
              isActive
                ? "text-black font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {category}

            {/* Active Underline Indicator */}
            {isActive && (
              <motion.div
                layoutId="underline"
                className="absolute -bottom-[22px] left-0 right-0 h-1 bg-black rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};
