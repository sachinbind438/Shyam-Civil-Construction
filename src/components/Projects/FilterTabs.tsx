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
      
      className="
        flex gap-4 md:gap-8 
        overflow-x-auto md:overflow-visible
        whitespace-nowrap md:flex-wrap
        pb-4 md:pb-6
        scrollbar-hide
      "
    >
      {filterCategories.map((category) => {
        const isActive = activeFilter === category;

        return (
          <motion.button
            key={category}
            onClick={() => onFilterChange(category)}
            className={`
              relative px-1 py-2
              text-sm sm:text-base md:text-lg
              font-medium transition-all duration-300
              shrink-0
              
              ${
                isActive
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }
            `}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {category}

            {/* UNDERLINE */}
            {isActive && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 bottom-0 w-full h-[2px] bg-black rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};