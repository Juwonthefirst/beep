"use client";

import { Search } from "lucide-react";
import { type SetStateAction, type Dispatch, useState, useEffect } from "react";

interface Props {
  setSearchKeyword: Dispatch<SetStateAction<string>>;
}
const SearchBar = ({ setSearchKeyword }: Props) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => setSearchKeyword(inputValue), 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, setSearchKeyword]);

  return (
    <div className="bg-neutral-100 px-6 py-3 rounded-full flex items-center gap-1 mb-2 has-focus:bg-white has-focus:ring-4 has-focus:ring-offset-2 has-focus:outline-2  ring-neutral-500/20 has-focus:outline-black transistion-all duration-200">
      <Search size={22} />
      <input
        className="focus:outline-0 w-full text-sm"
        placeholder="Search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
    </div>
  );
};

export default SearchBar;
