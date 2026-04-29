const fs = require('fs');
let c = fs.readFileSync('src/lib/i18n/translations.ts', 'utf8');

const extras = `    // Landing - Trust Items
    "trust.anonymous": "Anonymous Reporting", "trust.identity": "Identity Protected", "trust.community": "Community Verified", "trust.tamper": "Tamper-Proof History",
    // Landing - Services
    "services.label": "Services", "services.heading": "In short, our platform helps communities get justice", "services.learn": "Learn More",
    "service.voice": "Voice-First Intake", "service.voice.desc": "Multilingual voice recording with automatic transcription. Citizens can report in their own language — no literacy required.",
    "service.ai": "AI-Powered Processing", "service.ai.desc": "Complaints are automatically categorized, prioritized, and summarized using intelligent rule-based analysis for instant routing.",
    "service.monitor": "Performance Monitoring", "service.monitor.desc": "Real-time dashboards track complaint resolution rates, response times, and escalation patterns across all departments.",
    "service.verify": "Proof-of-Action Verification", "service.verify.desc": "Before-and-after evidence is logged with tamper-proof timestamps. Citizens verify resolution, not just officials.",
    "service.transparent": "Transparency & Accountability", "service.transparent.desc": "Every status change is publicly visible. Auto-escalation triggers when response deadlines are missed by authorities.",
    "service.commval": "Community Validation", "service.commval.desc": "Genuineness scores and consensus voting allow communities to validate and amplify complaints that affect them.",
    // Landing - Sectors
    "sectors.label": "Sectors",
    // Landing - Principles
    "principles.label": "Our Approach", "principles.heading": "Guiding Principles to Our Approach",
    // Landing - CTA
    "cta.title": "Your Voice Matters", "cta.desc": "Every complaint is a step toward accountability. Report safely. Track transparently. Demand action.", "cta.btn": "Report an Issue Now",
    // Footer extras
    "footer.report": "Report an Issue", "footer.trackComplaint": "Track Complaint", "footer.dashboard": "Public Dashboard", "footer.guidelines": "Community Guidelines", "footer.stories": "Success Stories", "footer.faq": "FAQ", "footer.directory": "Authority Directory", "footer.support": "Support Center", "footer.connect": "Connect With Us", "footer.email": "Email Address", "footer.newsletter": "Join Newsletter", "footer.rights": "All rights reserved.", "footer.made": "Made with", "footer.country": "for India",
    // Impact Section
    "impact.heading": "VISHWAS Platform Impact", "impact.years": "Years", "impact.districts": "Districts", "impact.evaluations": "Evaluations", "impact.study": "In a study by VISHWAS, our platform evaluations showed distinct advantages over other comparable grievance systems.", "impact.effective": "More Effective", "impact.learnmore": "LEARN MORE",
    // ComplaintPost extras
    "post.anonymous": "Anonymous Citizen", "post.verified": "Verified Citizen", "post.sentTo": "Sent to:", "post.needsVotes": "more votes to automatically alert the authorities.", "post.communityFund": "Community Fund", "post.boostAction": "Boost Community Action", "post.escrow": "Funds are held in escrow for legal or local NGO action.", "post.confirm": "Confirm Support",
    // Community empty
    "comm.empty.title": "No complaints found", "comm.empty.desc": "Be the first to raise an issue for your community.",
    // Navbar mobile
    "nav.selectLang": "Select Language"`;

const lines = c.split('\n');
let changed = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('"process.analyzing":') && !lines[i].includes('//') && i > 60) {
        let j = i;
        while(j < i + 5 && j < lines.length && !lines[j].includes('"process.btn"')) {
            j++;
        }
        if (j < lines.length && lines[j].includes('"process.btn"')) {
           if (!lines[j+1] || !lines[j+1].includes('trust.anonymous')) {
               lines[j] = lines[j] + ',\n' + extras;
               changed = true;
           }
        }
    }
}
if (changed) {
    fs.writeFileSync('src/lib/i18n/translations.ts', lines.join('\n'));
    console.log('Done appending keys to other languages');
} else {
    console.log('No changes made');
}
