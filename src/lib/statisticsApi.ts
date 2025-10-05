import { apiFetch } from './api';

export interface DashboardStats {
    monthlyEvents: number[];
    monthlyParticipants: number[];
    topEvents: {
        id: string;
        title: string;
        date: string;
        participantCount: number;
    }[];
    months: string[];
}

export const statisticsApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        return await apiFetch('/statistics/dashboard');
    },

    getMonthlyEvents: async (): Promise<number[]> => {
        return await apiFetch('/statistics/events/monthly');
    },

    getMonthlyParticipants: async (): Promise<number[]> => {
        return await apiFetch('/statistics/participants/monthly');
    },

    getTopEvents: async () => {
        return await apiFetch('/statistics/events/top');
    }
};