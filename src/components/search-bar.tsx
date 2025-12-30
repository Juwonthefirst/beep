"use client";

import useSearchParams from "@/hooks/useSearchParams.hook";
import { Search } from "lucide-react";
import { useRef, useCallback } from "react";

interface Props {
  setSearchKeyword: (value: string) => void;
  intialValue?: string;
}

const SearchBar = ({ setSearchKeyword, intialValue }: Props) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className="bg-neutral-100 px-6 py-3 rounded-full flex items-center gap-1 mb-2 has-focus:bg-white has-focus:ring-4 has-focus:ring-offset-2 has-focus:outline-2  ring-neutral-500/20 has-focus:outline-black transistion-all duration-200">
      <Search size={22} />
      <input
        className="focus:outline-0 w-full text-sm"
        defaultValue={intialValue}
        placeholder="Search"
        onChange={(event) => {
          if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(
            () => setSearchKeyword(event.target.value),
            300
          );
        }}
      />
    </div>
  );
};

export const SearchBarWithParam = () => {
  const { searchParams, setSearchPrams } = useSearchParams();

  const updateSearchParams = useCallback(
    (value: string) => {
      setSearchPrams((prev) => {
        if (!value) {
          const { search, ...newSearchParams } = prev;
          void search;
          return newSearchParams;
        }
        return { ...prev, search: value };
      });
    },
    [setSearchPrams]
  );

  return (
    <SearchBar
      intialValue={searchParams.search}
      setSearchKeyword={updateSearchParams}
    />
  );
};

export default SearchBar;
