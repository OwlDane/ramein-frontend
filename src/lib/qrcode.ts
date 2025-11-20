import QRCode from 'qrcode';

export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Generate QR code as Data URL
 */
export async function generateQRCode(
    text: string,
    options?: QRCodeOptions
): Promise<string> {
    try {
        // Check if running in browser (SSR safe)
        if (typeof window === 'undefined') {
            throw new Error('QR code generation requires browser environment');
        }

        // Validate text
        if (!text || text.trim() === '') {
            throw new Error('QR code text cannot be empty');
        }

        const defaultOptions: QRCodeOptions = {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
            errorCorrectionLevel: 'H',
            ...options,
        };

        return await QRCode.toDataURL(text, defaultOptions);
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Generate QR code as Canvas element
 */
export async function generateQRCodeCanvas(
    text: string,
    canvas: HTMLCanvasElement,
    options?: QRCodeOptions
): Promise<void> {
    try {
        const defaultOptions: QRCodeOptions = {
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'H',
            ...options,
        };

        await QRCode.toCanvas(canvas, text, defaultOptions);
    } catch (error) {
        console.error('Error generating QR code on canvas:', error);
        throw new Error('Failed to generate QR code on canvas');
    }
}

/**
 * Validate token format (10 digits)
 */
export function validateTokenFormat(token: string): boolean {
    return /^\d{10}$/.test(token);
}
