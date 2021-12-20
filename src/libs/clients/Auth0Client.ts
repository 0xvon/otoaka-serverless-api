import axios from 'axios';

const domain: string = process.env.AUTH0_DOMAIN!
const clientId: String = process.env.AUTH0_CLIENT_ID!
const clientSecret: String = process.env.AUTH0_CLIENT_SECRET!

export const signin = async (username: string, password: string): Promise<string> => {
    const request = {
        grant_type: "password",
        username: username,
        password: password,
        scope: "openid profile email",
        client_id: clientId,
        client_secret: clientSecret,
        audience: `${domain}/api/v2/`
    }

    const apiAxios = axios.create({
        baseURL: domain,
        headers: {
            'Content-Type': 'application/json',
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.post('/oauth/token', request);
    return res.data.access_token as string;
}