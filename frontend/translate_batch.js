const fs = require("fs");
const path = require("path");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("No GEMINI_API_KEY found in env");
  process.exit(1);
}

const translationsPath = path.join(__dirname, "src", "lib", "i18n", "translations.ts");
let fileContent = fs.readFileSync(translationsPath, "utf-8");

async function translateBatch(keysToTranslateObj, targetLangName) {
  const prompt = `Translate the following JSON object values into ${targetLangName}. Keep the exact same JSON keys. Respond ONLY with valid JSON. Keep translations natural and concise for a UI. Do not use markdown blocks.
JSON:
${JSON.stringify(keysToTranslateObj, null, 2)}`;
  
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      })
    });
    const data = await res.json();
    if (!data.candidates || !data.candidates[0]) throw new Error(JSON.stringify(data));
    let reply = data.candidates[0].content.parts[0].text.trim();
    if (reply.startsWith('```json')) reply = reply.replace(/```json/g, '').replace(/```/g, '').trim();
    if (reply.startsWith('```')) reply = reply.replace(/```/g, '').trim();
    return JSON.parse(reply);
  } catch (e) {
    console.error("Failed to translate batch for", targetLangName, e.message);
    return null;
  }
}

async function run() {
  console.log("Starting batch translation script...");
  
  const languages = [
    { code: "hi", name: "Hindi" },
    { code: "kn", name: "Kannada" },
    { code: "te", name: "Telugu" },
    { code: "ta", name: "Tamil" },
    { code: "ml", name: "Malayalam" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "bn", name: "Bengali" },
    { code: "pa", name: "Punjabi" },
    { code: "or", name: "Odia" }
  ];

  const keysToTranslate = {
    "trust.anonymous": "Anonymous Reporting",
    "trust.identity": "Identity Protected",
    "trust.community": "Community Verified",
    "trust.tamper": "Tamper-Proof History",
    "services.label": "Services",
    "services.heading": "In short, our platform helps communities get justice",
    "services.learn": "Learn More",
    "service.voice": "Voice-First Intake",
    "service.voice.desc": "Multilingual voice recording with automatic transcription.",
    "service.ai": "AI-Powered Processing",
    "service.ai.desc": "Complaints are automatically categorized.",
    "service.monitor": "Performance Monitoring",
    "service.monitor.desc": "Real-time dashboards track complaint resolution rates.",
    "service.verify": "Proof-of-Action Verification",
    "service.verify.desc": "Before-and-after evidence is logged with tamper-proof timestamps.",
    "service.transparent": "Transparency & Accountability",
    "service.transparent.desc": "Every status change is publicly visible.",
    "service.commval": "Community Validation",
    "service.commval.desc": "Genuineness scores and consensus voting.",
    "sectors.label": "Sectors",
    "principles.label": "Our Approach",
    "principles.heading": "Guiding Principles to Our Approach",
    "cta.title": "Your Voice Matters",
    "cta.desc": "Every complaint is a step toward accountability.",
    "cta.btn": "Report an Issue Now",
    "impact.heading": "VISHWAS Platform Impact",
    "impact.years": "Years",
    "impact.districts": "Districts",
    "impact.evaluations": "Evaluations",
    "impact.study": "In a study by VISHWAS, our platform evaluations showed distinct advantages over other comparable grievance systems.",
    "impact.effective": "More Effective",
    "impact.learnmore": "LEARN MORE",
    "post.anonymous": "Anonymous Citizen",
    "post.verified": "Verified Citizen",
    "post.sentTo": "Sent to:",
    "post.needsVotes": "more votes to automatically alert the authorities.",
    "post.communityFund": "Community Fund",
    "post.boostAction": "Boost Community Action",
    "post.escrow": "Funds are held in escrow for legal or local NGO action.",
    "post.confirm": "Confirm Support",
    "comm.empty.title": "No complaints found",
    "comm.empty.desc": "Be the first to raise an issue for your community.",
    "nav.selectLang": "Select Language",
    "home.hero.speak": "Speak Up.",
    "home.hero.stay": "Stay Safe.",
    "home.hero.see": "See Justice.",
    "home.hero.tagline": "Your Voice. Your Right. Your Justice. Report issues anonymously with your voice, track real progress, and hold authorities accountable.",
  };

  for (const lang of languages) {
    console.log(`Translating for ${lang.name}...`);
    const translatedObj = await translateBatch(keysToTranslate, lang.name);
    
    if (translatedObj) {
      const parts = fileContent.split(`  ${lang.code}: {`);
      if (parts.length === 2) {
        let block = parts[1];
        
        for (const [key, englishText] of Object.entries(keysToTranslate)) {
          const translatedText = translatedObj[key] || englishText;
          const searchStr = `"${key}": "${englishText}"`;
          const safeTranslatedText = translatedText.replace(/"/g, '\\"').replace(/\n/g, ' ');
          const replaceStr = `"${key}": "${safeTranslatedText}"`;
          
          if (block.includes(searchStr)) {
            block = block.replace(searchStr, replaceStr);
          } else {
            const endIdx = block.indexOf('  },');
            if (endIdx !== -1) {
              const before = block.substring(0, endIdx);
              const after = block.substring(endIdx);
              block = before + `    "${key}": "${safeTranslatedText}",\n` + after;
            }
          }
        }
        fileContent = parts[0] + `  ${lang.code}: {` + block;
      }
    } else {
      console.log(`Skipped ${lang.name} due to translation error.`);
    }
    // Add small delay to avoid rate limit (15 requests per minute -> 4 seconds per request)
    await new Promise(r => setTimeout(r, 4500));
  }

  // Inject into EN
  const enParts = fileContent.split('  en: {');
  if (enParts.length === 2) {
    let enBlock = enParts[1];
    for (const [key, englishText] of Object.entries(keysToTranslate)) {
      const searchStr = `"${key}":`;
      if (!enBlock.includes(searchStr)) {
        const endIdx = enBlock.indexOf('  },');
        if (endIdx !== -1) {
          const safeText = englishText.replace(/"/g, '\\"');
          const before = enBlock.substring(0, endIdx);
          const after = enBlock.substring(endIdx);
          enBlock = before + `    "${key}": "${safeText}",\n` + after;
        }
      }
    }
    fileContent = enParts[0] + '  en: {' + enBlock;
  }

  fs.writeFileSync(translationsPath, fileContent, "utf-8");
  console.log("Done batch translating!");
}

run();
