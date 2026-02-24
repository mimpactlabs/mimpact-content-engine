const fs = require("fs");

const topics = [
  "Digital Marketing Strategy 2026",
  "AI Automation for Small Business",
  "Passive Income Ideas Online",
  "Content Marketing Trends",
  "Future of Remote Work"
];

const randomTopic = topics[Math.floor(Math.random() * topics.length)];

const today = new Date().toISOString().split("T")[0];
const hour = new Date().getHours();
const folder = hour < 12 ? "morning" : "night";

const content = `
# ${randomTopic}

Published on ${today}

## Introduction
${randomTopic} is becoming increasingly important in the digital era.

## Key Insights
- Practical implementation
- Scalable systems
- Long term sustainability

## Conclusion
Businesses that adapt early to ${randomTopic} will gain competitive advantage.

---
Generated automatically by Mimpact Content Engine
`;

const filePath = `./${folder}/${today}-${randomTopic.replace(/ /g, "-")}.md`;

fs.writeFileSync(filePath, content);

console.log("Content generated:", filePath);
