
const API_URL = 'https://v3.football.api-sports.io';

interface Params {
    [key: string]: string;
}

async function fetchFromApiSports(endpoint: string, params: Params = {}) {
    const url = new URL(endpoint, API_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const options: RequestInit = { // Explicitly type options as RequestInit
        method: 'GET',
        headers: new Headers({ // Use the Headers constructor for headers
            'x-rapidapi-key': process.env.REACT_APP_API_KEY || '', // Provide a fallback or ensure the environment variable is set
            'x-rapidapi-host': API_URL,
        }),
    };

    try {
        const response = await fetch(url.toString(), options); // Ensure url is converted to string
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data from API Sports:", error);
        throw error; // Rethrow error to be handled by caller
    }
}

export const getFixturesByDate = async (date: string): Promise<any> => {
    return await fetchFromApiSports('https://v3.football.api-sports.io/fixtures', { date });
};