import { User } from "../models/User.js";
import { hashPassword } from "../utils/hash.js";

const decodeBase64 = (base64String) =>
  Buffer.from(base64String, "base64").toString();

export async function useBasicAuth(req, res, next) {
  // wiederverwendbare funktion _invalidLogin
  const _invalidLogin = () =>
    res.status(401).json({ success: false, error: "Invalid login" }); // So wenig Informationen wie möglich geben (um Angreifer nicht zu helfen)

  // auth logic
  const authHeader = req.headers.authorization; // eg: 'Basic dG9tLnMyMzQ1NkBnbWFpbC5jb206dG9tMTIzYWJj'
  if (!authHeader) {
    return _invalidLogin();
  }
  const [authType, authInfoBase64] = authHeader.split(" ");
  if (authType !== "Basic" || !authInfoBase64) {
    return _invalidLogin();
  }

  /// base64 -> klartext
  const authInfo = decodeBase64(authInfoBase64); // eg: 'tom.s23456@gmail.com:tom123abc'
  const [email, passwordClearText] = authInfo.split(":"); // ['tom.s23456@gmail.com', 'tom123abc']
  if (!email || !passwordClearText) {
    return _invalidLogin();
  }

  // email & password
  const user = await User.findOne({ email });
  if (!user) {
    return _invalidLogin();
  }

  // old match -> if clear text password in database
  // const passwordMatch = user.password === password;

  const passwordMatch =
    user.password === hashPassword(passwordClearText, user.passwordSalt);

  if (!passwordMatch) {
    return _invalidLogin();
  }

  next(); // geh zum eigentlichen request handler
}

//1.- Wenn password falsch ausgegeben werden, sollten nicht allzu viele informationen geben warum, hacker nutzen diese als info. UN user wissen schon was si falsch gemacht haben-
// Also Ändern alle error meldungen auf Invalid Login, also alle weg // error: "Invalid password",// error: "Unknown user with email " + email,// error: "Please authenticate using basic auth",
// error: "Please authenticate using basic auth", // error: "Please authenticate",
//2.- Kompakterer Code mit :INVALID FUNCTION statt immer wieder der error handling zu wiederholen
