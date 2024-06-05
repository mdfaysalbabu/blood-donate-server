import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const accessToken = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return accessToken;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtToken = {
  generateToken,
  verifyToken,
};
