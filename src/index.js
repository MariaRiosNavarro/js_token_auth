import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { Boot } from "./models/Boot.js";
import { User } from "./models/User.js";
import { useBasicAuth } from "./middleware/basicAuth.js";
import { hashPassword } from "./utils/hash.js";
import { generateToken } from "./utils/jwt.js";
import { useJwtTokenAuth } from "./middleware/jwtTokenAuth.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(morgan("dev")); //logger in dev format-sehe die Anfragen
app.use(cors());
// app.use(express.json()); Parser for post route , here or in the route

// Get all
app.get("/api/boot", async (_, res) => {
  try {
    const boote = await Boot.find({}, { besitzer: 0 }); //Projection um die Besitzer nicht zu sehen, geheim
    // throw new Error("Mein Error");
    res.json({ success: true, result: boote });
  } catch (error) {
    console.log("Error is", error);
    res.status(500).json({ success: false, error });
  }
});

// --------------PROTECTed ROUTES WITH TOKEN Middleware

// Protected Route(*) - wechseln der basic für die token
// dann mussen wir den token in header senden
// Get one
app.get(
  "/api/boot/:bootId",
  // useBasicAuth, //
  useJwtTokenAuth,
  async (req, res) => {
    try {
      const boot = await Boot.findById(req.params.bootId).exec();
      // throw new Error("Mein Error");
      res.json({ success: true, result: boot });
    } catch (error) {
      console.log("Error is", error);
      res.status(500).json({ success: false, error });
    }
  }
);

// Protected Route(*)
// Add One
app.post(
  "/api/boot",
  express.json(),
  //   useBasicAuth,
  useJwtTokenAuth,
  async function postAddBoot(req, res) {
    try {
      const boot = await Boot.create({
        name: req.body.name,
        preis: req.body.preis,
        besitzer: req.body.besitzer,
        ownerId: new mongoose.Types.ObjectId(
          req.authenticatedUserTokenPayload.sub
        ),
      });
      res.status(201).json({ success: true, result: boot });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  }
);

// -----------LOGIN ROUTE

// BASIC LOGIN

app.post(
  "/api/login/basic",
  express.json(),
  useBasicAuth,
  function postLogin(_, res) {
    // wenn ich an diesen Punkt gelange wurde ich erfolgreich authentifiziert (aufgrund der useBasicAuth middleware, sonst hätte die mit res.status(401) abgebrochen)
    // mit dem einfach success true weiß das FE bescheid, dass es username und password zu speichern sind (für zukünftige Abfragen)
    res.json({ success: true });
  }
);

// NEUE LOGIN FÜR TOKENS

app.post("/api/login", express.json(), async (req, res) => {
  const _invalidLogin = () =>
    res.status(401).json({ success: false, error: "Invalid login" }); // So wenig Informationen wie möglich geben (um Angreifer nicht zu helfen)
  const email = req.body.email;
  const passwordClearText = req.body.password;
  const user = await User.findOne({ email });
  if (!user) return _invalidLogin();
  const passwordMatch =
    user.password === hashPassword(passwordClearText, user.passwordSalt);
  if (!passwordMatch) return _invalidLogin();

  // login success
  const token = generateToken(user);
  //
  res.json({ success: true, result: { token } });
  // Man konnte in zukunft ein refresh token oder anderen infromationen mitsenden
});

//

// POST/Register,

// Suchen sha512 in node.js in google (https://www.nodejsera.com/snippets/nodejs/sha512-hash.html)
// Nutzen Crypto ist in node Installiert

app.post("/api/register", express.json(), async (req, res) => {
  try {
    const user = await User.create({
      vorname: req.body.vorname,
      nachname: req.body.nachname,
      email: req.body.email,
      password: req.body.password,
      // password: hash(req.body.password), //wir nutzen hier unsere HASH funktion
    });
    res.status(201).json({ success: true, result: user });
  } catch (error) {
    console.log("Error is", error);
    res.status(500).json({ success: false, error });
  }
});

const setup = async () => {
  // warte die conexion
  const db_url = process.env.MONGODB_URL;
  await mongoose.connect(db_url);

  console.log("Connected to db", db_url);

  app.listen(PORT, () =>
    console.log(console.log("Server ready at port:http://localhost:" + PORT))
  );
};

setup();
