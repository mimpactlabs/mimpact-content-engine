const fs = require("fs");

const baseUrl = "https://mimpactlabs.github.io/mimpact-content-engine";

const clusters = {
  "AI Automation": [
    "AI Automation Tools for Small Business",
    "How AI Workflow Automation Works",
    "AI Automation Agency Business Model",
    "Best AI Automation Software 2026",
    "Common AI Automation Mistakes"
  ]
};

// ============================
// PICK RANDOM CLUSTER + TOPIC
// ============================

const clusterNames = Object.keys(clusters);
const randomCluster = clusterNames[Math.floor(Math.random() * clusterNames.length)];

const clusterTopics = clusters[randomCluster];
const randomTopic = clusterTopics[Math.floor(Math.random() * clusterTopics.length)];
const today = new Date().toISOString().split("T")[0];
const hour = new Date().getHours();
const folder = hour < 12 ? "morning" : "night";

const slug = randomTopic.toLowerCase().replace(/ /g, "-");
const fileName = `${today}-${slug}.html`;
const filePath = `./${folder}/${fileName}`;

const metaDescription = `${randomTopic} complete guide for beginners.`;

// ============================
// ENSURE FOLDER EXISTS
// ============================

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

// ============================
// GET RANDOM RELATED ARTICLES
// ============================

function getRandomArticles(currentFile) {
  const folders = ["morning", "night"];
  let links = [];

  folders.forEach(folder => {
    if (!fs.existsSync(folder)) return;

    const files = fs.readdirSync(folder);
    files.forEach(file => {
      if (file.endsWith(".html") && file !== currentFile) {
        links.push({ folder, file });
      }
    });
  });

  return links.sort(() => 0.5 - Math.random()).slice(0, 3);
}

const relatedArticles = getRandomArticles(fileName);

// ============================
// HTML CONTENT
// ============================

const content = `
<!DOCTYPE html>
<html>
<head>
  <title>${randomTopic} – Complete Beginner Guide (${today})</title>
  <meta name="description" content="${metaDescription}">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="canonical" href="${baseUrl}/${folder}/${fileName}" />

  <meta property="og:title" content="${randomTopic} – Complete Guide" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${baseUrl}/${folder}/${fileName}" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${randomTopic} – Complete Guide",
    "datePublished": "${today}",
    "author": {
      "@type": "Organization",
      "name": "Mimpact Labs"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mimpact Labs"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${baseUrl}/${folder}/${fileName}"
    }
  }
  </script>
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

  <h3>Related Articles</h3>
  <ul>
    ${relatedArticles.map(article => `
      <li>
        <a href="${baseUrl}/${article.folder}/${article.file}">
          ${article.file.replace(".html","").replace(/-/g," ")}
        </a>
      </li>
    `).join("")}
  </ul>

  <p><small>Generated automatically by Mimpact Content Engine</small></p>

</body>
</html>
`;

// ============================
// SAVE ARTICLE
// ============================

fs.writeFileSync(filePath, content);
console.log("HTML article generated:", filePath);

// ============================
// SITEMAP GENERATOR
// ============================

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
