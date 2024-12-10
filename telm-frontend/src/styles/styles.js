export const StyledPaper = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0.25rem',
    boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.25)',
    background: '#fff',
    '&>.heading': {
        display: 'flex',
        padding: '0.5rem 1.5rem 0.5rem 1rem',
        justifyContent: "space-between",
        alignItems: 'center',
        '&.has-button': {
            paddingRight: '0.5rem'
        },
        '&.has-row': {
            justifyContent: 'start',
            gap: '5.5rem',
            padding: '1.25rem'
        },
        '& p': {
            color: '#393939',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: '1.5rem',
            letterSpacing: '0.025rem',
            textTransform: 'uppercase',
        },
        '& h6': {
            color: '#000',
            fontSize: '1.2rem',
            fontWeight: 800,
            lineHeight: '1.5rem',
            letterSpacing: '0.025rem',
            textTransform: 'uppercase',
        }
    },
    '&>.services': {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        '&>div:not(:last-child)': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        },
        '&.no-padd': {
            padding: 0
        },
        '& .service-name': {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: '1.5rem',
            letterSpacing: '0.00938rem',
        },
        '& h5': {
            color: '#393939',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: '1.5rem', // You can use the numeric value directly
            letterSpacing: '0.025rem',
            textTransform: 'uppercase',
        }
    }
}
export const ButtonAssign = {
    borderColor: '#ddd',
    color: '#696969',
}
export const ButtonAssignActive = {
    background: 'linear-gradient(177deg, #a7fc9d, transparent)',
    color: '#196319',
    borderColor: '#29bd29',
}