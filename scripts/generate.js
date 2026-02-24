const fs = require("fs");

const topics = [
  "Digital Marketing Strategy",
  "AI Automation for Business",
  "Passive Income Online",
  "Content Marketing Trends",
  "Remote Work Productivity"
];

const randomTopic = topics[Math.floor(Math.random() * topics.length)];
const today = new Date().toISOString().split("T")[0];
const hour = new Date().getHours();
const folder = hour < 12 ? "morning" : "night";

const slug = randomTopic.toLowerCase().replace(/ /g, "-");
const fileName = `${today}-${slug}.html`;
const filePath = `./${folder}/${fileName}`;

const metaDescription = `${randomTopic} complete guide for beginners.`;

// ✅ PASTIKAN FOLDER ADA
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

// ✅ BUAT HTML CONTENT
const content = `
<!DOCTYPE html>
<html>
<head>
  <title>${randomTopic} Guide ${today}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: Arial; max-width: 800px; margin: 40px auto; line-height: 1.6;">
  
  <h1>${randomTopic} – Complete Guide</h1>
  <p><em>Published on ${today}</em></p>

  <h2>Introduction</h2>
  <p>${randomTopic} is rapidly transforming the digital landscape.</p>

  <h2>Why It Matters</h2>
  <ul>
    <li>Improves efficiency</li>
    <li>Builds scalable systems</li>
    <li>Supports sustainable growth</li>
  </ul>

  <h2>Conclusion</h2>
  <p>Consistency is key to mastering ${randomTopic}.</p>

  <hr>
  <p><small>Generated automatically by Mimpact Content Engine</small></p>
  <h2>Conclusion</h2>
  <p>Consistency is key to mastering ${randomTopic}.</p>

  <hr>

  <h3>Related Articles</h3>
  <ul>
    <li><a href="https://mimpactlabs.github.io/mimpact-content-engine/">Home</a></li>
  </ul>

  <p><small>Generated automatically by Mimpact Content Engine</small></p>

</body>
</html>
`;
</body>
</html>
`;

// ✅ SIMPAN FILE HTML
fs.writeFileSync(filePath, content);
console.log("HTML article generated:", filePath);


// ============================
// SAFE SITEMAP GENERATOR
// ============================

const baseUrl = "https://mimpactlabs.github.io/mimpact-content-engine";

function generateSitemap() {
  const folders = ["morning", "night"];
  let urls = "";

  folders.forEach(folder => {
    if (!fs.existsSync(folder)) return;

    const files = fs.readdirSync(folder);
    files.forEach(file => {
      if (file.endsWith(".html")) {
        urls += `
  <url>
    <loc>${baseUrl}/${folder}/${file}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
      }
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync("./sitemap.xml", sitemap);
  console.log("Sitemap generated successfully");
}

generateSitemap();
