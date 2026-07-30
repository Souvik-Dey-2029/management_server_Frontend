export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    throw new ApiError((data && data.error) || res.statusText, res.status);
  }
  return data as T;
}

export const fetcher = (url: string): Promise<any> => apiFetch(url); // eslint-disable-line @typescript-eslint/no-explicit-any
