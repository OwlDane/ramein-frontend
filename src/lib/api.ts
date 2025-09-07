export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function apiFetch<T>(path: string, options: { method?: HttpMethod; headers?: Record<string, string>; body?: any; token?: string } = {}): Promise<T> {
	const { method = 'GET', headers = {}, body, token } = options;
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
		credentials: 'include',
	});

	if (!res.ok) {
		let msg = 'Request failed';
		try {
			const err = await res.json();
			msg = err?.message || msg;
		} catch {}
		throw new Error(msg);
	}

	try {
		return (await res.json()) as T;
	} catch {
		return undefined as unknown as T;
	}
}

export function buildQuery(params: Record<string, string | number | boolean | undefined>) {
	const q = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => {
		if (v !== undefined && v !== '') q.append(k, String(v));
	});
	return `?${q.toString()}`;
}
