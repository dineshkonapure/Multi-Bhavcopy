// netlify/functions/download-urls.js

// This is basically the same logic as server/routes.ts

const pad = (n) => (n < 10 ? "0" : "") + n;

const ymd = (d) =>
  d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());

const dmy2 = (d) =>
  pad(d.getDate()) + pad(d.getMonth() + 1) + String(d.getFullYear()).slice(2);

const buildUrls = (d) => [
  `https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_${ymd(
    d
  )}_F_0000.csv.zip`,
  `https://www.bseindia.com/download/BhavCopy/Equity/BhavCopy_BSE_CM_0_0_0_${ymd(
    d
  )}_F_0000.csv`,
  `https://archives.nseindia.com/archives/equities/bhavcopy/pr/PR${dmy2(
    d
  )}.zip`,
];

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { date } = body;

    if (!date) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Date is required" }),
      };
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid date format" }),
      };
    }

    const urls = buildUrls(dateObj);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        urls,
        date: dateObj.toISOString(),
      }),
    };
  } catch (error) {
    console.error("Error generating download URLs:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: "Failed to generate download URLs",
      }),
    };
  }
};
