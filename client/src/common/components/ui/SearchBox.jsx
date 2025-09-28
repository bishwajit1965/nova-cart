// components/ui/SearchBox.jsx

import React from "react";
import { Search } from "lucide-react";

const SearchBox = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full max-w-sm">
      <label
        htmlFor="search term"
        className="text-sm font-medium text-base-content/25"
      >
        Search term
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-base-content/15 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <Search className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
    </div>
  );
};

export default SearchBox;

// Usage example

//  <SearchBox
//    value={searchQuery}
//    onChange={setSearchQuery}
//    placeholder="Search orders, user, or ID..."
//  />;
