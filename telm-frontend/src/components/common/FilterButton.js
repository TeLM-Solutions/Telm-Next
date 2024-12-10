import {Badge, IconButton} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import React from "react";

const FilterButton = ({onClickFilter, isFilterActive, filterAppliedCount}) => {
    return (
        <IconButton onClick={onClickFilter} color={isFilterActive ? 'primary' : ''}>
            <Badge
                badgeContent={filterAppliedCount}
                color="error"
                invisible={filterAppliedCount < 0}
                size="large"
            >
                <FilterAltOutlinedIcon/>
            </Badge>
        </IconButton>
    )
}
export default FilterButton;