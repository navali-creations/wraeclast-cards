import { describe, expect, it } from "vitest";
import { createDropRateRequestHeaders } from "./drop-rate-request.mjs";

describe("createDropRateRequestHeaders", () => {
  it("includes the configured caller token", () => {
    expect(
      createDropRateRequestHeaders({
        apiKey: "api-key",
        callerToken: " caller-token ",
      }),
    ).toEqual({
      Accept: "application/json",
      "x-api-key": "api-key",
      "x-caller-token": "caller-token",
    });
  });

  it.each([
    null,
    undefined,
    "",
    "   ",
  ])("omits an unconfigured caller token (%s)", (callerToken) => {
    expect(
      createDropRateRequestHeaders({ apiKey: "api-key", callerToken }),
    ).toEqual({
      Accept: "application/json",
      "x-api-key": "api-key",
    });
  });
});
