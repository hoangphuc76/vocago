import React, { useContext, useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../../Api/axiosInstance.js';
import { useNavigate } from "react-router-dom";
import { SearchContext } from "./../../Context/SearchContext.js"

const SearchBar = ({ placeholder, onSearch }) => {
  const { updatePage , updateSearchQuery } = useContext(SearchContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    updateSearchQuery(query.trim());
    updatePage(1) ;
    navigate("/courses") ;
  };



  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400}}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder || "Search..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
            style: { borderRadius: '30px' }, 
            endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;