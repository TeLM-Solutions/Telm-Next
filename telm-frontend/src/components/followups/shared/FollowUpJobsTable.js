import React, {useState} from "react";
import {Button, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";

const FollowUpJobsTable = ({jobs, selectedJob, handleJobClick, isLoading}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 6;

    const filteredJobs = jobs.filter((job) => {
        // Filter based on your search criteria, e.g., lead name or location
        const searchString = search.toLowerCase();
        return (
            job.lead.business.name.toLowerCase().includes(searchString) ||
            job.lead.business.location.name.toLowerCase().includes(searchString)
        );
    });

    const indexOfLastJob = currentPage * itemsPerPage;
    const indexOfFirstJob = indexOfLastJob - itemsPerPage;
    let currentJobs = filteredJobs.filter((job) => job.followups_count == 0).slice(indexOfFirstJob, indexOfLastJob);

    const nextPage = () => {
        if (indexOfLastJob < filteredJobs.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Stack direction={"column"}
               sx={{
                   gap: '1.5rem',
                   flex: 'none',
                   background: 'linear-gradient(156deg, #E9FAFF 0%, #F0F0FF 100%)',
                   padding: '1.5rem',
                   alignSelf: 'stretch',
                   width: '100%',
                   marginBottom: {
                       xs: '10rem',
                       md: 0
                   }
               }}
        >
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
                    Select a Job
                </Typography>

                <TextField
                    placeholder="Search Jobs"
                    variant="outlined"
                    size={"small"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                    }}
                    sx={{background: '#fff'}}
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
                {!isLoading && currentJobs.map((job) => (
                    <Stack alignItems={"center"} direction={"row"} key={job.id}
                           onClick={() => handleJobClick(job.id)}
                           className={job.id === selectedJob ? 'active' : ''}>
                        <BusinessNameBlock name={job.lead.business.name}
                                           location={job.lead.business.location.name}/>
                        {job.id !== selectedJob &&
                            <RadioButtonUncheckedIcon sx={{fill: "#AFAFAF"}}/>}
                        {job.id === selectedJob &&
                            <CheckCircleIcon color={"secondary"}/>}
                    </Stack>
                ))}

                <Stack direction={"row"}>
                    <Button onClick={prevPage} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button onClick={nextPage} disabled={indexOfLastJob >= filteredJobs.length}>
                        Next
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
export default FollowUpJobsTable