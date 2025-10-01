import React, { createContext, useContext, useState } from "react";

export type ContentType = "anime" | "movies";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  activeTab: ContentType;
  setActiveTab: (tab: ContentType) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentType>("anime");

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        showSearch,
        setShowSearch,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
