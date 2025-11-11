import { apiFetch } from './api';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string | null;
    rating: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export const testimonialAPI = {
    // Get all active testimonials (public)
    getTestimonials: async (): Promise<Testimonial[]> => {
        const response = await apiFetch<{ success: boolean; data: Testimonial[] }>(
            '/testimonials'
        );
        return response.data;
    },

    // Get single testimonial by ID
    getTestimonialById: async (id: string): Promise<Testimonial> => {
        const response = await apiFetch<{ success: boolean; data: Testimonial }>(
            `/testimonials/${id}`
        );
        return response.data;
    },

    // Admin: Get all testimonials (including inactive)
    getAllTestimonials: async (token: string): Promise<Testimonial[]> => {
        const response = await apiFetch<{ success: boolean; data: Testimonial[] }>(
            '/testimonials/admin/all',
            { token }
        );
        return response.data;
    },

    // Admin: Create testimonial
    createTestimonial: async (
        data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
        token: string
    ): Promise<Testimonial> => {
        const response = await apiFetch<{ success: boolean; data: Testimonial }>(
            '/testimonials',
            {
                method: 'POST',
                body: data,
                token
            }
        );
        return response.data;
    },

    // Admin: Update testimonial
    updateTestimonial: async (
        id: string,
        data: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>,
        token: string
    ): Promise<Testimonial> => {
        const response = await apiFetch<{ success: boolean; data: Testimonial }>(
            `/testimonials/${id}`,
            {
                method: 'PUT',
                body: data,
                token
            }
        );
        return response.data;
    },

    // Admin: Toggle active status
    toggleTestimonialActive: async (id: string, token: string): Promise<Testimonial> => {
        const response = await apiFetch<{ success: boolean; data: Testimonial }>(
            `/testimonials/${id}/toggle`,
            {
                method: 'PATCH',
                token
            }
        );
        return response.data;
    },

    // Admin: Delete testimonial
    deleteTestimonial: async (id: string, token: string): Promise<void> => {
        await apiFetch<{ success: boolean }>(
            `/testimonials/${id}`,
            {
                method: 'DELETE',
                token
            }
        );
    }
};
