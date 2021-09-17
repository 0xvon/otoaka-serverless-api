import axios from 'axios';
import { decycle } from 'json-cyclic';

const endpoint = process.env.ENDPOINT_URL;

export interface CreateGroupRequest {
    name: string;
    englishName: string | null;
    biography: string | null;
    since: Date | null;
    artworkURL: string | null;
    twitterId: string | null;
    youtubeChannelId: string | null;
    hometown: string | null;
}

export interface LiveStyleInput {
    kind: LiveStyle;
    value: string | string[]; // group id
}

interface searchPiaLiveParams {
    piaApiKey: string;
    keyword?: string;
    sort?: string;
    get_count?: number;
}

export type LiveStyle = 'oneman' | 'battle' | 'festival';

export interface CreateLiveRequest {
    title: string;
    style: LiveStyleInput
    price: number;
    artworkURL: string | null;
    hostGroupId: string
    liveHouse: string | null;
    date: string | null;
    endDate: string | null;
    openAt: string | null;
    startAt: string | null;
    piaEventCode: string | null;
    piaReleaseUrl: string | null;
    piaEventUrl: string | null;
}

export interface RoleInput {
    kind: 'fan' | 'artist';
    value?: string | null;
}

export interface SignupRequest {
    name: string;
    role: RoleInput;
    biography?: string | null;
    thumbnailURL?: string | null;
    sex?: string | null;
    age?: number | null;
    liveStyle?: string | null;
    residence?: string | null;
    twitterUrl?: string | null
    instagramUrl?: string | null
}

export interface Group {
    id: string;
    name: string;
}

export const createGroup = async (request: CreateGroupRequest, idToken: string) => {
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.post('/groups', request);
    return res;
}

export const getAllGroup = async (idToken: string) => {
    console.log('calling /groups ...');
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.get('/groups', {
        params: {
            page: 1,
            per: 10000,
        },
    });
    // console.log(JSON.stringify(decycle(res)));
    return res.data as Group[];
}

export const searchPiaLive = async (params: searchPiaLiveParams, idToken: string) => {
    console.log(`calling /external/test_pia_event_release (query: ${params.keyword}) ...`);

    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.get('/external/test_pia_event_release', { params: params });
    console.log(JSON.stringify(decycle(res)));
    return res.data;
}

export const fetchLive = async (request: CreateLiveRequest, idToken: string) => {
    console.log(`calling /external/fetch_live (title: ${request.title}) ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.post('/external/fetch_live', request);
    return res.data;
}

export const createLive = async (request: CreateLiveRequest, idToken: string) => {
    console.log(`calling /external/create_live (title: ${request.title}) ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.post('/external/create_live', request);
    return res.data;
}

export const signup = async (request: SignupRequest, idToken: string) => {
    console.log(`calling /users/signup ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });

    const res = await apiAxios.post('/users/signup', request);
    return res.data;
}

export const getSignupStatus = async (idToken: string) => {
    console.log(`calling /users/get_signup_status ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    const res = await apiAxios.get('/get/get_signup_status');
    return res.data as boolean;
}

export const editUserInfo = async (request: SignupRequest, idToken: string) => {
    console.log(`calling /users/edit_user_info ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });

    const res = await apiAxios.post('/users/edit_user_info', request);
    return res.data;
}