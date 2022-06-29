const crypto = require("crypto")

const sha256Hash = (value, secretKey) => {
  const hash = crypto.createHash("sha256");
  return hash.update(`${value}${secretKey}`).digest("hex");
}

module.exports = { sha256Hash }