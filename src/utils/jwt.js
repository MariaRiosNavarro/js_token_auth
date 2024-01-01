import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(
    {
      sub: user._id.toString(), // 63839303...,
      type: "access",
    },
    secret,
    { algorithm: "HS512", expiresIn: "1h" }
  );
};

export const verifyToken = (tokenString) => {
  try {
    const secret = process.env.JWT_SECRET;
    const tokenPayload = jwt.verify(tokenString, secret);
    return tokenPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// console.log(generateToken({ _id: "userId123" }));

// console.log(
//   verifyToken(
//     "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTkyZmYyMmU5YmUwODkxM2I3YzdkM2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzA0MTQwMDUwLCJleHAiOjE3MDQxNDM2NTB9.G5Mh0sq2QAR8zojab--GSZhDy9uZF6RuyR3os0ZFklKgBR56hBnbTUw0RjJ_XJJhZvFDJkaLc2Wk28hVndGCrA"
//   )
// );
