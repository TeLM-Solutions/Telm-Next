import React, {useEffect, useRef, useState} from 'react';
import {IconButton, InputAdornment, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash/debounce';

const TableSearch = ({onSearch, label}) => {
    const [searchText, setSearchText] = useState('');
    const debouncedSearchRef = useRef(null);

    const handleInputChange = (event) => {
        const {value} = event.target;
        setSearchText(value);
    };

    const handleClearClick = () => {
        setSearchText('');
        onSearch('');
    };

    useEffect(() => {
        // Create or update the debounced search function
        debouncedSearchRef.current = debounce((value) => {
            onSearch(value);
        }, 600);

        // Trigger the debounced search function with the current searchText
        debouncedSearchRef.current(searchText);

        return () => {
            // Clean up the debounced search function on component unmount
            if (debouncedSearchRef.current) {
                debouncedSearchRef.current.cancel();
            }
        };
    }, [searchText, onSearch]);

    return (
        <TextField
            InputLabelProps={{
                shrink: false,
                style: {marginLeft: '2rem'},
            }}
            placeholder={label}
            sx={{width: '320px'}}
            size="small"
            variant="outlined"
            value={searchText}
            onChange={handleInputChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon/>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        {searchText && (
                            <IconButton
                                size={"small"}
                                aria-label="Clear"
                                onClick={handleClearClick}
                            >
                                <ClearIcon fontSize={"small"}/>
                            </IconButton>
                        )}
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default React.memo(TableSearch);