export type ApiErrorResponse = {
  error: { code: string; message: string; requestId?: string; details?: unknown };
};

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly requestId?: string;
  public readonly details?: unknown;

  constructor(params: { status: number; message: string; code?: string; requestId?: string; details?: unknown }) {
    super(params.message);
    this.status = params.status;
    this.code = params.code;
    this.requestId = params.requestId;
    this.details = params.details;
  }
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('content-type') && init?.body) headers.set('content-type', 'application/json');

  const res = await fetch(path, { ...init, headers });
  const isJson = res.headers.get('content-type')?.includes('application/json') ?? false;

  if (!res.ok) {
    if (isJson) {
      const body = (await res.json()) as ApiErrorResponse;
      throw new ApiClientError({
        status: res.status,
        code: body?.error?.code,
        requestId: body?.error?.requestId,
        message: body?.error?.message ?? 'Request failed.',
        details: body?.error?.details,
      });
    }
    throw new ApiClientError({ status: res.status, message: 'Request failed.' });
  }

  if (res.status === 204) return undefined as T;
  if (!isJson) throw new ApiClientError({ status: res.status, message: 'Expected JSON response.' });
  return (await res.json()) as T;
}

