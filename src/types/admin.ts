export interface RecentEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    participantCount: number;
}

export interface ParticipantStat {
    date: string;
    count: number;
}

export interface EventParticipant {
    id: string;
    name: string;
    email: string;
    phone: string;
    attendance: boolean;
    registrationDate: string;
}

export interface EventDetails {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    flyer: string;
    certificate?: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    category?: string;
    price: number;
}