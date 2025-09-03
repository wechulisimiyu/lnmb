import axios from "axios";

const authToken = async () => {
  const tokenResponse = await axios.post(
    "https://uat.finserve.africa/authentication/api/v3/authenticate/merchant",
    {
      merchantCode: process.env.JENGA_MERCHANT_CODE,
      consumerSecret: process.env.JENGA_CONSUMER_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.JENGA_API_KEY,
      },
    }
  );

  // The response contains accessToken field according to Jenga API docs
  const authToken = tokenResponse.data.accessToken;

  return authToken;
};

export default authToken;