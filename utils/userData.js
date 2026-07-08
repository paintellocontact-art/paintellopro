// utils/userData.js
const { isBotRequest, extractIP } = require("./botDetection");

const COUNTRY_MAPPING = {
  algeria: "dz",
  "algérie": "dz",
  algerie: "dz",
  dz: "dz",
  dza: "dz",
  france: "fr",
  fr: "fr",
  "united states": "us",
  usa: "us",
  us: "us",
  "united kingdom": "gb",
  uk: "gb",
  gb: "gb",
  canada: "ca",
  ca: "ca",
  morocco: "ma",
  maroc: "ma",
  ma: "ma",
  tunisia: "tn",
  tunisie: "tn",
  tn: "tn",
};

function cleanString(value) {
  if (value === undefined || value === null) return null;
  const clean = String(value).trim().toLowerCase();
  return clean || null;
}

function cleanEmail(email) {
  const clean = cleanString(email);
  if (!clean) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? clean : null;
}

function cleanPhoneNumber(phone) {
  if (phone === undefined || phone === null) return null;

  let cleanPhone = String(phone).replace(/\D/g, "");
  if (!cleanPhone) return null;

  if (cleanPhone.startsWith("00")) cleanPhone = cleanPhone.slice(2);
  if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.replace(/^0+/, "");
  if (cleanPhone.length === 9 && /^[567]/.test(cleanPhone)) cleanPhone = `213${cleanPhone}`;

  if (/^213[567]\d{8}$/.test(cleanPhone)) return cleanPhone;
  if (/^\d{8,15}$/.test(cleanPhone)) return cleanPhone;

  return null;
}

function cleanCountry(country) {
  const cleaned = cleanString(country);
  if (!cleaned) return null;
  if (/^[a-z]{2}$/.test(cleaned)) return cleaned;
  return COUNTRY_MAPPING[cleaned] || cleaned;
}

function pick(source, keys) {
  for (const key of keys) {
    if (source && source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return source[key];
    }
  }
  return null;
}

function splitName(fullName) {
  const clean = cleanString(fullName);
  if (!clean) return {};
  const parts = clean.split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || null, lastName: parts.length > 1 ? parts.slice(1).join(" ") : null };
}

function applyUserFields(userData, source = {}) {
  const email = cleanEmail(pick(source, ["email"]));
  const phone = cleanPhoneNumber(pick(source, ["numero", "phone", "telephone", "tel"]));

  if (!userData.email && email) userData.email = email;
  if (!userData.numero && phone) userData.numero = phone;

  const firstName = cleanString(pick(source, ["firstName", "firstname", "first_name"]));
  const lastName = cleanString(pick(source, ["lastName", "lastname", "last_name"]));
  const split = splitName(pick(source, ["name", "fullName", "fullname"]));

  if (!userData.firstName) userData.firstName = firstName || split.firstName || null;
  if (!userData.lastName) userData.lastName = lastName || split.lastName || null;

  const city = cleanString(pick(source, ["city", "commune", "wilaya"]));
  const state = cleanString(pick(source, ["state", "wilaya"]));
  const zipCode = cleanString(pick(source, ["zipCode", "zip", "postalCode", "postal_code"]));
  const country = cleanCountry(pick(source, ["country", "pays"]));

  if (!userData.city && city) userData.city = city;
  if (!userData.state && state) userData.state = state;
  if (!userData.zipCode && zipCode) userData.zipCode = zipCode;
  if (!userData.country && country) userData.country = country;

  const externalId = pick(source, ["externalId", "userId", "customerId", "_id", "id"]);
  if (!userData.externalId && externalId) userData.externalId = String(externalId);
}

function cleanIp(ip) {
  if (!ip) return null;
  return String(ip).split(",")[0].trim().replace(/^::ffff:/, "") || null;
}

function buildFbc(req, cookies) {
  if (cookies._fbc) return cookies._fbc;
  const fbclid = req.query?.fbclid;
  if (!fbclid) return null;
  return `fb.1.${Date.now()}.${fbclid}`;
}

function removeEmpty(obj) {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== "") cleaned[key] = value;
  }
  return cleaned;
}

function getCleanUserData(req) {
  if (!req) return null;
  if (isBotRequest(req)) return null;

  const cookies = req.cookies || {};
  const userAgent = req.get?.("User-Agent") || req.headers?.["user-agent"] || "";

  const userData = {
    ip: cleanIp(extractIP(req)),
    userAgent,
    fbp: cookies._fbp || null,
    fbc: buildFbc(req, cookies),
  };

  applyUserFields(userData, req.body || {});
  applyUserFields(userData, req.user || {});
  applyUserFields(userData, req.session?.user || {});
  applyUserFields(userData, req.session?.confirmationData || {});

  if (!userData.country) userData.country = process.env.DEFAULT_COUNTRY || "dz";

  return removeEmpty(userData);
}

module.exports = getCleanUserData;
module.exports.cleanString = cleanString;
module.exports.cleanEmail = cleanEmail;
module.exports.cleanPhoneNumber = cleanPhoneNumber;
module.exports.cleanCountry = cleanCountry;
