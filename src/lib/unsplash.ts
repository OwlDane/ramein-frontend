/**
 * Unsplash API Service
 * Handles image fetching with proper error handling, rate limiting, and fallbacks
 */

export interface UnsplashImage {
    id: string;
    urls: {
        small: string;
        regular: string;
        full: string;
    };
    alt_description: string;
    user: {
        name: string;
    };
}

export interface UnsplashSearchResponse {
    results: UnsplashImage[];
    total: number;
    total_pages: number;
}

class UnsplashService {
    private readonly baseUrl = 'https://api.unsplash.com';
    private readonly accessKey: string;
    private readonly perPage = 10;
    private requestCount = 0;
    private lastRequestTime = 0;
    private readonly rateLimit = 50; // requests per hour
    private readonly rateLimitWindow = 60 * 60 * 1000; // 1 hour in milliseconds

    constructor() {
        this.accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';

        if (!this.accessKey) {
            console.warn('Unsplash API key not found. Using fallback images only.');
        }
    }

    /**
     * Check if we're within rate limits
     */
    private canMakeRequest(): boolean {
        const now = Date.now();

        // Reset counter if window has passed
        if (now - this.lastRequestTime > this.rateLimitWindow) {
            this.requestCount = 0;
            this.lastRequestTime = now;
        }

        return this.requestCount < this.rateLimit;
    }

    /**
     * Make a request to Unsplash API with rate limiting
     */
    private async makeRequest<T>(endpoint: string): Promise<T> {
        if (!this.accessKey) {
            // Return empty results instead of throwing error when API key is not configured
            console.warn('Unsplash API key not configured. Using fallback images.');
            return { results: [], total: 0, total_pages: 0 } as T;
        }

        if (!this.canMakeRequest()) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        this.requestCount++;
        this.lastRequestTime = Date.now();

        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${this.accessKey}`,
                'Accept-Version': 'v1',
            },
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Rate limit exceeded or API key invalid');
            }
            if (response.status === 404) {
                throw new Error('Image not found');
            }
            throw new Error(`Unsplash API error: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Search for images by query
     */
    async searchImages(query: string, page = 1): Promise<UnsplashImage[]> {
        try {
            const params = new URLSearchParams({
                query,
                page: page.toString(),
                per_page: this.perPage.toString(),
                orientation: 'landscape',
            });

            const response = await this.makeRequest<UnsplashSearchResponse>(
                `/search/photos?${params}`
            );

            return response.results || [];
        } catch (error) {
            console.error('Error searching Unsplash images:', error);
            return [];
        }
    }

    /**
     * Get a random image for a specific category
     */
    async getRandomImage(category: string): Promise<UnsplashImage | null> {
        try {
            const images = await this.searchImages(category, 1);
            if (images.length > 0) {
                return images[Math.floor(Math.random() * images.length)];
            }
            return null;
        } catch (error) {
            console.error('Error getting random image:', error);
            return null;
        }
    }

    /**
     * Get multiple random images for a category
     */
    async getRandomImages(category: string, count: number): Promise<UnsplashImage[]> {
        try {
            const images = await this.searchImages(category, 1);
            const shuffled = images.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            console.error('Error getting random images:', error);
            return [];
        }
    }

    /**
     * Get fallback image URL for when Unsplash fails
     */
    getFallbackImageUrl(seed: string, width = 800, height = 600): string {
        return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
    }

    /**
     * Get avatar fallback URL
     */
    getAvatarFallbackUrl(seed: string, size = 150): string {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&size=${size}&background=random&color=fff&bold=true`;
    }

    /**
     * Get event-related images with fallback
     */
    async getEventImages(eventTitle: string, count = 4): Promise<string[]> {
        try {
            const images = await this.getRandomImages(eventTitle, count);
            if (images.length > 0) {
                return images.map(img => img.urls.regular);
            }
            // If no images returned (e.g., no API key), use fallback
            return Array.from({ length: count }, (_, i) =>
                this.getFallbackImageUrl(`${eventTitle}-${i}`, 800, 600)
            );
        } catch (error) {
            console.error('Error getting event images:', error);
            // Return fallback images
            return Array.from({ length: count }, (_, i) =>
                this.getFallbackImageUrl(`${eventTitle}-${i}`, 800, 600)
            );
        }
    }

    /**
     * Get testimonial avatar with fallback
     */
    async getTestimonialAvatar(name: string): Promise<string> {
        try {
            const images = await this.searchImages(`portrait ${name}`, 1);
            if (images.length > 0) {
                return images[0].urls.small;
            }
        } catch (error) {
            console.error('Error getting testimonial avatar:', error);
        }

        // Return fallback avatar (always works, even without API key)
        return this.getAvatarFallbackUrl(name, 150);
    }
}

// Export singleton instance
export const unsplashService = new UnsplashService();

// Export utility functions for easy use
export const getFallbackImageUrl = (seed: string, width = 800, height = 600) =>
    unsplashService.getFallbackImageUrl(seed, width, height);

export const getAvatarFallbackUrl = (seed: string, size = 150) =>
    unsplashService.getAvatarFallbackUrl(seed, size);

export const getEventImages = (eventTitle: string, count = 4) =>
    unsplashService.getEventImages(eventTitle, count);

export const getTestimonialAvatar = (name: string) =>
    unsplashService.getTestimonialAvatar(name);
