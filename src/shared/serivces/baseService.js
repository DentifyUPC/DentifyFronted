import api from '@/core/network/api.js';
import axios from 'axios';

export default class BaseService {
    constructor(prefix = '') {

        this.prefix = prefix.replace(/\/$/, '');
    }

    _url(endpoint = '') {
        if (!endpoint) return this.prefix;
        return endpoint.startsWith('/')
            ? `${this.prefix}${endpoint}`
            : `${this.prefix}/${endpoint}`;
    }

    async get(endpoint = '', params = {}, useAuth = true) {
        const client = this._getClient(useAuth);
        const res = await client.get(this._url(endpoint), { params });
        return res.data;
    }

    async post(endpoint = '', data = {}, useAuth = true) {
        const client = this._getClient(useAuth);
        const res = await client.post(this._url(endpoint), data);
        return res.data;
    }

    async put(endpoint = '', data = {}, useAuth = true) {
        const client = this._getClient(useAuth);
        const res = await client.put(this._url(endpoint), data);
        return res.data;
    }

    async delete(endpoint = '', useAuth = true) {
        const client = this._getClient(useAuth);
        const res = await client.delete(this._url(endpoint));
        return res.data;
    }

    _getClient(useAuth) {
        if (useAuth) return api;


        const client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '',
            headers: { 'Content-Type': 'application/json' },
        });

        return client;
    }
}
