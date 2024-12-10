import React from 'react';

const CurrencyFormatter = ({amount}) => {
    // Format the amount as currency with AED (United Arab Emirates Dirham) locale
    const formattedCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AED',
    }).format(amount);

    return <span style={{fontWeight: 'bold'}}>{formattedCurrency}</span>;
};

export default CurrencyFormatter;