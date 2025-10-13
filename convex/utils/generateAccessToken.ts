import axios from "axios";

export const getAuthUrl = () =>
  process.env.JENGA_AUTH_URL ||
  "https://uat.finserve.africa/authentication/api/v3/authenticate/merchant";

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
  const authToken = tokenResponse.data.accessToken;

  return authToken;
};

export default authToken;
