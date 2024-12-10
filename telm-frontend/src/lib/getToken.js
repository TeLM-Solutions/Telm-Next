import axios from '@/lib/axios';

async function fetchCSRFToken() {
    try {
        const response = await axios.get('/api/csrf-token'); // Replace with your Laravel API endpoint
        return response.data.csrf_token;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
    }
}

export default fetchCSRFToken;