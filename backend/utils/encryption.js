const crypto = require("crypto");

// Generate RSA keys for encryption
const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return { publicKey, privateKey };
};

// Encrypt Message
const encryptMessage = (message, publicKey) => {
  return crypto.publicEncrypt(publicKey, Buffer.from(message)).toString("base64");
};

// Decrypt Message
const decryptMessage = (encryptedMessage, privateKey) => {
  return crypto.privateDecrypt(privateKey, Buffer.from(encryptedMessage, "base64")).toString();
};

module.exports = { generateKeyPair, encryptMessage, decryptMessage };
