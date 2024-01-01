import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { Boot } from "./models/Boot.js";
import { useBasicAuth } from "./middleware/basicAuth.js";

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

// --------------PROTECTed ROUTES WITH useBasicAuth Middleware

// //  machen eine Function mit Buffer um in die Protected ruten zu nutzen

// const decodeBase64 = (base64String) =>
//   Buffer.from(base64String, "base64").toString();

// Protected Route(*)
// Get one
app.get(
  "/api/boot/:bootId",
  useBasicAuth, // entweder scheitert die auth ----- OOOOODER --> next()
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
app.post("/api/boot", express.json(), useBasicAuth, async (req, res) => {
  try {
    const boot = await Boot.create({
      name: req.body.name,
      preis: req.body.preis,
      besitzer: req.body.besitzer,
    });
    res.status(201).json({ success: true, result: boot });
  } catch (error) {
    console.log("Error is", error);
    res.status(500).json({ success: false, error });
  }
});

// -----------LOGIN ROUTE

app.post("/api/login", express.json(), useBasicAuth, (_, res) => {
  res.json({ success: true }); //wenn ich hier gelange würde ich autentifiziert, aufgrund der Middelware (useBasicAuth)
  // mit den einfach success true weiß den Frontend bescheid, dass user und password zu speichern sind, für zukünftige Anfragen
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
