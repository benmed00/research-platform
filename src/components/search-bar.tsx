/**
 * @file search-bar.tsx
 * @description src/components/search-bar.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 67
 * @size 1.82 KB
 */
"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

function SearchBarComponent({
  placeholder = "Rechercher...",
  onSearch,
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, debounceMs);
  const onSearchRef = useRef(onSearch);

  // Keep ref updated with latest callback
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Appeler onSearch quand la recherche débounced change
  // Use ref to avoid dependency issues while still using latest callback
  useEffect(() => {
    onSearchRef.current(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);

