import { apiFetch } from './api';

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactResponse {
    message: string;
    success: boolean;
}

export const contactAPI = {
    /**
     * Submit contact form
     */
    submitContactForm: async (data: ContactFormData): Promise<ContactResponse> => {
        try {
            const response = await apiFetch<ContactResponse>('/contact', {
                method: 'POST',
                body: data,
            });
            return response;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to send message');
        }
    },
};
