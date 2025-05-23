import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
  return token;
};

export const generateRefreshToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
  return token;
}

