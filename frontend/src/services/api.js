import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Added dynamic timestamps (?t=...) to completely bypass Chrome browser cache
export const getSessions = () => API.get(`/sessions?t=${Date.now()}`);
export const getSessionEvents = (sessionId) => API.get(`/sessions/${sessionId}/events?t=${Date.now()}`);
export const getHeatmapData = (pageUrl) => API.get(`/heatmap?pageUrl=${encodeURIComponent(pageUrl)}&t=${Date.now()}`);
export const getAllPages = () => API.get(`/pages?t=${Date.now()}`);
export const resetHeatmapData = (pageUrl) => API.delete(`/events/reset?pageUrl=${encodeURIComponent(pageUrl)}`);