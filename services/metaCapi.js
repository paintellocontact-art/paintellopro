require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

// Clean phone: remove all non-digit characters
function cleannumero(numero) {
  if (!numero) return undefined;
  const cleaned = numero.replace(/\D/g, "");
  if (cleaned.startsWith("0")) return "213" + cleaned.slice(1);
  if (cleaned.startsWith("213")) return cleaned;
  return "213" + cleaned;
}
// SHA-256 hash
function hash(data) {
  return data
    ? crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex")
    : undefined;
}

const sendMetaCAPIEvent = async ({
  eventName,
  eventId,
  userData,
  customData = {},
  testEventCode = null,
}) => {
  const PIXEL_ID = process.env.FB_PIXEL_ID;
  const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

  try {
    // ✅ Step 1: Log raw input before hashing
    console.log("🔍 Raw userData before hashing:", userData);
    console.log("📞 Clean phone for hash:", cleannumero(userData.numero));

    // ✅ Step 2: Build the hashed user_data object
    const hashedUserData = {
      em: hash(userData.email),
      ph: hash(cleannumero(userData.numero)),
      fn: hash(userData.firstName),
      ln: hash(userData.lastName),
      fbc: userData.fbc,
      fbp: userData.fbp,
      client_ip_address: userData.ip,
      client_user_agent: userData.userAgent,
      country: hash(userData.country), // ✅ new
      ct: hash(userData.city)          // ✅ ct = city
    };

    

    // ✅ Step 4: Build final payload
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          user_data: hashedUserData,
          custom_data: customData,
        },
      ],
    };

    if (testEventCode) {
      payload.test_event_code = testEventCode;
      console.log("📤 Sending CAPI with test code:", testEventCode); // ✅ Here

    }

    // ✅ Step 5: Log full payload
    console.log("✅ Final user_data:", JSON.stringify(hashedUserData, null, 2));
    console.log("📦 Full payload to Meta:", JSON.stringify(payload, null, 2));

    // ✅ Step 6: Send to Meta
    const url = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const response = await axios.post(url, payload);

    console.log("✅ Meta CAPI Event Sent:", response.data);
  } catch (error) {
    console.error("❌ Meta CAPI Error:", error.response?.data || error.message);
  }
};

module.exports = sendMetaCAPIEvent;


