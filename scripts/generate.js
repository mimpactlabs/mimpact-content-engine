const fs = require("fs");
const path = require("path");

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

const metaDescription = `${randomTopic} complete guide for beginners. Learn strategies, tips, and practical implementation steps.`;

// Generate Article
const content = `
---
title: "${randomTopic} Guide ${today}"
description: "${metaDescription}"
date: "${today}"
author: "Mimpact Engine"
---

# ${randomTopic} – Complete Guide

## Introduction
${randomTopic} is rapidly transforming the digital landscape.

## Why It Matters
- Improves efficiency  
- Scalable systems  
- Long term growth  

## Implementation Steps
1. Analyze current strategy  
2. Apply improvements  
3. Measure performance  

## Conclusion
Consistency is key to mastering ${randomTopic}.

---

*Generated automatically.*
`;

fs.writeFileSync(filePath, content);
console.log("SEO content generated:", filePath);

// ============================
// SAFE SITEMAP GENERATOR
// ============================

const baseUrl = "https://mimpactlabs.github.io/mimpact-content-engine";

function safeReadDir(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
    return [];
  }
  return fs.readdirSync(folder);
}

function generateSitemap() {
  const folders = ["morning", "night"];
  let urls = "";

  folders.forEach(folder => {
    const files = safeReadDir(`./${folder}`);
    files.forEach(file => {
      if (file.endsWith(".md")) {
        const slug = file.replace(".md", ".html");
        urls += `
  <url>
    <loc>${baseUrl}/${folder}/${slug}</loc>
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
