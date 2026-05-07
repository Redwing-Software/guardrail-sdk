export interface GuardRequest {
  input: string;
  config?: {
    strip_injection?: boolean;
    remove_secrets?: boolean;
    max_length?: number;
  };
}

export interface GuardResponse {
  sanitized: string;
  removed?: string[];
  risk_score?: number;
}

export interface CorrectRequest {
  output: unknown;
  schema?: object;
  enum_constraints?: Record<string, string[]>;
}

export interface Issue {
  type: string;
  message: string;
  field?: string;
}

export interface CorrectResponse<T = unknown> {
  data: T;
  issues: Issue[];
  confidence: number;
}

export interface ValidateResponse {
  valid: boolean;
  issues: Issue[];
}
