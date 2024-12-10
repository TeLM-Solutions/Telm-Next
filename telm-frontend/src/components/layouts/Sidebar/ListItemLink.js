import {ListItem, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import Link from 'next/link';

const listItemStyles = {
    padding: 0,
    width: '100%',
    '& a': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        textDecoration: 'none',
        borderRadius: '0.5rem'
    },
    '&.active > a': {
        background: 'linear-gradient(86deg, #4844FF 0%, #0300A7 100%)',
        '& > p': {
            color: 'white'
        }
    },
    '& p': {
        color: '#707070',
        lineHeight: '150%',
        fontSize: '1rem',
        letterSpacing: '0.00938rem'
    }
};
const ListItemLink = ({icon, text, href, parent = false, parentHref = ''}) => {
    const router = useRouter();

    const isActive = router.pathname.includes(parent ? parentHref : href)

    return (
        <ListItem
            sx={listItemStyles}
            className={isActive ? 'active' : ''}
        >
            <Link href={href}>
                <>
                    {icon({color: isActive ? '#fff' : '#707070'})}
                    <Typography variant="body2">{text}</Typography>
                </>
            </Link>
        </ListItem>
    );
};

export default ListItemLink;