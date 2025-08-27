export interface BackendEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    flyer?: string;
    isPublished?: boolean;
}

export interface CatalogEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    price: number;
    maxParticipants: number;
    currentParticipants: number;
    image: string;
    organizer: string;
    tags: string[];
}


