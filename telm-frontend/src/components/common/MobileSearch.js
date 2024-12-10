import React, {useState} from 'react';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const MobileSearch = ({isOpen, onClose, onSearch, searchQuery, placeholder = "Search by name"}) => {
    const [searchValue, setSearchValue] = useState(''); // State to store the search value

    const handleSearch = () => {
        // Call the onSearch function and pass the searchValue as an argument
        onSearch(searchValue);
        onClose();
    };
    const handleClearSearch = () => {
        // Call the onSearch function and pass the searchValue as an argument
        onSearch('');
        setSearchValue('')
        onClose();
    };

    return (
        <Drawer
            anchor="top"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    borderBottomLeftRadius: '0.5rem',
                    borderBottomRightRadius: '0.5rem',
                }
            }}
        >
            <Stack gap="2rem" padding="2rem">
                <TextField
                    id="search-mobile"
                    placeholder={placeholder}
                    variant="outlined"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} // Update searchValue when text changes
                />
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<SearchIcon/>}
                    onClick={handleSearch} // Call handleSearch when the button is clicked
                >
                    Search
                </Button>
                {searchQuery &&
                    <Button
                        size="large"
                        color={"error"}
                        onClick={handleClearSearch} // Call handleSearch when the button is clicked
                    >
                        Clear Search
                    </Button>
                }
            </Stack>
        </Drawer>
    );
}

export default MobileSearch;