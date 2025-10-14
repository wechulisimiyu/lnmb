import axios from "axios";

export const getAuthUrl = () =>
  // Prefer explicit environment variable. In production, require it to be set
  // to avoid accidentally hitting the UAT endpoint. In non-production we
  // fall back to the UAT URL for developer convenience but still log a
  // warning so the issue is visible.
  (() => {
    if (process.env.JENGA_AUTH_URL) return process.env.JENGA_AUTH_URL;
    const fallback = "https://uat.finserve.africa/authentication/api/v3/authenticate/merchant";
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing JENGA_AUTH_URL environment variable in production. Please set JENGA_AUTH_URL to your Jenga authentication endpoint."
      );
    }
    // Non-production: warn and return fallback
    try {
      // eslint-disable-next-line no-console
      console.warn(
        `JENGA_AUTH_URL not set, falling back to UAT auth URL: ${fallback}`,
      );
    } catch (e) {
      // ignore logging failures
    }
    return fallback;
  })();

const authToken = async () => {
  const authUrl = getAuthUrl();

  // Basic environment validation for clearer failures in CI/dev
  if (!process.env.JENGA_MERCHANT_CODE) {
    throw new Error("Missing JENGA_MERCHANT_CODE environment variable");
  }
  if (!process.env.JENGA_CONSUMER_SECRET) {
    throw new Error("Missing JENGA_CONSUMER_SECRET environment variable");
  }
  if (!process.env.JENGA_API_KEY) {
    throw new Error("Missing JENGA_API_KEY environment variable");
  }

  try {
    const tokenResponse = await axios.post(
      authUrl,
      {
        merchantCode: process.env.JENGA_MERCHANT_CODE,
        consumerSecret: process.env.JENGA_CONSUMER_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.JENGA_API_KEY,
        },
      },
    );

    // The response contains accessToken field according to Jenga API docs
    const authToken = tokenResponse?.data?.accessToken;
    if (!authToken) {
      throw new Error(
        `Jenga auth response did not contain accessToken. Response: ${JSON.stringify(
          tokenResponse?.data,
        )}`,
      );
    }

    return authToken;
  } catch (err: any) {
    // Surface a helpful error message including the target URL and the
    // underlying axios error where possible.
    const message = `Failed to get Jenga auth token from ${authUrl}: ${
      err?.message || String(err)
    }`;
    // eslint-disable-next-line no-console
    console.error(message, err);
    throw new Error(message);
  }
};

export default authToken;
