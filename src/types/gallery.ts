export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    participants: number;
    category?: string;
    createdBy: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GalleryPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface GalleryResponse {
    data: GalleryItem[];
    pagination: GalleryPagination;
}
