import { apiFetch } from './api';
import type { Article, ArticleCategory } from '@/types/article';

export interface ArticleListResponse {
    data: Article[];
    total: number;
    limit: number;
    offset: number;
}

export interface ArticleFilters {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
    status?: 'published' | 'draft' | 'all';
}

export const articleAPI = {
    // Public endpoints
    async getArticles(filters?: ArticleFilters): Promise<ArticleListResponse> {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const queryString = params.toString();
        return apiFetch<ArticleListResponse>(
            `/articles${queryString ? `?${queryString}` : ''}`,
            { method: 'GET' }
        );
    },

    async getArticleBySlug(slug: string): Promise<Article> {
        return apiFetch<Article>(`/articles/${slug}`, { method: 'GET' });
    },

    async getCategories(): Promise<ArticleCategory[]> {
        return apiFetch<ArticleCategory[]>('/articles/categories', { method: 'GET' });
    },

    // Admin endpoints
    async getAllArticlesAdmin(token: string, filters?: ArticleFilters): Promise<ArticleListResponse> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const queryString = params.toString();
        return apiFetch<ArticleListResponse>(
            `/articles/admin/all${queryString ? `?${queryString}` : ''}`,
            { method: 'GET', token }
        );
    },

    async createArticle(token: string, data: {
        title: string;
        excerpt?: string;
        content: string;
        coverImage?: string;
        categoryId?: string;
        tags?: string[];
        isPublished?: boolean;
        isDraft?: boolean;
    }): Promise<{ message: string; article: Article }> {
        return apiFetch<{ message: string; article: Article }>(
            '/articles',
            { method: 'POST', token, body: data }
        );
    },

    async updateArticle(token: string, id: string, data: {
        title?: string;
        excerpt?: string;
        content?: string;
        coverImage?: string;
        categoryId?: string;
        tags?: string[];
        isPublished?: boolean;
        isDraft?: boolean;
    }): Promise<{ message: string; article: Article }> {
        return apiFetch<{ message: string; article: Article }>(
            `/articles/${id}`,
            { method: 'PUT', token, body: data }
        );
    },

    async deleteArticle(token: string, id: string): Promise<{ message: string }> {
        return apiFetch<{ message: string }>(
            `/articles/${id}`,
            { method: 'DELETE', token }
        );
    },

    // Category management (admin)
    async createCategory(token: string, data: {
        name: string;
        description?: string;
    }): Promise<{ message: string; category: ArticleCategory }> {
        return apiFetch<{ message: string; category: ArticleCategory }>(
            '/articles/categories',
            { method: 'POST', token, body: data }
        );
    },

    async updateCategory(token: string, id: string, data: {
        name?: string;
        description?: string;
    }): Promise<{ message: string; category: ArticleCategory }> {
        return apiFetch<{ message: string; category: ArticleCategory }>(
            `/articles/categories/${id}`,
            { method: 'PUT', token, body: data }
        );
    },

    async deleteCategory(token: string, id: string): Promise<{ message: string }> {
        return apiFetch<{ message: string }>(
            `/articles/categories/${id}`,
            { method: 'DELETE', token }
        );
    }
};
