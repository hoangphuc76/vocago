import React, { createContext, useState, useContext } from 'react';

// Create Context
export const SearchContext = createContext();

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // For paging

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };


  const updatePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, currentPage, updateSearchQuery, updatePage }}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook to use the search context
export const useSearch = () => {
  return useContext(SearchContext);
};