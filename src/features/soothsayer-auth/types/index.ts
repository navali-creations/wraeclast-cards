export type OAuthCallbackPhase =
  | "loading"
  | "waiting"
  | "success"
  | "error"
  | "invalid";

export interface OAuthCallbackParams {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface OAuthCallbackState {
  phase: OAuthCallbackPhase;
  deepLink: string;
}
