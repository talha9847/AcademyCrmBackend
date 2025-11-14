const userRepository = require("../repository/userRepository");
const authMiddleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const cheerio = require("cheerio");
const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userRepository.login(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      role: user.role,
      name: user.fullName,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error", success: false });
  }
}

async function checkAccess(req, res) {
  try {
    const { slug } = req.body;
    const user = await authMiddleware.foundClaims(req);
    if (!user) {
      return res.status(401).json({ message: "We are sorry this time" });
    }
    const result = await pool.query(
      "SELECT p.name, p.slug FROM pages p JOIN user_page_access u ON u.page_id=p.id WHERE u.user_id=$1 and u.is_enabled='true'",
      [user.id]
    );

    const allowedSlugs = result.rows.map((p) => p.slug);
    if (!allowedSlugs.includes(slug)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ message: "Access granted" });
  } catch (error) {
    return res.status(500).json({ message: "Error", success: false });
  }
}

async function checkRoleAccess(req, res) {
  try {
    const { role } = req.body;
    const user = await authMiddleware.foundClaims(req);
    if (!user) {
      return res.status(401).json({ message: "User not logged in" });
    }
    if (user.role != role) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.json({ message: "Access granted" });
  } catch (error) {
    return res.status(500).json({ message: "Error", success: false });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none", // use "strict" in production unless using cross-site cookies
    });
    return res
      .status(200)
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed", success: false });
  }
}

async function fetchECITable(url) {
  // 1) Warm up → required for cookies
  await client.get("https://results.eci.gov.in/", {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html",
      Referer: "https://results.eci.gov.in/",
    },
  });

  // 2) Now fetch the required page
  const response = await client.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html",
      Referer: "https://results.eci.gov.in/",
    },
  });

  return response.data;
}

function parseMargins(html, maxMargin = 2500) {
  const $ = cheerio.load(html);
  const rows = [];

  $("table.table.table-striped.table-bordered tbody tr").each((i, el) => {
    // Only select direct child <td> (ignore nested table cells)
    const tds = $(el).children("td");

    if (tds.length < 9) return;

    const margin = parseInt($(tds[6]).text().trim().replace(/,/g, ""), 10);

    if (!margin || margin > maxMargin) return;

    rows.push({
      constituency: $(tds[0]).text().trim(),
      constNo: $(tds[1]).text().trim(),
      leadingCandidate: $(tds[2]).text().trim(),

      leadingParty: $(tds[3])
        .children("table")
        .find("td")
        .first()
        .text()
        .trim(),

      trailingCandidate: $(tds[4]).text().trim(),

      trailingParty: $(tds[5])
        .children("table")
        .find("td")
        .first()
        .text()
        .trim(),

      margin,
      round: $(tds[7]).text().trim(),
      status: $(tds[8]).text().trim(),
    });
  });

  return rows;
}

// ==========================
// FINAL API ENDPOINT
// ==========================
async function getCloseContests(req, res) {
  const { id } = req.params;
  const number = req.body.number ? Number(req.body.number) : 2500;
  const urls = [
    `https://results.eci.gov.in/ResultAcGenNov2025/statewiseS${id}.htm`,
  ];

  let all = [];

  try {
    for (const url of urls) {
      const html = await fetchECITable(url);
      const filtered = await parseMargins(html, number);
      all.push(...filtered);
    }

    return res.json({
      status: "success",
      total: all.length,
      timestamp: new Date().toISOString(),
      contests: all,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}

async function getAllCloseContests(req, res) {
  try {
    // Ensure number is a number type; default to 100000
    const number = req.body.number ? Number(req.body.number) : 10000;
    const urls = [
      `https://results.eci.gov.in/ResultAcGenNov2025/statewiseS041.htm`,
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS042.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS043.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS044.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS045.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS046.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS047.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS048.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS049.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS0410.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS0411.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS0412.htm",
      "https://results.eci.gov.in/ResultAcGenNov2025/statewiseS0413.htm",
    ];

    // Fetch all URLs in parallel
    const allResults = await Promise.all(
      urls.map(async (url) => {
        const html = await fetchECITable(url);
        return await parseMargins(html, number);
      })
    );

    // Flatten the array of arrays
    const contests = allResults.flat();

    return res.json({
      status: "success",
      total: contests.length,
      timestamp: new Date().toISOString(),
      contests,
    });
  } catch (err) {
    return res.status(500).json({
      status: "errorss",
      message: err.message,
      mes: err,
    });
  }
}

module.exports = {
  login,
  checkAccess,
  checkRoleAccess,
  logout,
  getCloseContests,
  getAllCloseContests,
};
