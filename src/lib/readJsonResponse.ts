export async function readJsonResponse(
  response: Response,
  label: string,
): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`${label} failed: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("json")) {
    const preview = (await response.text()).replace(/\s+/g, " ").slice(0, 120);
    throw new Error(
      `${label} returned ${contentType || "an unknown content type"} instead of JSON${preview ? `: ${preview}` : ""}`,
    );
  }

  try {
    return await response.json();
  } catch (cause) {
    throw new Error(`${label} returned invalid JSON`, { cause });
  }
}
