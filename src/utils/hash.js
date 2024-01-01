// //Loading the crypto module in node.js
// import crypto from "crypto";

// // DAS HIER UNTEN von https://www.nodejsera.com/snippets/nodejs/sha512-hash.html
// // machen damit unten eine Funktion
// // //creating hash object
// // let hash = crypto.createHash("sha512");
// // //passing the data to be hashed
// // data = hash.update("nodejsera", "utf-8");
// // //Creating the hash in the required format
// // gen_hash = data.digest("hex");
// // //Printing the output on the console

// // console.log("hash : " + gen_hash);

// export const hash = (inputString) => {
//   return crypto.createHash("sha512").update(inputString, "utf-8").digest("hex");
// };

// export function hashPassword(password, passwordSalt) {
//   return hash(`${password}:${passwordSalt}`);
// }

// export const getRandomSalt = () => {
//   return crypto.randomBytes(32).toString("hex");
// };

import crypto from "crypto";

function hash(inputStr) {
  return crypto.createHash("sha512").update(inputStr, "utf-8").digest("hex");
}

export function hashPassword(password, passwordSalt) {
  return hash(`${password}:${passwordSalt}`);
}

export function genRandomSalt() {
  return crypto.randomBytes(32).toString("hex");
}
