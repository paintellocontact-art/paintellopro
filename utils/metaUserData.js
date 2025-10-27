const crypto = require("crypto");

// SHA256 hashing with safety
function hash(value) {
  if (!value || typeof value !== "string" || !value.trim()) return undefined;
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// Clean phone number: remove all non-digit characters
function cleanPhone(numero) {
  return numero ? numero.replace(/\D/g, "") : undefined;
}

// Get a valid IPv4 address from request
function getClientIp(req) {
  const rawIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null;
  if (!rawIp) return null;

  const ip = rawIp.includes(":") ? rawIp.split(":").pop() : rawIp;
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip) ? ip : null;
}

// Final export: user_data object (safely constructed)
function getMetaUserData(userSession = {}, req) {
  const user_data = {};

  // Hashed user fields only if present
  const email = userSession.email;
  const numero = userSession.numero;
  const fn = userSession.firstName;
  const ln = userSession.lastName;

  const ip = getClientIp(req);
  const userAgent = req.get("User-Agent");

  if (email) user_data.em = hash(email);
  if (numero) user_data.ph = hash(cleanPhone(numero));
  if (fn) user_data.fn = hash(fn);
  if (ln) user_data.ln = hash(ln);
  if (ip) user_data.client_ip_address = ip;
  if (userAgent) user_data.client_user_agent = userAgent;

  console.log("✅ Final Meta user_data:", user_data);

  return user_data;
}

module.exports = getMetaUserData;
