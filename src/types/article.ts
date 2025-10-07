export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    author: {
        name: string;
        avatar?: string;
        role?: string;
    };
    publishedAt: string;
    readTime: string;
    tags?: string[];
    isPublished?: boolean;
}

export interface ArticleCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}
