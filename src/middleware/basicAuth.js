import { User } from "../models/User.js";

const decodeBase64 = (base64String) =>
  Buffer.from(base64String, "base64").toString();

export async function useBasicAuth(req, res, next) {
  // auth logic
  const authHeader = req.headers.authorization; // eg: 'Basic dG9tLnMyMzQ1NkBnbWFpbC5jb206dG9tMTIzYWJj'
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Please authenticate",
    });
  }
  const [authType, authInfoBase64] = authHeader.split(" ");
  if (authType !== "Basic" || !authInfoBase64) {
    return res.status(401).json({
      success: false,
      error: "Please authenticate using basic auth",
    });
  }

  /// base64 -> klartext
  const authInfo = decodeBase64(authInfoBase64); // eg: 'tom.s23456@gmail.com:tom123abc'
  const [email, password] = authInfo.split(":"); // ['tom.s23456@gmail.com', 'tom123abc']
  if (!email || !password) {
    return res.status(401).json({
      success: false,
      error: "Please authenticate using basic auth",
    });
  }

  // Email & Password verification
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Unknown user with email " + email,
    });
  }

  const passwordMatch = user.password === password;
  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      error: "Invalid password",
    });
  }
  next(); // geh zum eigentlichen request handler
}

// console.log("headers", req.headers);
// // auth logic
// const authHeader = req.headers.authorization;
// const [authType, authInfoBase64] = authHeader.split(" ");
// // Wenn kein Autorisieruns
// if (!authHeader) {
//   return res.status(401).json({
//     success: false,
//     error: "Please authenticate",
//   });
// }
// // wenn nicht die richtige Autentifizierung ist
// if (authType !== "Basic" || !authInfoBase64) {
//   return res.status(401).json({
//     success: false,
//     error: "Please authenticate using basic auth",
//   });
// }

// // base 64 ->Klartext->

// const authInfo = decodeBase64(authInfoBase64); //maria@hotmail.com:123maria
// const [email, password] = authInfo.split(":"); //["maria@hotmail.com", "123maria"]

// if (!email || !password) {
//   return res.status(401).jsonp({
//     success: false,
//     error: "Please authenticate using basic auth",
//   });
// }

// // Email & Password verification

// const user = await User.findOne({ email });
// if (!user) {
//   return res.status(401).jsonp({
//     success: false,
//     error: "Unknow User with email" + email,
//   });
// }

// const passwordMatch = user.password === password;

// if (!passwordMatch) {
//   return res.status(401).jsonp({
//     success: false,
//     error: "Invalid Password",
//   });
// }
