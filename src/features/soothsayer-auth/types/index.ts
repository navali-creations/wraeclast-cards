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

export type OAuthCallbackState =
  | { phase: "loading" | "waiting" | "success" | "error"; deepLink: string }
  | { phase: "invalid"; deepLink?: never };
