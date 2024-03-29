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

export type LiveStyle = 'oneman' | 'battle' | 'festival';

export interface CreateLiveRequest {
    title: string;
    style: LiveStyleInput
    price: number;
    artworkURL: string | null;
    hostGroupId: string
    liveHouse: string | null;
    date: string | null;
    endDate?: string | null;
    openAt: string | null;
    startAt: string | null;
    piaEventCode: string | null;
    piaReleaseUrl: string | null;
    piaEventUrl: string | null;
}

export interface RoleInput {
    kind: 'fan' | 'artist';
    value: Fan | Artist;
}

export interface Fan {}
export interface Artist {
    part: string
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

export interface CreatePostRequest {
    author: string;
    live: string;
    text: string;
    tracks: any[];
    groups: Group[];
    imageUrls: string[];
}

export interface SendNotificationRequest {
    message: string;
    segment?: string | null;
}

export interface CreateSocialTipEventRequest {
    liveId: string;
    title: string;
    description: string;
    relatedLink: string | null;
    since: string; // ISO Formatted date string
    until: string; // ISO Formatted date string
}

export interface FetchLiveRequest {
    name: string;
    from?: string;
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
    console.log('calling /external/groups ...');
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.get('/external/groups');
    console.log(JSON.stringify(decycle(res.data)));
    return res.data as Group[];
}

export const createLive = async (request: CreateLiveRequest, idToken: string) => {
    console.log(`calling /lives (title: ${request.title}) ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    const res = await apiAxios.post('/lives', request);
    return res.data;
}

export const fetchLive = (request: FetchLiveRequest, idToken: string) => {
    console.log(`calling /external/fetch_live (artist: ${request.name})...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    
    apiAxios.post('/external/fetch_live', request);
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
    const res = await apiAxios.get('/users/get_signup_status');
    return res.data.isSignedup as boolean;
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

export const createPost = async (request: CreatePostRequest, idToken: string) => {
    console.log(`calling /users/create_post ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });

    const res = await apiAxios.post('/users/create_post', request);
    return res.data;
}

export const notifyUpcomingLives = async (idToken: string) => {
    console.log(`calling /external/notify_upcomning_lives ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    const res = await apiAxios.get('/external/notify_upcoming_lives');
    return res.data as string;
}

export const notifyPastLives = async (idToken: string) => {
    console.log(`calling /external/notify_past_lives ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    const res = await apiAxios.get('/external/notify_past_lives');
    return res.data as string;
}

export const sendNotification = async (request: SendNotificationRequest, idToken: string) => {
    console.log(`calling /external/notification ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    const res = await apiAxios.post('/external/notification', request);
    return res.data as string;
}

export const entryGroup = async (groupId: string, idToken: string) => {
    console.log(`calling /external/entry_group ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    await apiAxios.post('/external/entry_group', { groupId: groupId });
}

export const createSocialTipEvent = async (request: CreateSocialTipEventRequest, idToken: string) => {
    console.log(`calling /social_tips/events/create ...`);
    const apiAxios = axios.create({
        baseURL: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        responseType: 'json',
    });
    await apiAxios.post('/social_tips/events/create', request);
}