import { User } from "../models/User.js";

const decodeBase64 = (base64String) =>
  Buffer.from(base64String, "base64").toString();

export async function useBasicAuth(req, res, next) {
  const invalidLogin = () => {
    res.status(401).json({
      success: false,
      error: "Invalid login",
    });
  };

  // auth logic
  const authHeader = req.headers.authorization; //
  if (!authHeader) return invalidLogin;
  const [authType, authInfoBase64] = authHeader.split(" ");
  // new small error Handling
  if (authType !== "Basic" || !authInfoBase64) return invalidLogin;

  /// base64 -> klartext
  const authInfo = decodeBase64(authInfoBase64); //
  const [email, password] = authInfo.split(":"); //
  // new small error Handling
  if (!email || !password) return invalidLogin;

  // Email & Password verification
  const user = await User.findOne({ email });
  // new small error Handling
  if (!user) return invalidLogin;

  const passwordMatch = user.password === password;
  // new small error Handling
  if (!passwordMatch) return invalidLogin;

  next(); // geh zum eigentlichen request handler
}

//1.- Wenn password falsch ausgegeben werden, sollten nicht allzu viele informationen geben warum, hacker nutzen diese als info. UN user wissen schon was si falsch gemacht haben-
// Also Ändern alle error meldungen auf Invalid Login, also alle weg // error: "Invalid password",// error: "Unknown user with email " + email,// error: "Please authenticate using basic auth",
// error: "Please authenticate using basic auth", // error: "Please authenticate",
//2.- Kompakterer Code mit :INVALID FUNCTION statt immer wieder der error handling zu wiederholen
