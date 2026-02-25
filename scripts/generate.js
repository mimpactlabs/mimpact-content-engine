const fs = require("fs");

// ============================
// CONFIG
// ============================

const baseUrl = "https://mimpactlabs.github.io/mimpact-content-engine";
const trackerFile = "./progress.json";

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
// LOAD PROGRESS TRACKER
// ============================

let progress = { clusterIndex: 0, topicIndex: 0 };

if (fs.existsSync(trackerFile)) {
  progress = JSON.parse(fs.readFileSync(trackerFile));
}

const clusterNames = Object.keys(clusters);
const currentCluster = clusterNames[progress.clusterIndex];
const clusterTopics = clusters[currentCluster];

const currentTopic = clusterTopics[progress.topicIndex];

// ============================
// DATE + FOLDER
// ============================

const today = new Date().toISOString().split("T")[0];
const hour = new Date().getHours();
const folder = hour < 12 ? "morning" : "night";

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

// ============================
// FILE STRUCTURE
// ============================

const slug = currentTopic.toLowerCase().replace(/ /g, "-");
const fileName = `${today}-${slug}.html`;
const filePath = `./${folder}/${fileName}`;

const metaDescription = `${currentTopic} complete guide for beginners.`;

// ============================
// SKIP IF EXISTS
// ============================

if (fs.existsSync(filePath)) {
  console.log("Article already exists. Skipping:", filePath);
  process.exit();
}

// ============================
// RELATED ARTICLES (Cluster Only)
// ============================

function getClusterRelated(topic, clusterName) {
  return clusters[clusterName]
    .filter(t => t !== topic)
    .slice(0, 3)
    .map(t => {
      const tSlug = t.toLowerCase().replace(/ /g, "-");
      return {
        title: t,
        url: `${baseUrl}/${folder}/${today}-${tSlug}.html`
      };
    });
}

const relatedArticles = getClusterRelated(currentTopic, currentCluster);

// ============================
// HTML CONTENT
// ============================

const content = `
<!DOCTYPE html>
<html>
<head>
  <title>${currentTopic} – Complete Beginner Guide (${today})</title>
  <meta name="description" content="${metaDescription}">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="canonical" href="${baseUrl}/${folder}/${fileName}" />

  <meta property="og:title" content="${currentTopic} – Complete Guide" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${baseUrl}/${folder}/${fileName}" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${currentTopic} – Complete Guide",
  "datePublished": "${today}",
  "dateModified": "${today}",
  "articleSection": "${currentCluster}",
  "keywords": "${currentTopic}, ${currentCluster} guide",
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

  <h1>${currentTopic} – Complete Guide</h1>
  <p><strong>Category:</strong> ${currentCluster}</p>
  <p><em>Published on ${today}</em></p>

  <h2>Introduction</h2>
  <p>${currentTopic} is rapidly transforming the digital landscape.</p>

  <h2>Why It Matters</h2>
  <ul>
    <li>Improves efficiency</li>
    <li>Builds scalable systems</li>
    <li>Supports sustainable growth</li>
  </ul>

  <h2>Conclusion</h2>
  <p>Consistency is key to mastering ${currentTopic}.</p>

  <hr>

  <h3>Related Articles</h3>
  <ul>
    ${relatedArticles.map(article => `
      <li>
        <a href="${article.url}">
          ${article.title}
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
// UPDATE PROGRESS
// ============================

progress.topicIndex++;

if (progress.topicIndex >= clusterTopics.length) {
  progress.topicIndex = 0;
  progress.clusterIndex++;

  if (progress.clusterIndex >= clusterNames.length) {
    progress.clusterIndex = 0;
  }
}

fs.writeFileSync(trackerFile, JSON.stringify(progress));

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
