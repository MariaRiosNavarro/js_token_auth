import { verifyToken } from "../utils/jwt.js";

export async function useJwtTokenAuth(req, res, next) {
  // console.log(req.headers.authorization); hier sehen die Bearer

  // wiederverwendbare funktion _invalidLogin
  const _invalidLogin = () =>
    res.status(401).json({ success: false, error: "Invalid login" }); // So wenig Informationen wie möglich geben (um Angreifer nicht zu helfen)

  // auth logic
  const authHeader = req.headers.authorization; // eg: 'Bearer dG9tLnMyMzQ1NkBnbWFpbC5jb206dG9tMTIzYWJj'
  if (!authHeader) {
    return _invalidLogin();
  }
  const [authType, tokenString] = authHeader.split(" ");
  if (authType !== "Bearer" || !tokenString) {
    return _invalidLogin();
  }

  // verify token is valid jwt and not expired
  const verifiedTokenPayload = verifyToken(tokenString); // verifiedTokenPayload are verified user claims (eg I am sub, and admin: true)
  if (!verifiedTokenPayload) return _invalidLogin();

  // pass token payload to next request handler
  req.authenticatedUserTokenPayload = verifiedTokenPayload; // { sub, type, iat, exp }

  next();
}
