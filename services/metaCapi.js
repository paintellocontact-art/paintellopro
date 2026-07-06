// services/metaCapi.js - FIXED (bot check removed, uses userData already filtered)
require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

// SHA-256 hash function
function hash(data) {
  if (!data) return undefined;
  return crypto.createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}

const sendMetaCAPIEvent = async ({
  eventName,
  eventId,
  userData,
  customData = {},
  eventSourceUrl = null,
  testEventCode = null,
}) => {
  const PIXEL_ID = process.env.FB_PIXEL_ID;
  const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("❌ Missing Facebook Pixel ID or Access Token");
    return;
  }

  if (!eventName || !eventId) {
    console.error("❌ Missing eventName or eventId");
    return;
  }

  // ✅ userData is already filtered by getCleanUserData (bots return null)
  if (!userData) {
    console.log("🚫 Skipping CAPI event - No user data");
    return;
  }

  try {
    // Build user_data object
    const hashedUserData = {
      fbp: userData.fbp,
      fbc: userData.fbc,
      client_ip_address: userData.ip,
      client_user_agent: userData.userAgent,
      country: hash("algeria"),
      em: hash(userData.email),
      ph: hash(userData.numero),
      fn: hash(userData.firstName),
      ln: hash(userData.lastName),
      ct: hash(userData.city),
      external_id: hash(userData.fbp || userData.email || userData.numero)
    };

    // Remove undefined values
    Object.keys(hashedUserData).forEach(key => {
      if (hashedUserData[key] === undefined) {
        delete hashedUserData[key];
      }
    });

    const enhancedCustomData = {
      ...customData,
      currency: customData.currency || "DZD",
      content_category: customData.content_category || "paint_tools"
    };

    Object.keys(enhancedCustomData).forEach(key => {
      if (enhancedCustomData[key] === undefined) {
        delete enhancedCustomData[key];
      }
    });

   

   

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: "website",
          user_data: hashedUserData,
          custom_data: enhancedCustomData,
        },
      ],
    };

    

    const url = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    
    const response = await axios.post(url, payload, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("✅ Meta CAPI Event Sent Successfully");
    return response.data;

  } catch (error) {
    console.error("❌ Meta CAPI Error:", error.message);
    if (error.response) {
      console.error("❌ Meta API Response:", error.response.data);
    }
  }
};

module.exports = sendMetaCAPIEvent;
