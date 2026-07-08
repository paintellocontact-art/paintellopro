// utils/botDetection.js
function getHeader(req, name) {
  if (!req) return "";
  if (typeof req.get === "function") return req.get(name) || "";
  const headers = req.headers || {};
  return headers[name.toLowerCase()] || headers[name] || "";
}

function extractIP(req = {}) {
  const headers = req.headers || {};
  const ip = headers["cf-connecting-ip"] ||
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    headers["x-real-ip"] ||
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "";

  return String(ip).split(",")[0].trim().replace(/^::ffff:/, "") || "0.0.0.0";
}

function matchesAny(value, patterns) {
  return patterns.some(pattern => pattern.test(value));
}

const META_SCANNERS = [/facebookexternalhit/i, /facebot/i, /meta-externalagent/i, /meta-externalfetcher/i, /facebookcatalog/i, /instagrambot/i];
const AI_BOTS = [/gptbot/i, /chatgpt-user/i, /claudebot/i, /claude-web/i, /anthropic/i, /perplexitybot/i, /bytespider/i, /ccbot/i, /google-extended/i, /applebot-extended/i, /amazonbot/i, /cohere/i, /mistral/i, /diffbot/i];
const SOCIAL_PREVIEWS = [/twitterbot/i, /linkedinbot/i, /slackbot/i, /discordbot/i, /telegrambot/i, /whatsapp/i, /pinterest/i, /skypeuripreview/i, /viber/i, /snapchat/i, /tumblr/i, /redditbot/i, /mastodon/i];
const SEO_AND_AD_BOTS = [/googlebot/i, /adsbot-google/i, /mediapartners-google/i, /bingbot/i, /bingpreview/i, /adidxbot/i, /yandexbot/i, /baiduspider/i, /sogou/i, /slurp/i, /duckduckbot/i, /ahrefsbot/i, /semrushbot/i, /semrush/i, /dotbot/i, /mj12bot/i, /petalbot/i, /screaming frog/i, /siteaudit/i, /majestic/i, /serpstat/i];
const MONITORING_TOOLS = [/uptimerobot/i, /pingdom/i, /gtmetrix/i, /lighthouse/i, /pagespeed/i, /datadog/i, /newrelic/i, /sentry/i, /bugsnag/i, /rollbar/i];
const TECHNICAL_CLIENTS = [/\bcurl\b/i, /\bwget\b/i, /python-requests/i, /go-http-client/i, /java\//i, /powershell/i, /libwww/i, /httpclient/i, /axios/i, /node-fetch/i, /scrapy/i, /guzzlehttp/i, /urllib/i, /phantomjs/i, /puppeteer/i, /selenium/i, /playwright/i, /webdriver/i, /postman/i, /insomnia/i, /jmeter/i, /aiohttp/i, /reqwest/i];

function isMetaSecurityScanner(userAgent) { return matchesAny(userAgent, META_SCANNERS); }
function isLegitimateAIBot(userAgent) { return matchesAny(userAgent, AI_BOTS); }
function isMaliciousAIBot(userAgent) { return matchesAny(userAgent, AI_BOTS); }
function isSocialPreview(userAgent) { return matchesAny(userAgent, SOCIAL_PREVIEWS); }
function isSEOTool(userAgent) { return matchesAny(userAgent, SEO_AND_AD_BOTS); }
function isMonitoringTool(userAgent) { return matchesAny(userAgent, MONITORING_TOOLS); }
function isAdBot(userAgent) { return matchesAny(userAgent, SEO_AND_AD_BOTS); }
function isTechnicalBot(userAgent) { return matchesAny(userAgent, TECHNICAL_CLIENTS); }

function isCloudBotIP(ip) {
  if (!ip) return false;
  const narrowBotPrefixes = ["66.249.", "64.233.", "72.14.", "74.125.", "216.239.", "40.77.", "157.55.", "207.46."];
  return narrowBotPrefixes.some(prefix => String(ip).startsWith(prefix));
}

function isSuspiciousPattern(userAgent) {
  if (!userAgent || userAgent.trim() === "") return true;
  if (userAgent.length < 15) return true;
  if (userAgent === "Mozilla" || userAgent === "Mozilla/5.0") return true;

  const lowerUserAgent = userAgent.toLowerCase();
  const hasBrowserMarker = /mozilla|chrome|safari|firefox|edg\//i.test(userAgent);
  const hasBotWord = /bot|crawler|spider|scraper/i.test(userAgent);

  return hasBotWord && !hasBrowserMarker && !lowerUserAgent.includes("googlebot");
}

function isBotUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== "string") return false;
  return isMetaSecurityScanner(userAgent) ||
    isLegitimateAIBot(userAgent) ||
    isSocialPreview(userAgent) ||
    isSEOTool(userAgent) ||
    isMonitoringTool(userAgent) ||
    isTechnicalBot(userAgent) ||
    isSuspiciousPattern(userAgent);
}

function isBotRequest(req, options = {}) {
  const userAgent = getHeader(req, "User-Agent");
  const ip = extractIP(req);
  if (isBotUserAgent(userAgent)) return true;
  if (options.blockCloudIPs === true && isCloudBotIP(ip)) return true;
  return false;
}

function shouldSendEvent(req, options = {}) { return !isBotRequest(req, options); }

function getBotClassification(req) {
  const userAgent = getHeader(req, "User-Agent");
  const ip = extractIP(req);
  if (!isBotRequest(req)) return null;

  let botType = "unknown";
  if (isMetaSecurityScanner(userAgent)) botType = "meta_security";
  else if (isLegitimateAIBot(userAgent)) botType = "ai_bot";
  else if (isSocialPreview(userAgent)) botType = "social_preview";
  else if (isSEOTool(userAgent)) botType = "seo_or_ad_bot";
  else if (isMonitoringTool(userAgent)) botType = "monitoring";
  else if (isTechnicalBot(userAgent)) botType = "technical_client";
  else if (isCloudBotIP(ip)) botType = "known_search_ip";

  return { isBot: true, botType, userAgent, ip, timestamp: new Date().toISOString() };
}

function getMetaCompliantUserData(req) {
  if (isBotRequest(req)) return null;
  return {
    ip: extractIP(req),
    userAgent: getHeader(req, "User-Agent"),
    fbp: req.cookies?._fbp || null,
    fbc: req.cookies?._fbc || null,
    isBot: false,
  };
}

module.exports = {
  isBotRequest,
  isBotUserAgent,
  getMetaCompliantUserData,
  shouldSendEvent,
  getBotClassification,
  isLegitimateAIBot,
  isMaliciousAIBot,
  isMetaSecurityScanner,
  isSocialPreview,
  isSEOTool,
  isMonitoringTool,
  isAdBot,
  isTechnicalBot,
  isCloudBotIP,
  extractIP,
};
