export const LANGUAGES = [
  { code: "en", name: "English", localName: "English" },
  { code: "hi", name: "Hindi", localName: "हिंदी" },
  { code: "kn", name: "Kannada", localName: "ಕನ್ನಡ" },
  { code: "te", name: "Telugu", localName: "తెలుగు" },
  { code: "ta", name: "Tamil", localName: "தமிழ்" },
  { code: "ml", name: "Malayalam", localName: "മലയാളം" },
  { code: "mr", name: "Marathi", localName: "मराठी" },
  { code: "gu", name: "Gujarati", localName: "ગુજરાતી" },
  { code: "bn", name: "Bengali", localName: "বাংলা" },
  { code: "pa", name: "Punjabi", localName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", localName: "ଓଡ଼ିଆ" },
];

export type LanguageCode = typeof LANGUAGES[number]["code"];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "nav.home": "Home", "nav.community": "Community", "nav.submit": "Report Issue", "nav.track": "Track", "nav.support": "Support", "nav.dashboard": "Dashboard",
    "home.title": "Your Voice. Your Right. Your Justice.", "home.subtitle": "The official platform for verified civic action. Report, track, and escalate local issues with transparency.",
    "home.btn.report": "Report an Issue", "home.btn.track": "Track Status",
    "home.stat.active": "Active Complaints", "home.stat.citizens": "Citizens Empowered", "home.stat.departments": "Departments Linked",
    "submit.title": "Report an Issue", "submit.subtitle": "Your complaint is safe and protected",
    "submit.step.speak": "Speak", "submit.step.category": "Category", "submit.step.details": "Details", "submit.step.submit": "Submit",
    "submit.input.voice": "Voice", "submit.input.text": "Text", "submit.input.placeholder": "Describe your issue",
    "submit.upload.title": "Attach Photo or Video (Optional)", "submit.upload.subtitle": "Evidence helps verify your complaint faster",
    "submit.category.title": "What is this about?", "submit.btn.continue": "Continue", "submit.btn.back": "Back",
    "comm.title": "Community Action", "comm.subtitle": "Verify local issues to trigger automatic AI escalation to authorities. Your voice holds power.",
    "comm.tab.trending": "Trending Feed", "comm.tab.escalated": "AI Escalated", "comm.tab.funding": "Needs Funding", "comm.top": "Top Verified Issues",
    "comm.post.pending": "Pending Verification", "comm.post.routed": "AI Auto-Routed", "comm.post.boost": "Boost Fund", "comm.post.reply": "Reply",
    
    // Impact Section
    "impact.title": "Trust-Mediated Civic Grievance System", "impact.description": "VISHWAS creates a transparent, immutable record of public grievances. Once an issue is verified by the community, it cannot be hidden or deleted by authorities.",
    // Sectors Section
    "sectors.title": "Issues we address across communities",
    // How it works
    "how.title": "Customized Local Solutions",
    // Footer
    "footer.quick": "Quick Links", "footer.legal": "Legal", "footer.desc": "Building trust through transparent civic action.", "footer.privacy": "Privacy Policy", "footer.terms": "Terms of Service",
    // Track Page
    "track.title": "Track Complaint Status", "track.subtitle": "Enter your unique ID to see the real-time progress of your issue", "track.input": "Tracking ID", "track.btn": "Track Status", "track.error": "Complaint not found", "track.status.submitted": "Submitted", "track.status.verified": "Verified", "track.status.assigned": "Assigned", "track.status.resolved": "Resolved", "track.timeline": "Timeline", "track.back": "Back to Home",
    // Admin Page
    "admin.title": "Ministerial Control Center", "admin.overview": "Overview", "admin.issues": "Active Issues", "admin.resolved": "Resolved", "admin.priority": "Priority", "admin.status": "Status",
    // Processing Page
    "process.analyzing": "Analyzing grievance details...", "process.identifying": "Identifying department and jurisdiction...", "process.routing": "Routing securely to authorities...", "process.success": "Grievance Successfully Registered", "process.id": "Your Tracking ID is", "process.btn": "Track Status",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language",
    "home.hero.speak": "Speak Up.",
    "home.hero.stay": "Stay Safe.",
    "home.hero.see": "See Justice.",
    "home.hero.tagline": "Your Voice. Your Right. Your Justice. Report issues anonymously with your voice, track real progress, and hold authorities accountable.",
  },
  hi: {
    "nav.home": "होम", "nav.community": "समुदाय", "nav.submit": "समस्या दर्ज करें", "nav.track": "ट्रैक करें", "nav.dashboard": "डैशबोर्ड",
    "home.title": "आपकी आवाज़। आपका अधिकार। आपका न्याय।", "home.subtitle": "सत्यापित नागरिक कार्रवाई का आधिकारिक मंच। पारदर्शिता के साथ स्थानीय समस्याओं की रिपोर्ट करें।",
    "home.btn.report": "समस्या दर्ज करें", "home.btn.track": "स्थिति ट्रैक करें",
    "home.stat.active": "सक्रिय शिकायतें", "home.stat.citizens": "सशक्त नागरिक", "home.stat.departments": "जुड़े हुए विभाग",
    "submit.title": "समस्या दर्ज करें", "submit.subtitle": "आपकी शिकायत सुरक्षित है", "submit.step.speak": "बोलें", "submit.step.category": "श्रेणी", "submit.step.details": "विवरण", "submit.step.submit": "सबमिट करें",
    "submit.input.voice": "आवाज़", "submit.input.text": "टेक्स्ट", "submit.input.placeholder": "अपनी समस्या का वर्णन करें",
    "submit.upload.title": "फोटो या वीडियो जोड़ें (वैकल्पिक)", "submit.upload.subtitle": "प्रमाण से शिकायत का सत्यापन जल्दी होता है",
    "submit.category.title": "यह किस बारे में है?", "submit.btn.continue": "आगे बढ़ें", "submit.btn.back": "पीछे जाएं",
    "comm.title": "सामुदायिक कार्रवाई", "comm.subtitle": "अधिकारियों को स्वचालित एआई एस्केलेशन ट्रिगर करने के लिए स्थानीय समस्याओं का सत्यापन करें।",
    "comm.tab.trending": "ट्रेंडिंग फ़ीड", "comm.tab.escalated": "एआई द्वारा अग्रेषित", "comm.tab.funding": "फंडिंग की जरूरत", "comm.top": "शीर्ष सत्यापित समस्याएं",
    "comm.post.pending": "सत्यापन लंबित", "comm.post.routed": "एआई ऑटो-राउटेड", "comm.post.boost": "फंड बढ़ाएं", "comm.post.reply": "जवाब दें",

    "impact.title": "ट्रस्ट-मीडिएटेड नागरिक शिकायत प्रणाली", "impact.description": "VISHWAS सार्वजनिक शिकायतों का एक पारदर्शी, अपरिवर्तनीय रिकॉर्ड बनाता है। एक बार समुदाय द्वारा समस्या का सत्यापन हो जाने के बाद, इसे अधिकारियों द्वारा छिपाया या हटाया नहीं जा सकता।",
    "sectors.title": "हम समुदायों में किन समस्याओं का समाधान करते हैं",
    "how.title": "अनुकूलित स्थानीय समाधान",
    "footer.quick": "महत्वपूर्ण लिंक", "footer.legal": "कानूनी", "footer.desc": "पारदर्शी नागरिक कार्रवाई के माध्यम से विश्वास का निर्माण।", "footer.privacy": "गोपनीयता नीति", "footer.terms": "सेवा की शर्तें",
    "track.title": "शिकायत की स्थिति ट्रैक करें", "track.subtitle": "अपनी समस्या की वास्तविक समय की प्रगति देखने के लिए अपनी विशिष्ट आईडी दर्ज करें", "track.input": "ट्रैकिंग आईडी", "track.btn": "स्थिति ट्रैक करें", "track.error": "शिकायत नहीं मिली", "track.status.submitted": "सबमिट किया गया", "track.status.verified": "सत्यापित", "track.status.assigned": "सौंपा गया", "track.status.resolved": "समाधान किया गया", "track.timeline": "समयरेखा", "track.back": "होम पर वापस जाएं",
    "admin.title": "मंत्रिस्तरीय नियंत्रण केंद्र", "admin.overview": "अवलोकन", "admin.issues": "सक्रिय मुद्दे", "admin.resolved": "समाधान किया गया", "admin.priority": "प्राथमिकता", "admin.status": "स्थिति",
    "process.analyzing": "शिकायत विवरण का विश्लेषण किया जा रहा है...", "process.identifying": "विभाग और अधिकार क्षेत्र की पहचान की जा रही है...", "process.routing": "सुरक्षित रूप से अधिकारियों को भेजा जा रहा है...", "process.success": "शिकायत सफलतापूर्वक पंजीकृत की गई", "process.id": "आपकी ट्रैकिंग आईडी है", "process.btn": "स्थिति ट्रैक करें",
    // Landing - Trust Items
    "trust.anonymous": "अनाम रिपोर्टिंग", "trust.identity": "पहचान सुरक्षित", "trust.community": "समुदाय द्वारा सत्यापित", "trust.tamper": "छेड़छाड़-मुक्त इतिहास",
    // Landing - Services
    "services.label": "सेवाएं", "services.heading": "संक्षेप में, हमारा मंच समुदायों को न्याय दिलाने में मदद करता है", "services.learn": "और जानें",
    "service.voice": "वॉयस-फर्स्ट इनटेक", "service.voice.desc": "Multilingual voice recording with automatic transcription. Citizens can report in their own language — no literacy required.",
    "service.ai": "एआई-संचालित प्रसंस्करण", "service.ai.desc": "Complaints are automatically categorized, prioritized, and summarized using intelligent rule-based analysis for instant routing.",
    "service.monitor": "प्रदर्शन निगरानी", "service.monitor.desc": "Real-time dashboards track complaint resolution rates, response times, and escalation patterns across all departments.",
    "service.verify": "कार्रवाई का प्रमाण", "service.verify.desc": "Before-and-after evidence is logged with tamper-proof timestamps. Citizens verify resolution, not just officials.",
    "service.transparent": "पारदर्शिता और जवाबदेही", "service.transparent.desc": "Every status change is publicly visible. Auto-escalation triggers when response deadlines are missed by authorities.",
    "service.commval": "सामुदायिक सत्यापन", "service.commval.desc": "Genuineness scores and consensus voting allow communities to validate and amplify complaints that affect them.",
    // Landing - Sectors
    "sectors.label": "क्षेत्र",
    // Landing - Principles
    "principles.label": "हमारा दृष्टिकोण", "principles.heading": "हमारे दृष्टिकोण के मार्गदर्शक सिद्धांत",
    // Landing - CTA
    "cta.title": "आपकी आवाज़ मायने रखती है", "cta.desc": "Every complaint is a step toward accountability. Report safely. Track transparently. Demand action.", "cta.btn": "अभी एक समस्या की रिपोर्ट करें",
    // Footer extras
    "footer.report": "Report an Issue", "footer.trackComplaint": "Track Complaint", "footer.dashboard": "Public Dashboard", "footer.guidelines": "Community Guidelines", "footer.stories": "Success Stories", "footer.faq": "FAQ", "footer.directory": "Authority Directory", "footer.support": "Support Center", "footer.connect": "Connect With Us", "footer.email": "Email Address", "footer.newsletter": "Join Newsletter", "footer.rights": "All rights reserved.", "footer.made": "Made with", "footer.country": "for India",
    // Impact Section
    "impact.heading": "विश्वास प्लेटफॉर्म का प्रभाव", "impact.years": "वर्ष", "impact.districts": "जिले", "impact.evaluations": "मूल्यांकन", "impact.study": "विश्वास द्वारा किए गए एक अध्ययन में, हमारे मंच ने अन्य प्रणालियों पर लाभ दिखाया।", "impact.effective": "अधिक प्रभावी", "impact.learnmore": "और जानें",
    // ComplaintPost extras
    "post.anonymous": "अनाम नागरिक", "post.verified": "सत्यापित नागरिक", "post.sentTo": "भेजा गया:", "post.needsVotes": "अधिकारियों को सतर्क करने के लिए और वोट।", "post.communityFund": "सामुदायिक कोष", "post.boostAction": "सामुदायिक कार्रवाई को बढ़ावा दें", "post.escrow": "धनराशि कानूनी कार्रवाई के लिए एस्क्रो में रखी गई है।", "post.confirm": "समर्थन की पुष्टि करें",
    // Community empty
    "comm.empty.title": "कोई शिकायत नहीं मिली", "comm.empty.desc": "अपने समुदाय के लिए मुद्दा उठाने वाले पहले व्यक्ति बनें।",
    // Navbar mobile
    "nav.selectLang": "भाषा चुनें",
    "home.hero.speak": "आवाज़ उठाएं।",
    "home.hero.stay": "सुरक्षित रहें।",
    "home.hero.see": "न्याय देखें।",
    "home.hero.tagline": "आपकी आवाज़। आपका अधिकार। आपका न्याय। गुमनाम रूप से रिपोर्ट करें, प्रगति को ट्रैक करें, और जवाबदेह ठहराएं।",
  },
  kn: {
    "nav.home": "ಮುಖಪುಟ", "nav.community": "ಸಮುದಾಯ", "nav.submit": "ದೂರು ನೀಡಿ", "nav.track": "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "home.title": "ನಿಮ್ಮ ಧ್ವನಿ. ನಿಮ್ಮ ಹಕ್ಕು. ನಿಮ್ಮ ನ್ಯಾಯ.", "home.subtitle": "ಪರಿಶೀಲಿಸಿದ ನಾಗರಿಕ ಕ್ರಿಯೆಯ ಅಧಿಕೃತ ವೇದಿಕೆ. ಪಾರದರ್ಶಕತೆಯಿಂದ ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ.",
    "home.btn.report": "ದೂರು ನೀಡಿ", "home.btn.track": "ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    "home.stat.active": "ಸಕ್ರಿಯ ದೂರುಗಳು", "home.stat.citizens": "ಸಶಕ್ತ ನಾಗರಿಕರು", "home.stat.departments": "ಸಂಪರ್ಕಿತ ಇಲಾಖೆಗಳು",
    "submit.title": "ದೂರು ನೀಡಿ", "submit.subtitle": "ನಿಮ್ಮ ದೂರು ಸುರಕ್ಷಿತವಾಗಿದೆ", "submit.step.speak": "ಮಾತನಾಡಿ", "submit.step.category": "ವರ್ಗ", "submit.step.details": "ವಿವರಗಳು", "submit.step.submit": "ಸಲ್ಲಿಸಿ",
    "submit.input.voice": "ಧ್ವನಿ", "submit.input.text": "ಪಠ್ಯ", "submit.input.placeholder": "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ",
    "submit.upload.title": "ಫೋಟೋ ಅಥವಾ ವೀಡಿಯೊ ಲಗತ್ತಿಸಿ", "submit.upload.subtitle": "ಸಾಕ್ಷ್ಯವು ದೂರನ್ನು ತ್ವರಿತವಾಗಿ ಪರಿಶೀಲಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ",
    "submit.category.title": "ಇದು ಯಾವುದರ ಬಗ್ಗೆ?", "submit.btn.continue": "ಮುಂದುವರಿಯಿರಿ", "submit.btn.back": "ಹಿಂದೆ ಹೋಗಿ",
    "comm.title": "ಸಮುದಾಯದ ಕ್ರಿಯೆ", "comm.subtitle": "ಅಧಿಕಾರಿಗಳಿಗೆ AI ಸ್ವಯಂಚಾಲಿತ ಎಸ್ಕಲೇಷನ್ ಪ್ರಚೋದಿಸಲು ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    "comm.tab.trending": "ಟ್ರೆಂಡಿಂಗ್ ಫೀಡ್", "comm.tab.escalated": "AI ಎಸ್ಕಲೇಟ್ ಮಾಡಲಾಗಿದೆ", "comm.tab.funding": "ಧನಸಹಾಯದ ಅಗತ್ಯವಿದೆ", "comm.top": "ಟಾಪ್ ಪರಿಶೀಲಿಸಿದ ಸಮಸ್ಯೆಗಳು",
    "comm.post.pending": "ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ", "comm.post.routed": "AI ಆಟೋ-ರೌಟೆಡ್", "comm.post.boost": "ನಿಧಿಯನ್ನು ಹೆಚ್ಚಿಸಿ", "comm.post.reply": "ಪ್ರತಿಕ್ರಿಯಿಸಿ",

    "impact.title": "ಟ್ರಸ್ಟ್-ಮಧ್ಯಸ್ಥಿಕೆಯ ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ವ್ಯವಸ್ಥೆ", "impact.description": "VISHWAS ಸಾರ್ವಜನಿಕ ಕುಂದುಕೊರತೆಗಳ ಪಾರದರ್ಶಕ ದಾಖಲೆಯನ್ನು ರಚಿಸುತ್ತದೆ. ಸಮುದಾಯದಿಂದ ಒಮ್ಮೆ ಪರಿಶೀಲಿಸಿದ ನಂತರ, ಅಧಿಕಾರಿಗಳು ಅದನ್ನು ಮರೆಮಾಡಲು ಅಥವಾ ಅಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    "sectors.title": "ಸಮುದಾಯಗಳಾದ್ಯಂತ ನಾವು ಪರಿಹರಿಸುವ ಸಮಸ್ಯೆಗಳು",
    "how.title": "ಗ್ರಾಹಕೀಯಗೊಳಿಸಿದ ಸ್ಥಳೀಯ ಪರಿಹಾರಗಳು",
    "footer.quick": "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು", "footer.legal": "ಕಾನೂನು", "footer.desc": "ಪಾರದರ್ಶಕ ನಾಗರಿಕ ಕ್ರಿಯೆಯ ಮೂಲಕ ನಂಬಿಕೆಯನ್ನು ನಿರ್ಮಿಸುವುದು.", "footer.privacy": "ಗೌಪ್ಯತೆ ನೀತಿ", "footer.terms": "ಸೇವಾ ನಿಯಮಗಳು",
    "track.title": "ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", "track.subtitle": "ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ಪ್ರಗತಿಯನ್ನು ನೋಡಲು ನಿಮ್ಮ ಅನನ್ಯ ID ಅನ್ನು ನಮೂದಿಸಿ", "track.input": "ಟ್ರ್ಯಾಕಿಂಗ್ ID", "track.btn": "ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", "track.error": "ದೂರು ಕಂಡುಬಂದಿಲ್ಲ", "track.status.submitted": "ಸಲ್ಲಿಸಲಾಗಿದೆ", "track.status.verified": "ಪರಿಶೀಲಿಸಲಾಗಿದೆ", "track.status.assigned": "ನಿಯೋಜಿಸಲಾಗಿದೆ", "track.status.resolved": "ಬಗೆಹರಿಸಲಾಗಿದೆ", "track.timeline": "ಟೈಮ್‌ಲೈನ್", "track.back": "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    "admin.title": "ಮಂತ್ರಿಗಳ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ", "admin.overview": "ಅವಲೋಕನ", "admin.issues": "ಸಕ್ರಿಯ ಸಮಸ್ಯೆಗಳು", "admin.resolved": "ಬಗೆಹರಿಸಲಾಗಿದೆ", "admin.priority": "ಆದ್ಯತೆ", "admin.status": "ಸ್ಥಿತಿ",
    "process.analyzing": "ದೂರಿನ ವಿವರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", "process.identifying": "ಇಲಾಖೆ ಮತ್ತು ವ್ಯಾಪ್ತಿಯನ್ನು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...", "process.routing": "ಅಧಿಕಾರಿಗಳಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ ರವಾನಿಸಲಾಗುತ್ತಿದೆ...", "process.success": "ದೂರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ", "process.id": "ನಿಮ್ಮ ಟ್ರ್ಯಾಕಿಂಗ್ ID", "process.btn": "ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    // Landing - Trust Items
    "trust.anonymous": "ಅನಾಮಧೇಯ ವರದಿ", "trust.identity": "ಗುರುತು ಸುರಕ್ಷಿತ", "trust.community": "ಸಮುದಾಯ ಪರಿಶೀಲಿಸಿದೆ", "trust.tamper": "ಟ್ಯಾಂಪರ್-ಫ್ರೀ ಇತಿಹಾಸ",
    // Landing - Services
    "services.label": "ಸೇವೆಗಳು", "services.heading": "ಸಂಕ್ಷಿಪ್ತವಾಗಿ, ಸಮುದಾಯಗಳಿಗೆ ನ್ಯಾಯ ಪಡೆಯಲು ನಮ್ಮ ವೇದಿಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ", "services.learn": "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    "service.voice": "ಧ್ವನಿ-ಮೊದಲ ಸೇವನೆ", "service.voice.desc": "Multilingual voice recording with automatic transcription. Citizens can report in their own language — no literacy required.",
    "service.ai": "AI-ಚಾಲಿತ ಪ್ರಕ್ರಿಯೆ", "service.ai.desc": "Complaints are automatically categorized, prioritized, and summarized using intelligent rule-based analysis for instant routing.",
    "service.monitor": "ಕಾರ್ಯಕ್ಷಮತೆ ಮೇಲ್ವಿಚಾರಣೆ", "service.monitor.desc": "Real-time dashboards track complaint resolution rates, response times, and escalation patterns across all departments.",
    "service.verify": "ಕ್ರಿಯೆಯ ಪುರಾವೆ", "service.verify.desc": "Before-and-after evidence is logged with tamper-proof timestamps. Citizens verify resolution, not just officials.",
    "service.transparent": "ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಹೊಣೆಗಾರಿಕೆ", "service.transparent.desc": "Every status change is publicly visible. Auto-escalation triggers when response deadlines are missed by authorities.",
    "service.commval": "ಸಮುದಾಯ ಪರಿಶೀಲನೆ", "service.commval.desc": "Genuineness scores and consensus voting allow communities to validate and amplify complaints that affect them.",
    // Landing - Sectors
    "sectors.label": "ವಲಯಗಳು",
    // Landing - Principles
    "principles.label": "ನಮ್ಮ ವಿಧಾನ", "principles.heading": "ನಮ್ಮ ವಿಧಾನದ ಮಾರ್ಗದರ್ಶಿ ತತ್ವಗಳು",
    // Landing - CTA
    "cta.title": "ನಿಮ್ಮ ಧ್ವನಿ ಮುಖ್ಯವಾಗಿದೆ", "cta.desc": "Every complaint is a step toward accountability. Report safely. Track transparently. Demand action.", "cta.btn": "ಈಗ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    // Footer extras
    "footer.report": "Report an Issue", "footer.trackComplaint": "Track Complaint", "footer.dashboard": "Public Dashboard", "footer.guidelines": "Community Guidelines", "footer.stories": "Success Stories", "footer.faq": "FAQ", "footer.directory": "Authority Directory", "footer.support": "Support Center", "footer.connect": "Connect With Us", "footer.email": "Email Address", "footer.newsletter": "Join Newsletter", "footer.rights": "All rights reserved.", "footer.made": "Made with", "footer.country": "for India",
    // Impact Section
    "impact.heading": "ವಿಶ್ವಾಸ್ ವೇದಿಕೆಯ ಪ್ರಭಾವ", "impact.years": "ವರ್ಷಗಳು", "impact.districts": "ಜಿಲ್ಲೆಗಳು", "impact.evaluations": "ಮೌಲ್ಯಮಾಪನಗಳು", "impact.study": "ವಿಶ್ವಾಸ್ ನಡೆಸಿದ ಅಧ್ಯಯನದಲ್ಲಿ, ನಮ್ಮ ವೇದಿಕೆ ಇತರ ವ್ಯವಸ್ಥೆಗಳಿಗಿಂತ ಅನುಕೂಲಗಳನ್ನು ತೋರಿಸಿದೆ.", "impact.effective": "ಹೆಚ್ಚು ಪರಿಣಾಮಕಾರಿ", "impact.learnmore": "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    // ComplaintPost extras
    "post.anonymous": "ಅನಾಮಧೇಯ ನಾಗರಿಕ", "post.verified": "ಪರಿಶೀಲಿಸಿದ ನಾಗರಿಕ", "post.sentTo": "ಇದಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ:", "post.needsVotes": "ಅಧಿಕಾರಿಗಳನ್ನು ಎಚ್ಚರಿಸಲು ಹೆಚ್ಚಿನ ಮತಗಳು.", "post.communityFund": "ಸಮುದಾಯ ನಿಧಿ", "post.boostAction": "ಸಮುದಾಯ ಕ್ರಿಯೆಯನ್ನು ಹೆಚ್ಚಿಸಿ", "post.escrow": "ಕಾನೂನು ಕ್ರಮಕ್ಕಾಗಿ ಹಣವನ್ನು ಎಸ್ಕ್ರೊದಲ್ಲಿ ಇರಿಸಲಾಗಿದೆ.", "post.confirm": "ಬೆಂಬಲವನ್ನು ಖಚಿತಪಡಿಸಿ",
    // Community empty
    "comm.empty.title": "ಯಾವುದೇ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ", "comm.empty.desc": "ನಿಮ್ಮ ಸಮುದಾಯಕ್ಕಾಗಿ ಸಮಸ್ಯೆಯನ್ನು ಎತ್ತುವ ಮೊದಲ ವ್ಯಕ್ತಿಯಾಗಿರಿ.",
    // Navbar mobile
    "nav.selectLang": "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
  },
  te: {
    "nav.home": "హోమ్", "nav.community": "సంఘం", "nav.submit": "సమస్యను నివేదించండి", "nav.track": "ట్రాక్ చేయండి", "nav.dashboard": "డాష్‌బోర్డ్",
    "home.title": "మీ వాయిస్. మీ హక్కు. మీ న్యాయం.", "home.subtitle": "పారదర్శకతతో స్థానిక సమస్యలను నివేదించండి.",
    "home.btn.report": "సమస్యను నివేదించండి", "home.btn.track": "స్థితిని ట్రాక్ చేయండి",
    "home.stat.active": "సక్రియ ఫిర్యాదులు", "home.stat.citizens": "సాధికారత పొందిన పౌరులు", "home.stat.departments": "కనెక్ట్ చేయబడిన విభాగాలు",
    "submit.title": "సమస్యను నివేదించండి", "submit.subtitle": "మీ ఫిర్యాదు సురక్షితం", "submit.step.speak": "మాట్లాడండి", "submit.step.category": "వర్గం", "submit.step.details": "వివరాలు", "submit.step.submit": "సమర్పించండి",
    "submit.input.voice": "వాయిస్", "submit.input.text": "టెక్స్ట్", "submit.input.placeholder": "మీ సమస్యను వివరించండి",
    "submit.upload.title": "ఫోటో లేదా వీడియోను జత చేయండి", "submit.upload.subtitle": "సాక్ష్యం ఫిర్యాదును వేగంగా ధృవీకరించడానికి సహాయపడుతుంది",
    "submit.category.title": "ఇది దేని గురించి?", "submit.btn.continue": "కొనసాగించు", "submit.btn.back": "వెనుకకు",
    "comm.title": "కమ్యూనిటీ యాక్షన్", "comm.subtitle": "అధికారులకు AI ఆటోమేటిక్ ఎస్కలేషన్ ట్రిగ్గర్ చేయడానికి స్థానిక సమస్యలను ధృవీకరించండి.",
    "comm.tab.trending": "ట్రెండింగ్ ఫీడ్", "comm.tab.escalated": "AI ఎస్కలేట్ చేయబడింది", "comm.tab.funding": "నిధులు అవసరం", "comm.top": "టాప్ వెరిఫైడ్ సమస్యలు",
    "comm.post.pending": "ధృవీకరణ పెండింగ్", "comm.post.routed": "AI ఆటో-రౌటెడ్", "comm.post.boost": "ఫండ్‌ను బూస్ట్ చేయండి", "comm.post.reply": "ప్రత్యుత్తరం ఇవ్వండి",

    "impact.title": "ట్రస్ట్-మధ్యవర్తిత్వ పౌర ఫిర్యాదుల వ్యవస్థ", "impact.description": "VISHWAS పబ్లిక్ ఫిర్యాదుల యొక్క పారదర్శక రికార్డును సృష్టిస్తుంది. సంఘం ద్వారా ధృవీకరించబడిన తర్వాత, దానిని అధికారులు దాచలేరు లేదా తొలగించలేరు.",
    "sectors.title": "మేము పరిష్కరించే సమస్యలు",
    "how.title": "అనుకూలీకరించిన స్థానిక పరిష్కారాలు",
    "footer.quick": "త్వరిత లింక్‌లు", "footer.legal": "చట్టపరమైన", "footer.desc": "పారదర్శక పౌర చర్య ద్వారా నమ్మకాన్ని పెంచడం.", "footer.privacy": "గోప్యతా విధానం", "footer.terms": "సేవా నిబంధనలు",
    "track.title": "ఫిర్యాదు స్థితిని ట్రాక్ చేయండి", "track.subtitle": "మీ సమస్య యొక్క పురోగతిని చూడటానికి మీ ప్రత్యేక ID ని నమోదు చేయండి", "track.input": "ట్రాకింగ్ ID", "track.btn": "స్థితిని ట్రాక్ చేయండి", "track.error": "ఫిర్యాదు కనుగొనబడలేదు", "track.status.submitted": "సమర్పించబడింది", "track.status.verified": "ధృవీకరించబడింది", "track.status.assigned": "కేటాయించబడింది", "track.status.resolved": "పరిష్కరించబడింది", "track.timeline": "కాలక్రమం", "track.back": "హోమ్‌కు తిరిగి వెళ్ళు",
    "admin.title": "మంత్రి నియంత్రణ కేంద్రం", "admin.overview": "అవలోకనం", "admin.issues": "సక్రియ సమస్యలు", "admin.resolved": "పరిష్కరించబడింది", "admin.priority": "ప్రాధాన్యత", "admin.status": "స్థితి",
    "process.analyzing": "ఫిర్యాదు వివరాలను విశ్లేషిస్తోంది...", "process.identifying": "విభాగం మరియు అధికార పరిధిని గుర్తిస్తోంది...", "process.routing": "అధికారులకు సురక్షితంగా రౌటింగ్ చేస్తోంది...", "process.success": "ఫిర్యాదు విజయవంతంగా నమోదు చేయబడింది", "process.id": "మీ ట్రాకింగ్ ID", "process.btn": "స్థితిని ట్రాక్ చేయండి",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language"
  },
  ta: {
    "nav.home": "முகப்பு", "nav.community": "சமூகம்", "nav.submit": "புகாரளி", "nav.track": "தடமறி", "nav.dashboard": "டாஷ்போர்டு",
    "home.title": "உங்கள் குரல். உங்கள் உரிமை. உங்கள் நீதி.", "home.subtitle": "வெளிப்படைத்தன்மையுடன் உள்ளூர் பிரச்சினைகளை புகாரளிக்கவும்.",
    "home.btn.report": "புகாரளி", "home.btn.track": "நிலையை தடமறி",
    "home.stat.active": "செயலில் உள்ள புகார்கள்", "home.stat.citizens": "அதிகாரமளிக்கப்பட்ட குடிமக்கள்", "home.stat.departments": "இணைக்கப்பட்ட துறைகள்",
    "submit.title": "புகாரளி", "submit.subtitle": "உங்கள் புகார் பாதுகாப்பானது", "submit.step.speak": "பேசு", "submit.step.category": "வகை", "submit.step.details": "விவரங்கள்", "submit.step.submit": "சமர்ப்பி",
    "submit.input.voice": "குரல்", "submit.input.text": "உரை", "submit.input.placeholder": "உங்கள் பிரச்சினையை விவரிக்கவும்",
    "submit.upload.title": "புகைப்படம் அல்லது வீடியோவை இணைக்க", "submit.upload.subtitle": "ஆதாரம் புகாரை விரைவாக சரிபார்க்க உதவுகிறது",
    "submit.category.title": "இது எதைப் பற்றியது?", "submit.btn.continue": "தொடரவும்", "submit.btn.back": "பின் செல்லவும்",
    "comm.title": "சமூக நடவடிக்கை", "comm.subtitle": "அதிகாரிகளுக்கு AI தானியங்கி ஈர்ப்பைத் தூண்ட உள்ளூர் பிரச்சினைகளை சரிபார்க்கவும்.",
    "comm.tab.trending": "பிரபலமான ஃபீட்", "comm.tab.escalated": "AI உயர்த்தப்பட்டது", "comm.tab.funding": "நிதி தேவை", "comm.top": "சிறந்த சரிபார்க்கப்பட்ட பிரச்சினைகள்",
    "comm.post.pending": "சரிபார்ப்பு நிலுவையில் உள்ளது", "comm.post.routed": "AI ஆட்டோ-ரவுட்டட்", "comm.post.boost": "நிதியை அதிகரிக்க", "comm.post.reply": "பதிலளி",

    "impact.title": "நம்பிக்கை அடிப்படையிலான குறைதீர்க்கும் அமைப்பு", "impact.description": "VISHWAS பொது குறைகளின் வெளிப்படையான பதிவை உருவாக்குகிறது. சமூகம் சரிபார்த்த பிறகு, அதிகாரிகளால் அதை மறைக்கவோ அழிக்கவோ முடியாது.",
    "sectors.title": "நாங்கள் தீர்க்கும் பிரச்சினைகள்",
    "how.title": "தனிப்பயனாக்கப்பட்ட உள்ளூர் தீர்வுகள்",
    "footer.quick": "விரைவான இணைப்புகள்", "footer.legal": "சட்டப்பூர்வமான", "footer.desc": "வெளிப்படையான குடிமக்கள் நடவடிக்கை மூலம் நம்பிக்கையை உருவாக்குதல்.", "footer.privacy": "தனியுரிமை கொள்கை", "footer.terms": "சேவை விதிமுறைகள்",
    "track.title": "புகார் நிலையை தடமறி", "track.subtitle": "உங்கள் பிரச்சினையின் முன்னேற்றத்தைக் காண உங்கள் ஐடியை உள்ளிடவும்", "track.input": "டிராக்கிங் ஐடி", "track.btn": "நிலையை தடமறி", "track.error": "புகார் கிடைக்கவில்லை", "track.status.submitted": "சமர்ப்பிக்கப்பட்டது", "track.status.verified": "சரிபார்க்கப்பட்டது", "track.status.assigned": "ஒதுக்கப்பட்டுள்ளது", "track.status.resolved": "தீர்க்கப்பட்டது", "track.timeline": "காலவரிசை", "track.back": "முகப்புக்குத் திரும்பு",
    "admin.title": "அமைச்சக கட்டுப்பாட்டு மையம்", "admin.overview": "கண்ணோட்டம்", "admin.issues": "செயலில் உள்ள பிரச்சினைகள்", "admin.resolved": "தீர்க்கப்பட்டது", "admin.priority": "முன்னுரிமை", "admin.status": "நிலை",
    "process.analyzing": "புகார் விவரங்களை பகுப்பாய்வு செய்கிறது...", "process.identifying": "துறை மற்றும் அதிகார வரம்பை அடையாளப்படுத்துகிறது...", "process.routing": "அதிகாரிகளுக்கு பாதுகாப்பாக அனுப்புகிறது...", "process.success": "புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது", "process.id": "உங்கள் டிராக்கிங் ஐடி", "process.btn": "நிலையை தடமறி",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language"
  },
  ml: {
    "nav.home": "ഹോം", "nav.community": "സമൂഹം", "nav.submit": "പരാതി നൽകുക", "nav.track": "ട്രാക്ക് ചെയ്യുക", "nav.dashboard": "ഡാഷ്‌ബോർഡ്",
    "home.title": "നിങ്ങളുടെ ശബ്ദം. നിങ്ങളുടെ അവകാശം. നിങ്ങളുടെ നീതി.", "home.subtitle": "സുതാര്യതയോടെ പ്രാദേശിക പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യുക.",
    "home.btn.report": "പരാതി നൽകുക", "home.btn.track": "സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക",
    "home.stat.active": "സജീവ പരാതികൾ", "home.stat.citizens": "ശാക്തീകരിക്കപ്പെട്ട പൗരന്മാർ", "home.stat.departments": "ബന്ധിപ്പിച്ച വകുപ്പുകൾ",
    "submit.title": "പരാതി നൽകുക", "submit.subtitle": "നിങ്ങളുടെ പരാതി സുരക്ഷിതമാണ്", "submit.step.speak": "സംസാരിക്കുക", "submit.step.category": "വിഭാഗം", "submit.step.details": "വിശദാംശങ്ങൾ", "submit.step.submit": "സമർപ്പിക്കുക",
    "submit.input.voice": "ശബ്ദം", "submit.input.text": "ടെക്സ്റ്റ്", "submit.input.placeholder": "നിങ്ങളുടെ പ്രശ്നം വിശദീകരിക്കുക",
    "submit.upload.title": "ഫോട്ടോ അല്ലെങ്കിൽ വീഡിയോ ചേർക്കുക", "submit.upload.subtitle": "തെളിവ് പരാതി വേഗത്തിൽ പരിശോധിക്കാൻ സഹായിക്കുന്നു",
    "submit.category.title": "ഇതെന്തിനെക്കുറിച്ചാണ്?", "submit.btn.continue": "തുടരുക", "submit.btn.back": "തിരികെ",
    "comm.title": "സാമൂഹിക പ്രവർത്തനം", "comm.subtitle": "അധികാരികൾക്ക് AI ഓട്ടോമാറ്റിക് എസ്കലേഷൻ ട്രിഗർ ചെയ്യാൻ പ്രാദേശിക പ്രശ്നങ്ങൾ പരിശോധിക്കുക.",
    "comm.tab.trending": "ട്രെൻഡിംഗ് ഫീഡ്", "comm.tab.escalated": "AI എസ്കലേറ്റഡ്", "comm.tab.funding": "ഫണ്ടിംഗ് ആവശ്യമാണ്", "comm.top": "മികച്ച പരിശോധിച്ച പ്രശ്നങ്ങൾ",
    "comm.post.pending": "പരിശോധന ബാക്കിയുണ്ട്", "comm.post.routed": "AI ഓട്ടോ-റൂട്ടഡ്", "comm.post.boost": "ഫണ്ട് ബൂസ്റ്റ് ചെയ്യുക", "comm.post.reply": "മറുപടി നൽകുക",

    "impact.title": "ട്രസ്റ്റ് അധിഷ്ഠിത പൗര പരാതി സംവിധാനം", "impact.description": "VISHWAS പൊതു പരാതികളുടെ സുതാര്യമായ രേഖ സൃഷ്ടിക്കുന്നു. സമൂഹം പരിശോധിച്ചുകഴിഞ്ഞാൽ, അധികാരികൾക്ക് അത് മറയ്ക്കാനോ ഇല്ലാതാക്കാനോ കഴിയില്ല.",
    "sectors.title": "ഞങ്ങൾ പരിഹരിക്കുന്ന പ്രശ്നങ്ങൾ",
    "how.title": "അനുയോജ്യമായ പ്രാദേശിക പരിഹാരങ്ങൾ",
    "footer.quick": "ദ്രുത ലിങ്കുകൾ", "footer.legal": "നിയമപരം", "footer.desc": "സുതാര്യമായ പൗര നടപടിയിലൂടെ വിശ്വാസം വളർത്തുക.", "footer.privacy": "സ്വകാര്യതാ നയം", "footer.terms": "സേവന നിബന്ധനകൾ",
    "track.title": "പരാതിയുടെ നില ട്രാക്ക് ചെയ്യുക", "track.subtitle": "നിങ്ങളുടെ പ്രശ്നത്തിന്റെ പുരോഗതി കാണാൻ നിങ്ങളുടെ ഐഡി നൽകുക", "track.input": "ട്രാക്കിംഗ് ഐഡി", "track.btn": "സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക", "track.error": "പരാതി കണ്ടെത്തിയില്ല", "track.status.submitted": "സമർപ്പിച്ചു", "track.status.verified": "പരിശോധിച്ചു", "track.status.assigned": "ഏൽപ്പിച്ചു", "track.status.resolved": "പരിഹരിച്ചു", "track.timeline": "ടൈംലൈൻ", "track.back": "ഹോമിലേക്ക് മടങ്ങുക",
    "admin.title": "മന്ത്രിതല നിയന്ത്രണ കേന്ദ്രം", "admin.overview": "അവലോകനം", "admin.issues": "സജീവ പ്രശ്നങ്ങൾ", "admin.resolved": "പരിഹരിച്ചു", "admin.priority": "മുൻഗണന", "admin.status": "നില",
    "process.analyzing": "പരാതി വിശദാംശങ്ങൾ വിശകലനം ചെയ്യുന്നു...", "process.identifying": "വകുപ്പും അധികാരപരിധിയും തിരിച്ചറിയുന്നു...", "process.routing": "അധികാരികൾക്ക് സുരക്ഷിതമായി അയക്കുന്നു...", "process.success": "പരാതി വിജയകരമായി രജിസ്റ്റർ ചെയ്തു", "process.id": "നിങ്ങളുടെ ട്രാക്കിംഗ് ഐഡി", "process.btn": "സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language"
  },
  mr: {
    "nav.home": "मुख्यपृष्ठ", "nav.community": "समुदाय", "nav.submit": "तक्रार नोंदवा", "nav.track": "ट्रॅक करा", "nav.dashboard": "डॅशबोर्ड",
    "home.title": "तुमचा आवाज. तुमचा हक्क. तुमचा न्याय.", "home.subtitle": "पारदर्शकतेने स्थानिक समस्यांची नोंद करा.",
    "home.btn.report": "तक्रार नोंदवा", "home.btn.track": "स्थिती ट्रॅक करा",
    "home.stat.active": "सक्रिय तक्रारी", "home.stat.citizens": "सक्षम नागरिक", "home.stat.departments": "जोडलेले विभाग",
    "submit.title": "तक्रार नोंदवा", "submit.subtitle": "तुमची तक्रार सुरक्षित आहे", "submit.step.speak": "बोला", "submit.step.category": "श्रेणी", "submit.step.details": "तपशील", "submit.step.submit": "सबमिट करा",
    "submit.input.voice": "आवाज", "submit.input.text": "मजकूर", "submit.input.placeholder": "तुमच्या समस्येचे वर्णन करा",
    "submit.upload.title": "फोटो किंवा व्हिडिओ जोडा", "submit.upload.subtitle": "पुराव्यामुळे तक्रार लवकर सत्यापित होण्यास मदत होते",
    "submit.category.title": "हे कशाबद्दल आहे?", "submit.btn.continue": "पुढे जा", "submit.btn.back": "मागे",
    "comm.title": "सामुदायिक कारवाई", "comm.subtitle": "अधिकाऱ्यांपर्यंत स्वयंचलित AI एस्केलेशन ट्रिगर करण्यासाठी स्थानिक समस्यांची पडताळणी करा.",
    "comm.tab.trending": "ट्रेंडिंग फीड", "comm.tab.escalated": "AI ने एस्केलेट केले", "comm.tab.funding": "निधीची आवश्यकता", "comm.top": "शीर्ष सत्यापित समस्या",
    "comm.post.pending": "सत्यापन प्रलंबित", "comm.post.routed": "AI ऑटो-राउटेड", "comm.post.boost": "निधी वाढवा", "comm.post.reply": "प्रत्युत्तर द्या",

    "impact.title": "विश्वास-आधारित नागरी तक्रार प्रणाली", "impact.description": "VISHWAS सार्वजनिक तक्रारींची पारदर्शक नोंद तयार करते. एकदा समुदायाने सत्यापित केल्यानंतर, अधिकारी ती लपवू किंवा हटवू शकत नाहीत.",
    "sectors.title": "आम्ही सोडवत असलेल्या समस्या",
    "how.title": "सानुकूलित स्थानिक उपाय",
    "footer.quick": "जलद दुवे", "footer.legal": "कायदेशीर", "footer.desc": "पारदर्शक नागरी कारवाईद्वारे विश्वास निर्माण करणे.", "footer.privacy": "गोपनीयता धोरण", "footer.terms": "सेवा अटी",
    "track.title": "तक्रार स्थिती ट्रॅक करा", "track.subtitle": "तुमच्या समस्येची प्रगती पाहण्यासाठी तुमचा युनिक आयडी प्रविष्ट करा", "track.input": "ट्रॅकिंग आयडी", "track.btn": "स्थिती ट्रॅक करा", "track.error": "तक्रार आढळली नाही", "track.status.submitted": "सबमिट केले", "track.status.verified": "सत्यापित", "track.status.assigned": "सोपवले", "track.status.resolved": "सोडवले", "track.timeline": "टाइमलाइन", "track.back": "मुख्यपृष्ठावर परत जा",
    "admin.title": "मंत्री नियंत्रण केंद्र", "admin.overview": "आढावा", "admin.issues": "सक्रिय समस्या", "admin.resolved": "सोडवले", "admin.priority": "प्राधान्य", "admin.status": "स्थिती",
    "process.analyzing": "तक्रारीच्या तपशीलांचे विश्लेषण करत आहे...", "process.identifying": "विभाग आणि अधिकार क्षेत्र ओळखत आहे...", "process.routing": "अधिकाऱ्यांना सुरक्षितपणे पाठवत आहे...", "process.success": "तक्रार यशस्वीरित्या नोंदवली गेली", "process.id": "तुमचा ट्रॅकिंग आयडी आहे", "process.btn": "स्थिती ट्रॅक करा",
    // Landing - Trust Items
    "trust.anonymous": "अनामित अहवाल", "trust.identity": "ओळख सुरक्षित", "trust.community": "समुदायाद्वारे सत्यापित", "trust.tamper": "छेडछाड-मुक्त इतिहास",
    // Landing - Services
    "services.label": "सेवा", "services.heading": "थोडक्यात, आमचे व्यासपीठ समुदायांना न्याय मिळवून देण्यास मदत करते", "services.learn": "अधिक जाणून घ्या",
    "service.voice": "व्हॉइस-फर्स्ट इनटेक", "service.voice.desc": "Multilingual voice recording with automatic transcription. Citizens can report in their own language — no literacy required.",
    "service.ai": "एआय-चालित प्रक्रिया", "service.ai.desc": "Complaints are automatically categorized, prioritized, and summarized using intelligent rule-based analysis for instant routing.",
    "service.monitor": "कामगिरी निरीक्षण", "service.monitor.desc": "Real-time dashboards track complaint resolution rates, response times, and escalation patterns across all departments.",
    "service.verify": "कृतीचा पुरावा", "service.verify.desc": "Before-and-after evidence is logged with tamper-proof timestamps. Citizens verify resolution, not just officials.",
    "service.transparent": "पारदर्शकता आणि उत्तरदायित्व", "service.transparent.desc": "Every status change is publicly visible. Auto-escalation triggers when response deadlines are missed by authorities.",
    "service.commval": "समुदाय पडताळणी", "service.commval.desc": "Genuineness scores and consensus voting allow communities to validate and amplify complaints that affect them.",
    // Landing - Sectors
    "sectors.label": "क्षेत्रे",
    // Landing - Principles
    "principles.label": "आमचा दृष्टीकोन", "principles.heading": "आमच्या दृष्टीकोनाची मार्गदर्शक तत्त्वे",
    // Landing - CTA
    "cta.title": "तुमचा आवाज महत्त्वाचा आहे", "cta.desc": "Every complaint is a step toward accountability. Report safely. Track transparently. Demand action.", "cta.btn": "आता समस्येची तक्रार करा",
    // Footer extras
    "footer.report": "Report an Issue", "footer.trackComplaint": "Track Complaint", "footer.dashboard": "Public Dashboard", "footer.guidelines": "Community Guidelines", "footer.stories": "Success Stories", "footer.faq": "FAQ", "footer.directory": "Authority Directory", "footer.support": "Support Center", "footer.connect": "Connect With Us", "footer.email": "Email Address", "footer.newsletter": "Join Newsletter", "footer.rights": "All rights reserved.", "footer.made": "Made with", "footer.country": "for India",
    // Impact Section
    "impact.heading": "विश्वास प्लॅटफॉर्मचा प्रभाव", "impact.years": "वर्षे", "impact.districts": "जिल्हे", "impact.evaluations": "मूल्यांकन", "impact.study": "विश्वासने केलेल्या अभ्यासात, आमच्या प्लॅटफॉर्मने इतर प्रणालींपेक्षा फायदे दर्शविले.", "impact.effective": "अधिक प्रभावी", "impact.learnmore": "अधिक जाणून घ्या",
    // ComplaintPost extras
    "post.anonymous": "अनामित नागरिक", "post.verified": "सत्यापित नागरिक", "post.sentTo": "पाठवले:", "post.needsVotes": "अधिकार्यांना सतर्क करण्यासाठी अधिक मते.", "post.communityFund": "समुदाय निधी", "post.boostAction": "सामुदायिक कृतीला चालना द्या", "post.escrow": "कायदेशीर कारवाईसाठी निधी एस्क्रोमध्ये ठेवला जातो.", "post.confirm": "समर्थनाची पुष्टी करा",
    // Community empty
    "comm.empty.title": "कोणतीही तक्रार आढळली नाही", "comm.empty.desc": "तुमच्या समुदायासाठी समस्या मांडणारे पहिले व्हा.",
    // Navbar mobile
    "nav.selectLang": "भाषा निवडा",
    "home.hero.speak": "आवाज उठवा.",
    "home.hero.stay": "सुरक्षित राहा.",
    "home.hero.see": "न्याय पाहा.",
    "home.hero.tagline": "तुमचा आवाज. तुमचा हक्क. तुमचा न्याय. निनावीपणे तक्रार करा, प्रगतीचा मागोवा घ्या आणि अधिकाऱ्यांना जबाबदार धरा.",
  },
  gu: {
    "nav.home": "હોમ", "nav.community": "સમુદાય", "nav.submit": "સમસ્યા નોંધાવો", "nav.track": "ટ્રેક કરો", "nav.dashboard": "ડેશબોર્ડ",
    "home.title": "તમારો અવાજ. તમારો અધિકાર. તમારો ન્યાય.", "home.subtitle": "પારદર્શિતા સાથે સ્થાનિક સમસ્યાઓની જાણ કરો.",
    "home.btn.report": "સમસ્યા નોંધાવો", "home.btn.track": "સ્થિતિ ટ્રેક કરો",
    "home.stat.active": "સક્રિય ફરિયાદો", "home.stat.citizens": "સશક્ત નાગરિકો", "home.stat.departments": "જોડાયેલા વિભાગો",
    "submit.title": "સમસ્યા નોંધાવો", "submit.subtitle": "તમારી ફરિયાદ સુરક્ષિત છે", "submit.step.speak": "બોલો", "submit.step.category": "શ્રેણી", "submit.step.details": "વિગતો", "submit.step.submit": "સબમિટ કરો",
    "submit.input.voice": "અવાજ", "submit.input.text": "લખાણ", "submit.input.placeholder": "તમારી સમસ્યાનું વર્ણન કરો",
    "submit.upload.title": "ફોટો અથવા વિડિઓ જોડો", "submit.upload.subtitle": "પુરાવા ફરિયાદને ઝડપથી ચકાસવામાં મદદ કરે છે",
    "submit.category.title": "આ શેના વિશે છે?", "submit.btn.continue": "આગળ વધો", "submit.btn.back": "પાછા જાઓ",
    "comm.title": "સામુદાયિક કાર્યવાહી", "comm.subtitle": "અધિકારીઓને સ્વચાલિત AI એસ્કેલેશન ટ્રિગર કરવા માટે સ્થાનિક સમસ્યાઓની ચકાસણી કરો.",
    "comm.tab.trending": "ટ્રેન્ડિંગ ફીડ", "comm.tab.escalated": "AI દ્વારા એસ્કેલેટેડ", "comm.tab.funding": "ફંડિંગની જરૂર છે", "comm.top": "ટોચની ચકાસાયેલ સમસ્યાઓ",
    "comm.post.pending": "ચકાસણી પેન્ડિંગ", "comm.post.routed": "AI ઓટો-રાઉટેડ", "comm.post.boost": "ફંડ વધારો", "comm.post.reply": "જવાબ આપો",

    "impact.title": "ટ્રસ્ટ-આધારિત નાગરિક ફરિયાદ સિસ્ટમ", "impact.description": "VISHWAS જાહેર ફરિયાદોનો પારદર્શક રેકોર્ડ બનાવે છે. એકવાર સમુદાય દ્વારા ચકાસણી થયા પછી, અધિકારીઓ તેને છુપાવી કે ભૂંસી શકતા નથી.",
    "sectors.title": "અમે હલ કરીએ છીએ તે સમસ્યાઓ",
    "how.title": "કસ્ટમાઇઝ્ડ સ્થાનિક ઉકેલો",
    "footer.quick": "ઝડપી લિંક્સ", "footer.legal": "કાનૂની", "footer.desc": "પારદર્શક નાગરિક કાર્યવાહી દ્વારા વિશ્વાસનું નિર્માણ.", "footer.privacy": "ગોપનીયતા નીતિ", "footer.terms": "સેવાની શરતો",
    "track.title": "ફરિયાદની સ્થિતિ ટ્રેક કરો", "track.subtitle": "તમારી સમસ્યાની પ્રગતિ જોવા માટે તમારું ID દાખલ કરો", "track.input": "ટ્રેકિંગ ID", "track.btn": "સ્થિતિ ટ્રેક કરો", "track.error": "ફરિયાદ મળી નથી", "track.status.submitted": "સબમિટ કર્યું", "track.status.verified": "ચકાસાયેલ", "track.status.assigned": "સોંપાયેલ", "track.status.resolved": "ઉકેલાયેલ", "track.timeline": "સમયરેખા", "track.back": "હોમ પર પાછા જાઓ",
    "admin.title": "મંત્રી નિયંત્રણ કેન્દ્ર", "admin.overview": "ઝાંખી", "admin.issues": "સક્રિય સમસ્યાઓ", "admin.resolved": "ઉકેલાયેલ", "admin.priority": "પ્રાથમિકતા", "admin.status": "સ્થિતિ",
    "process.analyzing": "ફરિયાદની વિગતોનું વિશ્લેષણ કરી રહ્યા છીએ...", "process.identifying": "વિભાગ અને અધિકારક્ષેત્રની ઓળખ કરી રહ્યા છીએ...", "process.routing": "અધિકારીઓને સુરક્ષિત રીતે મોકલી રહ્યા છીએ...", "process.success": "ફરિયાદ સફળતાપૂર્વક નોંધાઈ ગઈ", "process.id": "તમારો ટ્રેકિંગ ID છે", "process.btn": "સ્થિતિ ટ્રેક કરો",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language",
    "home.hero.speak": "Speak Up.",
    "home.hero.stay": "Stay Safe.",
    "home.hero.see": "See Justice.",
    "home.hero.tagline": "Your Voice. Your Right. Your Justice. Report issues anonymously with your voice, track real progress, and hold authorities accountable.",
  },
  bn: {
    "nav.home": "হোম", "nav.community": "সম্প্রদায়", "nav.submit": "সমস্যা জানান", "nav.track": "ট্র্যাক করুন", "nav.dashboard": "ড্যাশবোর্ড",
    "home.title": "আপনার কণ্ঠ। আপনার অধিকার। আপনার বিচার।", "home.subtitle": "স্বচ্ছতার সাথে স্থানীয় সমস্যার রিপোর্ট করুন।",
    "home.btn.report": "সমস্যা জানান", "home.btn.track": "স্ট্যাটাস ট্র্যাক করুন",
    "home.stat.active": "সক্রিয় অভিযোগ", "home.stat.citizens": "ক্ষমতায়িত নাগরিক", "home.stat.departments": "সংযুক্ত বিভাগসমূহ",
    "submit.title": "সমস্যা জানান", "submit.subtitle": "আপনার অভিযোগ নিরাপদ", "submit.step.speak": "বলুন", "submit.step.category": "বিভাগ", "submit.step.details": "বিবরণ", "submit.step.submit": "জমা দিন",
    "submit.input.voice": "কণ্ঠস্বর", "submit.input.text": "টেক্সট", "submit.input.placeholder": "আপনার সমস্যা বর্ণনা করুন",
    "submit.upload.title": "ছবি বা ভিডিও যুক্ত করুন", "submit.upload.subtitle": "প্রমাণ অভিযোগ দ্রুত যাচাই করতে সাহায্য করে",
    "submit.category.title": "এটি কী সম্পর্কে?", "submit.btn.continue": "চালিয়ে যান", "submit.btn.back": "পিছনে",
    "comm.title": "সাম্প্রদায়িক পদক্ষেপ", "comm.subtitle": "কর্তৃপক্ষের কাছে স্বয়ংক্রিয় এআই এস্কেলোশন ট্রিগার করতে স্থানীয় সমস্যা যাচাই করুন।",
    "comm.tab.trending": "ট্রেন্ডিং ফিড", "comm.tab.escalated": "এআই এস্কেলেটেড", "comm.tab.funding": "তহবিল প্রয়োজন", "comm.top": "শীর্ষ যাচাইকৃত সমস্যা",
    "comm.post.pending": "যাচাইকরণ মুলতুবি", "comm.post.routed": "এআই অটো-রাউটেড", "comm.post.boost": "তহবিল বাড়ান", "comm.post.reply": "উত্তর দিন",

    "impact.title": "আস্থা-ভিত্তিক নাগরিক অভিযোগ ব্যবস্থা", "impact.description": "VISHWAS জনসাধারণের অভিযোগের একটি স্বচ্ছ রেকর্ড তৈরি করে। একবার সম্প্রদায় দ্বারা যাচাই করা হলে, কর্তৃপক্ষ এটি লুকাতে বা মুছতে পারে না।",
    "sectors.title": "আমরা যে সমস্যাগুলি সমাধান করি",
    "how.title": "কাস্টমাইজড স্থানীয় সমাধান",
    "footer.quick": "গুরুত্বপূর্ণ লিঙ্ক", "footer.legal": "আইনি", "footer.desc": "স্বচ্ছ নাগরিক পদক্ষেপের মাধ্যমে আস্থা তৈরি করা।", "footer.privacy": "গোপনীয়তা নীতি", "footer.terms": "পরিষেবার শর্তাবলী",
    "track.title": "অভিযোগের স্ট্যাটাস ট্র্যাক করুন", "track.subtitle": "আপনার সমস্যার অগ্রগতি দেখতে আপনার আইডি লিখুন", "track.input": "ট্র্যাকিং আইডি", "track.btn": "স্ট্যাটাস ট্র্যাক করুন", "track.error": "অভিযোগ পাওয়া যায়নি", "track.status.submitted": "জমা দেওয়া হয়েছে", "track.status.verified": "যাচাই করা হয়েছে", "track.status.assigned": "বরাদ্দ করা হয়েছে", "track.status.resolved": "সমাধান করা হয়েছে", "track.timeline": "সময়রেখা", "track.back": "হোমে ফিরে যান",
    "admin.title": "মন্ত্রিসভা নিয়ন্ত্রণ কেন্দ্র", "admin.overview": "ওভারভিউ", "admin.issues": "সক্রিয় সমস্যা", "admin.resolved": "সমাধান করা হয়েছে", "admin.priority": "অগ্রাধিকার", "admin.status": "স্ট্যাটাস",
    "process.analyzing": "অভিযোগের বিবরণ বিশ্লেষণ করা হচ্ছে...", "process.identifying": "বিভাগ এবং এখতিয়ার চিহ্নিত করা হচ্ছে...", "process.routing": "কর্তৃপক্ষের কাছে নিরাপদে পাঠানো হচ্ছে...", "process.success": "অভিযোগ সফলভাবে নিবন্ধিত হয়েছে", "process.id": "আপনার ট্র্যাকিং আইডি হল", "process.btn": "স্ট্যাটাস ট্র্যাক করুন",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language",
    "home.hero.speak": "Speak Up.",
    "home.hero.stay": "Stay Safe.",
    "home.hero.see": "See Justice.",
    "home.hero.tagline": "Your Voice. Your Right. Your Justice. Report issues anonymously with your voice, track real progress, and hold authorities accountable.",
  },
  pa: {
    "nav.home": "ਹੋਮ", "nav.community": "ਭਾਈਚਾਰਾ", "nav.submit": "ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ", "nav.track": "ਟ੍ਰੈਕ ਕਰੋ", "nav.dashboard": "ਡੈਸ਼ਬੋਰਡ",
    "home.title": "ਤੁਹਾਡੀ ਆਵਾਜ਼. ਤੁਹਾਡਾ ਹੱਕ. ਤੁਹਾਡਾ ਇਨਸਾਫ਼.", "home.subtitle": "ਪਾਰਦਰਸ਼ਤਾ ਨਾਲ ਸਥਾਨਕ ਮੁੱਦਿਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ.",
    "home.btn.report": "ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ", "home.btn.track": "ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
    "home.stat.active": "ਸਰਗਰਮ ਸ਼ਿਕਾਇਤਾਂ", "home.stat.citizens": "ਸਸ਼ਕਤ ਨਾਗਰਿਕ", "home.stat.departments": "ਜੁੜੇ ਹੋਏ ਵਿਭਾਗ",
    "submit.title": "ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ", "submit.subtitle": "ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਸੁਰੱਖਿਅਤ ਹੈ", "submit.step.speak": "ਬੋਲੋ", "submit.step.category": "ਸ਼੍ਰੇਣੀ", "submit.step.details": "ਵੇਰਵੇ", "submit.step.submit": "ਸਬਮਿਟ ਕਰੋ",
    "submit.input.voice": "ਆਵਾਜ਼", "submit.input.text": "ਟੈਕਸਟ", "submit.input.placeholder": "ਆਪਣੀ ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ",
    "submit.upload.title": "ਫੋਟੋ ਜਾਂ ਵੀਡੀਓ ਨੱਥੀ ਕਰੋ", "submit.upload.subtitle": "ਸਬੂਤ ਸ਼ਿਕਾਇਤ ਨੂੰ ਜਲਦੀ ਤਸਦੀਕ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ",
    "submit.category.title": "ਇਹ ਕਿਸ ਬਾਰੇ ਹੈ?", "submit.btn.continue": "ਜਾਰੀ ਰੱਖੋ", "submit.btn.back": "ਪਿੱਛੇ",
    "comm.title": "ਭਾਈਚਾਰਕ ਕਾਰਵਾਈ", "comm.subtitle": "ਅਧਿਕਾਰੀਆਂ ਨੂੰ ਆਟੋਮੈਟਿਕ ਏਆਈ ਐਸਕੇਲੇਸ਼ਨ ਨੂੰ ਟਰਿੱਗਰ ਕਰਨ ਲਈ ਸਥਾਨਕ ਮੁੱਦਿਆਂ ਦੀ ਤਸਦੀਕ ਕਰੋ.",
    "comm.tab.trending": "ਟ੍ਰੈਂਡਿੰਗ ਫੀਡ", "comm.tab.escalated": "ਏਆਈ ਐਸਕੇਲੇਟਿਡ", "comm.tab.funding": "ਫੰਡਿੰਗ ਦੀ ਲੋੜ ਹੈ", "comm.top": "ਚੋਟੀ ਦੀਆਂ ਤਸਦੀਕਸ਼ੁਦਾ ਸਮੱਸਿਆਵਾਂ",
    "comm.post.pending": "ਤਸਦੀਕ ਬਾਕੀ ਹੈ", "comm.post.routed": "ਏਆਈ ਆਟੋ-ਰਾਊਟਡ", "comm.post.boost": "ਫੰਡ ਵਧਾਓ", "comm.post.reply": "ਜਵਾਬ ਦਿਓ",

    "impact.title": "ਟਰੱਸਟ-ਅਧਾਰਤ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਪ੍ਰਣਾਲੀ", "impact.description": "VISHWAS ਜਨਤਕ ਸ਼ਿਕਾਇਤਾਂ ਦਾ ਇੱਕ ਪਾਰਦਰਸ਼ੀ ਰਿਕਾਰਡ ਬਣਾਉਂਦਾ ਹੈ। ਇੱਕ ਵਾਰ ਭਾਈਚਾਰੇ ਦੁਆਰਾ ਤਸਦੀਕ ਕੀਤੇ ਜਾਣ ਤੋਂ ਬਾਅਦ, ਅਧਿਕਾਰੀ ਇਸਨੂੰ ਲੁਕਾ ਜਾਂ ਮਿਟਾ ਨਹੀਂ ਸਕਦੇ।",
    "sectors.title": "ਅਸੀਂ ਜਿਨ੍ਹਾਂ ਮੁੱਦਿਆਂ ਨੂੰ ਹੱਲ ਕਰਦੇ ਹਾਂ",
    "how.title": "ਅਨੁਕੂਲਿਤ ਸਥਾਨਕ ਹੱਲ",
    "footer.quick": "ਤੇਜ਼ ਲਿੰਕ", "footer.legal": "ਕਾਨੂੰਨੀ", "footer.desc": "ਪਾਰਦਰਸ਼ੀ ਨਾਗਰਿਕ ਕਾਰਵਾਈ ਦੁਆਰਾ ਵਿਸ਼ਵਾਸ ਪੈਦਾ ਕਰਨਾ।", "footer.privacy": "ਗੋਪਨੀਯਤਾ ਨੀਤੀ", "footer.terms": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",
    "track.title": "ਸ਼ਿਕਾਇਤ ਦੀ ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ", "track.subtitle": "ਆਪਣੀ ਸਮੱਸਿਆ ਦੀ ਪ੍ਰਗਤੀ ਦੇਖਣ ਲਈ ਆਪਣਾ ਆਈਡੀ ਦਾਖਲ ਕਰੋ", "track.input": "ਟ੍ਰੈਕਿੰਗ ਆਈਡੀ", "track.btn": "ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ", "track.error": "ਸ਼ਿਕਾਇਤ ਨਹੀਂ ਮਿਲੀ", "track.status.submitted": "ਜਮ੍ਹਾਂ ਕਰਵਾਇਆ ਗਿਆ", "track.status.verified": "ਤਸਦੀਕਸ਼ੁਦਾ", "track.status.assigned": "ਸੌਂਪਿਆ ਗਿਆ", "track.status.resolved": "ਹੱਲ ਕੀਤਾ ਗਿਆ", "track.timeline": "ਸਮਾਂਰੇਖਾ", "track.back": "ਹੋਮ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    "admin.title": "ਮੰਤਰੀ ਕੰਟਰੋਲ ਕੇਂਦਰ", "admin.overview": "ਸੰਖੇਪ ਜਾਣਕਾਰੀ", "admin.issues": "ਸਰਗਰਮ ਮੁੱਦੇ", "admin.resolved": "ਹੱਲ ਕੀਤਾ ਗਿਆ", "admin.priority": "ਤਰਜੀਹ", "admin.status": "ਸਥਿਤੀ",
    "process.analyzing": "ਸ਼ਿਕਾਇਤ ਦੇ ਵੇਰਵਿਆਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...", "process.identifying": "ਵਿਭਾਗ ਅਤੇ ਅਧਿਕਾਰ ਖੇਤਰ ਦੀ ਪਛਾਣ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...", "process.routing": "ਅਧਿਕਾਰੀਆਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...", "process.success": "ਸ਼ਿਕਾਇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕੀਤੀ ਗਈ", "process.id": "ਤੁਹਾਡੀ ਟ੍ਰੈਕਿੰਗ ਆਈਡੀ ਹੈ", "process.btn": "ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language",
    "home.hero.speak": "Speak Up.",
    "home.hero.stay": "Stay Safe.",
    "home.hero.see": "See Justice.",
    "home.hero.tagline": "Your Voice. Your Right. Your Justice. Report issues anonymously with your voice, track real progress, and hold authorities accountable.",
  },
  or: {
    "nav.home": "ହୋମ୍", "nav.community": "ସମ୍ପ୍ରଦାୟ", "nav.submit": "ସମସ୍ୟା ଦାଖଲ କରନ୍ତୁ", "nav.track": "ଟ୍ରାକ୍ କରନ୍ତୁ", "nav.dashboard": "ଡ୍ୟାସବୋର୍ଡ",
    "home.title": "ଆପଣଙ୍କ ସ୍ୱର. ଆପଣଙ୍କ ଅଧିକାର. ଆପଣଙ୍କ ନ୍ୟାୟ.", "home.subtitle": "ସ୍ୱଚ୍ଛତା ସହିତ ସ୍ଥାନୀୟ ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ।",
    "home.btn.report": "ସମସ୍ୟା ଦାଖଲ କରନ୍ତୁ", "home.btn.track": "ସ୍ଥିତି ଟ୍ରାକ୍ କରନ୍ତୁ",
    "home.stat.active": "ସକ୍ରିୟ ଅଭିଯୋଗ", "home.stat.citizens": "ସଶକ୍ତ ନାଗରିକ", "home.stat.departments": "ସଂଯୁକ୍ତ ବିଭାଗ",
    "submit.title": "ସମସ୍ୟା ଦାଖଲ କରନ୍ତୁ", "submit.subtitle": "ଆପଣଙ୍କ ଅଭିଯୋଗ ସୁରକ୍ଷିତ", "submit.step.speak": "କୁହନ୍ତୁ", "submit.step.category": "ଶ୍ରେଣୀ", "submit.step.details": "ବିବରଣୀ", "submit.step.submit": "ଦାଖଲ କରନ୍ତୁ",
    "submit.input.voice": "ସ୍ୱର", "submit.input.text": "ଟେକ୍ସଟ୍", "submit.input.placeholder": "ଆପଣଙ୍କ ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ",
    "submit.upload.title": "ଫଟୋ କିମ୍ବା ଭିଡିଓ ଯୋଡନ୍ତୁ", "submit.upload.subtitle": "ପ୍ରମାଣ ଅଭିଯୋଗକୁ ଶୀଘ୍ର ଯାଞ୍ଚ କରିବାରେ ସାହାଯ୍ୟ କରେ",
    "submit.category.title": "ଏହା କେଉଁ ବିଷୟରେ?", "submit.btn.continue": "ଆଗକୁ ବଢନ୍ତୁ", "submit.btn.back": "ପଛକୁ ଯାଆନ୍ତୁ",
    "comm.title": "ସମ୍ପ୍ରଦାୟିକ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ", "comm.subtitle": "ଅଧିକାରୀମାନଙ୍କୁ ସ୍ୱୟଂଚାଳିତ ଏଆଇ ଏସ୍କାଲେସନ୍ ଟ୍ରିଗର କରିବାକୁ ସ୍ଥାନୀୟ ସମସ୍ୟା ଯାଞ୍ଚ କରନ୍ତୁ।",
    "comm.tab.trending": "ଟ୍ରେଣ୍ଡିଂ ଫିଡ୍", "comm.tab.escalated": "ଏଆଇ ଏସ୍କାଲେଟେଡ୍", "comm.tab.funding": "ପାଣ୍ଠି ଆବଶ୍ୟକ", "comm.top": "ଶୀର୍ଷ ଯାଞ୍ଚ ହୋଇଥିବା ସମସ୍ୟାଗୁଡ଼ିକ",
    "comm.post.pending": "ଯାଞ୍ଚ ବାକି ଅଛି", "comm.post.routed": "ଏଆଇ ଅଟୋ-ରାଉଟେଡ୍", "comm.post.boost": "ପାଣ୍ଠି ବଢାନ୍ତୁ", "comm.post.reply": "ଉତ୍ତର ଦିଅନ୍ତୁ",

    "impact.title": "ବିଶ୍ୱାସ-ଆଧାରିତ ନାଗରିକ ଅଭିଯୋଗ ବ୍ୟବସ୍ଥା", "impact.description": "VISHWAS ସାଧାରଣ ଅଭିଯୋଗଗୁଡ଼ିକର ଏକ ସ୍ୱଚ୍ଛ ରେକର୍ଡ ସୃଷ୍ଟି କରେ। ସମ୍ପ୍ରଦାୟ ଦ୍ୱାରା ଥରେ ଯାଞ୍ଚ ହେବା ପରେ, ଅଧିକାରୀମାନେ ଏହାକୁ ଲୁଚାଇ କିମ୍ବା ଡିଲିଟ୍ କରିପାରିବେ ନାହିଁ।",
    "sectors.title": "ଆମେ ସମାଧାନ କରୁଥିବା ସମସ୍ୟାଗୁଡ଼ିକ",
    "how.title": "କଷ୍ଟମାଇଜ୍ ହୋଇଥିବା ସ୍ଥାନୀୟ ସମାଧାନ",
    "footer.quick": "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଲିଙ୍କ୍", "footer.legal": "ଆଇନଗତ", "footer.desc": "ସ୍ୱଚ୍ଛ ନାଗରିକ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ମାଧ୍ୟମରେ ବିଶ୍ୱାସ ସୃଷ୍ଟି କରିବା।", "footer.privacy": "ଗୋପନୀୟତା ନୀତି", "footer.terms": "ସେବା ସର୍ତ୍ତାବଳୀ",
    "track.title": "ଅଭିଯୋଗ ସ୍ଥିତି ଟ୍ରାକ୍ କରନ୍ତୁ", "track.subtitle": "ଆପଣଙ୍କ ସମସ୍ୟାର ପ୍ରଗତି ଦେଖିବାକୁ ଆପଣଙ୍କ ଆଇଡି ପ୍ରବେଶ କରନ୍ତୁ", "track.input": "ଟ୍ରାକିଂ ଆଇଡି", "track.btn": "ସ୍ଥିତି ଟ୍ରାକ୍ କରନ୍ତୁ", "track.error": "ଅଭିଯୋଗ ମିଳିଲା ନାହିଁ", "track.status.submitted": "ଦାଖଲ ହୋଇଛି", "track.status.verified": "ଯାଞ୍ଚ ହୋଇଛି", "track.status.assigned": "ନ୍ୟସ୍ତ କରାଯାଇଛି", "track.status.resolved": "ସମାଧାନ ହୋଇଛି", "track.timeline": "ସମୟରେଖା", "track.back": "ହୋମ୍ କୁ ଫେରନ୍ତୁ",
    "admin.title": "ମନ୍ତ୍ରୀ ନିୟନ୍ତ୍ରଣ କେନ୍ଦ୍ର", "admin.overview": "ସମୀକ୍ଷା", "admin.issues": "ସକ୍ରିୟ ସମସ୍ୟା", "admin.resolved": "ସମାଧାନ ହୋଇଛି", "admin.priority": "ପ୍ରାଥମିକତା", "admin.status": "ସ୍ଥିତି",
    "process.analyzing": "ଅଭିଯୋଗ ବିବରଣୀ ବିଶ୍ଳେଷଣ କରାଯାଉଛି...", "process.identifying": "ବିଭାଗ ଏବଂ ଅଧିକାର କ୍ଷେତ୍ର ଚିହ୍ନଟ କରାଯାଉଛି...", "process.routing": "ଅଧିକାରୀମାନଙ୍କ ନିକଟକୁ ସୁରକ୍ଷିତ ଭାବରେ ପଠାଯାଉଛି...", "process.success": "ଅଭିଯୋଗ ସଫଳତାର ସହ ପଞ୍ଜିକୃତ ହୋଇଛି", "process.id": "ଆପଣଙ୍କ ଟ୍ରାକିଂ ଆଇଡି ହେଉଛି", "process.btn": "ସ୍ଥିତି ଟ୍ରାକ୍ କରନ୍ତୁ",
    // Landing - Trust Items
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
    "nav.selectLang": "Select Language"
  }
};
