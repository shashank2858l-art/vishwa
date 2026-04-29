const fs = require("fs");
const path = require("path");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("No GEMINI_API_KEY found in env");
  process.exit(1);
}

const translationsPath = path.join(__dirname, "src", "lib", "i18n", "translations.ts");
let fileContent = fs.readFileSync(translationsPath, "utf-8");

// Extract the translations object
const extractTranslations = () => {
  // We will run this script by parsing the file, evaluating the exported object, and then regenerating it.
  // Actually, string manipulation is safer to preserve comments, but it's hard to replace exactly.
  // Let's use a simpler approach:
  // We'll read the TS file, strip the `export const translations... = ` part to get a JSON-like object,
  // eval it, translate missing things, and then write it back.
};

async function translateText(text, targetLangName) {
  const prompt = `Translate the following UI text into ${targetLangName}. Respond ONLY with the translated text, nothing else. Keep it natural and concise for a UI.
Text: "${text}"`;
  
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    });
    const data = await res.json();
    let reply = data.candidates[0].content.parts[0].text.trim();
    // remove surrounding quotes if Gemini added them
    if (reply.startsWith('"') && reply.endsWith('"')) {
      reply = reply.slice(1, -1);
    }
    return reply;
  } catch (e) {
    console.error("Failed to translate", text, e);
    return text;
  }
}

async function run() {
  console.log("Starting translation script...");
  
  // To make it super safe, we will just use regex to replace specific known English lines inside each language block.
  // But wait, the English strings are identically formatted in each block!
  // e.g. "trust.anonymous": "Anonymous Reporting"
  
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
    "service.voice.desc": "Multilingual voice recording with automatic transcription. Citizens can report in their own language — no literacy required.",
    "service.ai": "AI-Powered Processing",
    "service.ai.desc": "Complaints are automatically categorized, prioritized, and summarized using intelligent rule-based analysis for instant routing.",
    "service.monitor": "Performance Monitoring",
    "service.monitor.desc": "Real-time dashboards track complaint resolution rates, response times, and escalation patterns across all departments.",
    "service.verify": "Proof-of-Action Verification",
    "service.verify.desc": "Before-and-after evidence is logged with tamper-proof timestamps. Citizens verify resolution, not just officials.",
    "service.transparent": "Transparency & Accountability",
    "service.transparent.desc": "Every status change is publicly visible. Auto-escalation triggers when response deadlines are missed by authorities.",
    "service.commval": "Community Validation",
    "service.commval.desc": "Genuineness scores and consensus voting allow communities to validate and amplify complaints that affect them.",
    "sectors.label": "Sectors",
    "principles.label": "Our Approach",
    "principles.heading": "Guiding Principles to Our Approach",
    "cta.title": "Your Voice Matters",
    "cta.desc": "Every complaint is a step toward accountability. Report safely. Track transparently. Demand action.",
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
    "home.hero.tagline": "Your Voice. Your Right. Your Justice. Report issues anonymously with your voice, track real progress, and hold authorities accountable — all without fear.",
  };

  // We will build a new translations.ts entirely by evaluating it, updating it, and writing it out.
  // Wait, evaluating TS is hard.
  // Instead, let's just use string replacement on the raw file text!
  
  for (const lang of languages) {
    console.log(`Translating for ${lang.name}...`);
    for (const [key, englishText] of Object.entries(keysToTranslate)) {
      const translatedText = await translateText(englishText, lang.name);
      
      const parts = fileContent.split(`  ${lang.code}: {`);
      if (parts.length === 2) {
        let block = parts[1];
        const searchStr = `"${key}": "${englishText}"`;
        const safeTranslatedText = translatedText.replace(/"/g, '\\"').replace(/\n/g, ' ');
        const replaceStr = `"${key}": "${safeTranslatedText}"`;
        
        if (block.includes(searchStr)) {
          block = block.replace(searchStr, replaceStr);
          fileContent = parts[0] + `  ${lang.code}: {` + block;
        } else {
          const endIdx = block.indexOf('  },');
          if (endIdx !== -1) {
            const before = block.substring(0, endIdx);
            const after = block.substring(endIdx);
            block = before + `    "${key}": "${safeTranslatedText}",\n` + after;
            fileContent = parts[0] + `  ${lang.code}: {` + block;
          }
        }
      }
    }
  }

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
  console.log("Done translating!");
}

run();
