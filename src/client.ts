import {
  GuardRequest,
  GuardResponse,
  CorrectRequest,
  CorrectResponse,
  ValidateResponse,
} from "./types";

export interface GuardrailClientOptions {
  baseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

export class GuardrailClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(options: GuardrailClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "https://api.guardrail.example.com";
    this.headers = {
      "Content-Type": "application/json",
      ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      ...options.headers,
    };
  }

  private async request<T>(
    path: string,
    body: unknown
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Guardrail API Error: ${res.status} ${text}`);
    }

    return res.json();
  }

  // ========================
  // Core APIs
  // ========================

  async guard(req: GuardRequest): Promise<GuardResponse> {
    return this.request("/v1/guard", req);
  }

  async correct<T = unknown>(
    req: CorrectRequest
  ): Promise<CorrectResponse<T>> {
    return this.request("/v1/correct", req);
  }

  // ========================
  // Optional APIs
  // ========================

  async sanitize(req: GuardRequest): Promise<GuardResponse> {
    return this.request("/v1/sanitize", req);
  }

  async validate(data: unknown): Promise<ValidateResponse> {
    return this.request("/v1/validate", { data });
  }

  async repair(data: unknown): Promise<{ repaired: unknown }> {
    return this.request("/v1/repair", { data });
  }

  async normalize(data: unknown): Promise<{ normalized: unknown }> {
    return this.request("/v1/normalize", { data });
  }
}
