import axios from 'axios';

const checkRefreshTokenValidity = async () => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
        const response = await axios.post('https://localhost:7101/api/klient/check-refresh-token', { refreshToken });
        return response.data.valid;
    } catch (error) {
        console.error('Error checking refresh token:', error);
        return false;
    }
};

export default checkRefreshTokenValidity;
