import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import {Button, CircularProgress, InputAdornment, TextField, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const FormLeadList = ({leads, handleLeadClick, selectedLead, isLoading, disableSelect = false}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 6;

    const filteredLeads = leads.filter((lead) => {
        // Filter based on your search criteria, e.g., lead name or location
        const searchString = search.toLowerCase();
        return (
            lead.business.name.toLowerCase().includes(searchString) ||
            lead.business.location.name.toLowerCase().includes(searchString)
        );
    });

    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

    const nextPage = () => {
        if (indexOfLastLead < filteredLeads.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Stack direction={"column"} gap={"1rem"}>

            {!disableSelect &&

                <>
                    <Stack direction={"row"}
                           justifyContent={"space-between"}
                           alignSelf={"stretch"}
                           alignItems={"center"}
                    >
                        <Typography
                            component={"h4"}
                            sx={{
                                fontWeight: 500,
                            }}
                        >
                            Lead
                        </Typography>

                        <TextField
                            placeholder="Search Leads"
                            variant="outlined"
                            size={"small"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Stack>


                    <Stack direction={"column"}
                           sx={{
                               borderRadius: '0.5rem',
                               background: '#fff',
                               boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
                               overflow: 'hidden',
                               '& > div': {
                                   display: 'flex',
                                   padding: '0.5rem 1rem',
                                   justifyContent: 'space-between',
                                   alignItems: 'center',
                                   alignSelf: 'stretch',
                                   cursor: 'pointer',
                                   borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                   '&:last-child': {
                                       borderBottom: 'none'
                                   },
                                   '&.active': {
                                       background: 'linear-gradient(156deg, #C9F2FF 0%, #FFF 100%)'
                                   }
                               }
                           }}
                    >
                        {isLoading &&
                            <Stack p={"1rem"} justifyConent={"center"}>
                                <CircularProgress size={"1.5rem"}/>
                            </Stack>
                        }
                        {currentLeads.map((lead) => (
                            <Stack
                                alignItems="center"
                                direction="row"
                                key={lead.id}
                                // Replace this onClick function with your own logic
                                onClick={() => handleLeadClick(lead.id)}
                                className={lead.id === selectedLead ? 'active' : ''}
                            >
                                <BusinessNameBlock name={lead.business.name} location={lead.business.location.name}/>
                                {lead.id !== selectedLead && <RadioButtonUncheckedIcon sx={{fill: '#AFAFAF'}}/>}
                                {lead.id === selectedLead && <CheckCircleIcon color="secondary"/>}
                            </Stack>
                        ))}
                        <div>
                            <Button onClick={prevPage} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <Button onClick={nextPage} disabled={indexOfLastLead >= filteredLeads.length}>
                                Next
                            </Button>
                        </div>
                    </Stack>
                </>
            }

        </Stack>
    );
};

export default FormLeadList;