import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="bg-neutral-100 px-6 py-3 rounded-full flex items-center gap-1 mb-2">
      <Search size={22} />
      <input className="focus:outline-0 w-full text-sm" placeholder="Search" />
    </div>
  );
};

export default SearchBar;
