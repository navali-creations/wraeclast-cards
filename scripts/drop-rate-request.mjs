export function createDropRateRequestHeaders({ apiKey, callerToken }) {
  const normalizedCallerToken = callerToken?.trim();

  return {
    Accept: "application/json",
    "x-api-key": apiKey,
    ...(normalizedCallerToken
      ? { "x-caller-token": normalizedCallerToken }
      : {}),
  };
}
