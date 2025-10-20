import axios from 'axios';

const checkRefreshToken = async (refreshToken) => {
    try {
        const response = await axios.post('https://localhost:7101/api/Klient/check-refresh-token', `"${refreshToken}"`, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
        });
        return response.data.valid;
    } catch (error) {
        console.error('Error checking refresh token:', error);
        throw error;
    }
};

export default checkRefreshToken;
