import { createJWT, validateJWT } from "oslo/jwt";
import { TimeSpan } from "oslo";

const getSecrec = async () => {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(process.env.TOKEN_SECRET);
  return uint8Array.buffer as ArrayBuffer;
};

export const createToken = async (userId: string) => {
  const secret = await getSecrec();
  const payload = {};
  const options = {
    subject: userId,
    expiresIn: new TimeSpan(30, "d"),
    includeIssuedTimestamp: true,
  };
  try {
    const jwt = await createJWT("HS256", secret, payload, options);
    return jwt;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const validateToken = async (token: string) => {
  const secret = await getSecrec();
  try {
    const decodedToken = await validateJWT("HS256", secret, token);
    return decodedToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
