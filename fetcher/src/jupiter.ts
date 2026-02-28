import axios from 'axios';

const baseUrl = 'https://lite-api.jup.ag/tokens/v2';

export const fetchFromJupiter = async () => {
    const response = await axios.get(`${baseUrl}/search?query=sol`);
   return response.data;
}