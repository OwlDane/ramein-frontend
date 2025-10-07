import type { Article, ArticleCategory } from '@/types/article';

export const dummyCategories: ArticleCategory[] = [
    { id: '1', name: 'Tips & Tricks', slug: 'tips-tricks' },
    { id: '2', name: 'Industry Insights', slug: 'industry-insights' },
    { id: '3', name: 'Community', slug: 'community' },
    { id: '4', name: 'Technology', slug: 'technology' },
    { id: '5', name: 'Event Planning', slug: 'event-planning' },
];

export const dummyArticles: Article[] = [
    {
        id: '1',
        title: 'How to Make the Most of Virtual Events',
        slug: 'how-to-make-most-of-virtual-events',
        excerpt: 'Discover strategies to maximize your virtual event experience and build meaningful connections online.',
        content: `
# How to Make the Most of Virtual Events

Virtual events have become an integral part of our professional and personal lives. Here are some strategies to help you get the most out of them.

## 1. Prepare in Advance
- Research the event agenda
- Set clear goals for what you want to achieve
- Test your technology beforehand

## 2. Engage Actively
- Participate in chat discussions
- Ask questions during Q&A sessions
- Network with other attendees

## 3. Follow Up
- Connect with people you met
- Review session recordings
- Implement what you learned

Remember, the key to success in virtual events is active participation!
        `,
        coverImage: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&h=800&fit=crop',
        category: 'Tips & Tricks',
        author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            role: 'Event Strategist'
        },
        publishedAt: '2024-12-15T10:00:00Z',
        readTime: '5 min read',
        tags: ['virtual events', 'networking', 'tips'],
        isPublished: true
    },
    {
        id: '2',
        title: 'Top Event Trends for 2025',
        slug: 'top-event-trends-2025',
        excerpt: 'Explore the latest trends shaping the event industry and what to expect in the coming year.',
        content: `
# Top Event Trends for 2025

The event industry is constantly evolving. Here are the top trends we're seeing for 2025.

## Hybrid Events Continue to Grow
The best of both worlds - combining in-person and virtual experiences.

## Sustainability Takes Center Stage
Eco-friendly practices are no longer optional but expected.

## AI-Powered Personalization
Using artificial intelligence to create tailored event experiences.

## Immersive Technologies
AR and VR are transforming how we experience events.

Stay ahead of the curve by embracing these trends!
        `,
        coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop',
        category: 'Industry Insights',
        author: {
            name: 'Michael Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            role: 'Industry Analyst'
        },
        publishedAt: '2024-12-10T14:30:00Z',
        readTime: '7 min read',
        tags: ['trends', 'future', '2025'],
        isPublished: true
    },
    {
        id: '3',
        title: 'Building Community Through Events',
        slug: 'building-community-through-events',
        excerpt: 'Learn how events can foster strong communities and create lasting relationships among participants.',
        content: `
# Building Community Through Events

Events are powerful tools for community building. Here's how to leverage them effectively.

## Create Shared Experiences
Design activities that bring people together and create memorable moments.

## Foster Meaningful Connections
Facilitate networking opportunities that go beyond surface-level interactions.

## Maintain Engagement Post-Event
Keep the conversation going after the event ends.

## Celebrate Community Achievements
Recognize and celebrate the successes of your community members.

Building a strong community takes time, but the rewards are worth it!
        `,
        coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
        category: 'Community',
        author: {
            name: 'Emily Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            role: 'Community Manager'
        },
        publishedAt: '2024-12-05T09:15:00Z',
        readTime: '6 min read',
        tags: ['community', 'networking', 'engagement'],
        isPublished: true
    },
    {
        id: '4',
        title: 'The Power of Event Technology',
        slug: 'power-of-event-technology',
        excerpt: 'Discover how technology is revolutionizing the way we plan, execute, and experience events.',
        content: `
# The Power of Event Technology

Technology has transformed the event industry. Let's explore the key innovations.

## Event Management Platforms
Streamline planning and execution with all-in-one solutions.

## Mobile Event Apps
Enhance attendee experience with interactive mobile applications.

## Live Streaming & Recording
Extend your event's reach beyond physical boundaries.

## Data Analytics
Make data-driven decisions to improve future events.

Embrace technology to create better event experiences!
        `,
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
        category: 'Technology',
        author: {
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            role: 'Tech Consultant'
        },
        publishedAt: '2024-12-01T16:45:00Z',
        readTime: '8 min read',
        tags: ['technology', 'innovation', 'digital'],
        isPublished: true
    },
    {
        id: '5',
        title: 'Essential Event Planning Checklist',
        slug: 'essential-event-planning-checklist',
        excerpt: 'A comprehensive guide to planning successful events from start to finish.',
        content: `
# Essential Event Planning Checklist

Planning an event can be overwhelming. Use this checklist to stay organized.

## Pre-Event (3-6 months before)
- Define event goals and objectives
- Set budget and secure funding
- Choose venue and date
- Create event website

## Mid-Planning (1-3 months before)
- Finalize speakers and agenda
- Launch marketing campaign
- Open registration
- Arrange catering and logistics

## Final Preparations (1-4 weeks before)
- Confirm all vendors
- Send reminders to attendees
- Prepare event materials
- Conduct final walkthrough

## Post-Event
- Send thank you messages
- Gather feedback
- Analyze metrics
- Plan follow-up activities

Stay organized and your event will be a success!
        `,
        coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop',
        category: 'Event Planning',
        author: {
            name: 'Lisa Anderson',
            avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
            role: 'Event Planner'
        },
        publishedAt: '2024-11-28T11:20:00Z',
        readTime: '10 min read',
        tags: ['planning', 'checklist', 'organization'],
        isPublished: true
    },
    {
        id: '6',
        title: 'Networking Tips for Introverts',
        slug: 'networking-tips-for-introverts',
        excerpt: 'Practical strategies for introverts to network effectively at events without feeling overwhelmed.',
        content: `
# Networking Tips for Introverts

Networking doesn't have to be exhausting. Here are tips tailored for introverts.

## Prepare Conversation Starters
Have a few go-to questions ready to break the ice.

## Set Realistic Goals
Aim for quality connections, not quantity.

## Take Breaks
It's okay to step away and recharge when needed.

## Follow Up Online
Continue conversations in a more comfortable setting.

## Leverage Your Strengths
Use your listening skills to build deeper connections.

Remember, being an introvert is not a disadvantage in networking!
        `,
        coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop',
        category: 'Tips & Tricks',
        author: {
            name: 'James Wilson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            role: 'Career Coach'
        },
        publishedAt: '2024-11-25T13:00:00Z',
        readTime: '5 min read',
        tags: ['networking', 'introverts', 'social skills'],
        isPublished: true
    }
];

// Helper function to get articles (ready for API integration)
export const getArticles = async (params?: {
    category?: string;
    limit?: number;
    offset?: number;
}): Promise<Article[]> => {
    // TODO: Replace with actual API call
    // const response = await apiFetch<Article[]>('/articles', { params });
    
    let filtered = [...dummyArticles];
    
    if (params?.category) {
        filtered = filtered.filter(article => 
            article.category.toLowerCase() === params.category?.toLowerCase()
        );
    }
    
    if (params?.limit) {
        filtered = filtered.slice(params.offset || 0, (params.offset || 0) + params.limit);
    }
    
    return filtered;
};

// Helper function to get single article (ready for API integration)
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    // TODO: Replace with actual API call
    // const response = await apiFetch<Article>(`/articles/${slug}`);
    
    return dummyArticles.find(article => article.slug === slug) || null;
};
